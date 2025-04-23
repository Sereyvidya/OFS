import os
import tempfile

import folium
import requests
import stripe
from dotenv import load_dotenv
from flask import Blueprint, jsonify, request, send_file
from flask_jwt_extended import get_jwt_identity, jwt_required

from .. import db
from ..models import CartItem, Order, OrderItem, Product, User

# For this to work, you need to install the following: pip install python-dotenv
# Make sure to create a stripe.env file inside the routes folder containing the stripe secret key
# You will NOT be able to push any commits if the secret key isn't in a .env file that is in .gitignore
dotenv_path = os.path.join(os.path.dirname(__file__), "stripe.env")
load_dotenv(dotenv_path=dotenv_path)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# A check to make sure the stripe.env file is correctly set up
if not stripe.api_key:
    raise ValueError("Stripe secret key not found.")

# Create a Blueprint for order-related routes
order_bp = Blueprint('order', __name__)

@order_bp.route('/add', methods=['POST'])
@jwt_required()
def place_order():
    data = request.get_json()

    street = data.get('street')
    city = data.get('city')
    state = data.get('state')
    zip_code = data.get('zip')
    total = data.get('total')
    cart_items = data.get('cartItems', [])
    payment_method_id = data.get('paymentMethodId')

    if not all([street, city, state, zip_code, total, cart_items, payment_method_id]):
        return jsonify({'error': 'Missing order or payment details'}), 400

    try:
        user_id = get_jwt_identity()

        total_in_cents = int(float(total) * 100)

        intent = stripe.PaymentIntent.create(
        amount=total_in_cents,
        currency='usd',
        payment_method=payment_method_id,
        confirm=True,
        automatic_payment_methods={
            'enabled': True,
            'allow_redirects': 'never'
        })

        if intent['status'] == 'succeeded':
            order = Order(
                userID=user_id,
                street=street,
                city=city,
                state=state,
                zip=zip_code,
                total=total
            )
            db.session.add(order)
            db.session.flush()

            for item in cart_items:
                product_id = item['productID']
                amount = item['quantity']

                order_item = OrderItem(
                    orderID=order.orderID,
                    productID=product_id,
                    quantity=amount,
                    priceAtPurchase=item['priceAtPurchase']
                )
                db.session.add(order_item)

                CartItem.query.filter_by(userID=user_id, productID=product_id).delete()

                product = Product.query.filter_by(productID=product_id).first()
                if product:
                    if product.quantity >= amount:
                        product.quantity -= amount
                    else:
                        db.session.rollback()
                        return jsonify({'error': f'Insufficient stock for product {product_id}'}), 400

            db.session.commit()
            return jsonify({'message': 'Order placed and payment successful'}), 201

        else:
            return jsonify({'error': 'Payment not successful'}), 402

    except stripe.error.CardError as e:
        return jsonify({'error': e.user_message}), 402

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@order_bp.route('/history', methods=['GET'])
@jwt_required()
def order_history():
    user_id = get_jwt_identity()

    orders = (
        Order.query
        .filter_by(userID=user_id)
        .order_by(Order.orderDate.desc())
        .all()
     )

    result = []
    for order in orders:
        items = OrderItem.query.filter_by(orderID=order.orderID).all()
        result.append({
            "orderID": order.orderID,
            "orderDate": order.orderDate.isoformat(),
            "total": float(order.total),
            "shippingAddress": {
                "street": order.street,
                "city": order.city,
                "state": order.state,
                "zip": order.zip
            },
            "items": [
                {
                    "productID": i.productID,
                    "productName": (
                        Product.query.get(i.productID).name
                        if Product.query.get(i.productID) else "Unknown"
                    ),
                    "quantity": i.quantity,
                    "priceAtPurchase": float(i.priceAtPurchase)
                }
                for i in items
            ]
        })

    return jsonify(result), 200

@order_bp.route('/optimized-route', methods=['GET'])
def get_optimized_route():
    MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")
    if not MAPBOX_TOKEN:
        return jsonify({"error": "Mapbox token not set"}), 500

    def calculate_order_weight(order):
        total_weight = 0
        for item in order.order_items:
            product = Product.query.get(item.productID)
            if product:
                total_weight += item.quantity * float(product.weight)
        return total_weight

    def get_order_coordinates(order):
        address = f"{order.street}, {order.city}, {order.state} {order.zip}"
        response = requests.get(
            f"https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json",
            params={"access_token": MAPBOX_TOKEN}
        )
        response.raise_for_status()
        data = response.json()
        if not data['features']:
            raise ValueError(f"Could not geocode address: {address}")
        return data['features'][0]['geometry']['coordinates']

    all_orders = Order.query.order_by(Order.orderDate.asc()).all()
    trip_orders = []
    total_weight = 0

    for order in all_orders:
        weight = calculate_order_weight(order)
        if len(trip_orders) < 10 and (total_weight + weight) <= 200:
            coords = get_order_coordinates(order)
            trip_orders.append((order, coords))
            total_weight += weight

    if not trip_orders:
        return jsonify({"error": "No eligible orders found"}), 404

    origin_coords = [-121.8863, 37.3382]

    if len(trip_orders) == 1:
        # Use Directions API
        order, dest_coords = trip_orders[0]
        coord_str = f"{origin_coords[0]},{origin_coords[1]};{dest_coords[0]},{dest_coords[1]}"
        mapbox_url = (
            f"https://api.mapbox.com/directions/v5/mapbox/driving/{coord_str}"
            f"?geometries=geojson&access_token={MAPBOX_TOKEN}"
        )
        response = requests.get(mapbox_url).json()

        if "routes" not in response:
            return jsonify({"error": "Mapbox failed to create route", "details": response}), 500

        route = response['routes'][0]['geometry']['coordinates']

        return jsonify({
            "route": route,
            "stops": [origin_coords, dest_coords],
            "orders": [{
                "orderID": order.orderID,
                "address": f"{order.street}, {order.city}, {order.state} {order.zip}",
                "weight": calculate_order_weight(order)
            }],
            "total_weight": calculate_order_weight(order)
        }), 200

    # Multiple orders — use Optimized Trips API
    coord_str = ";".join([f"{lng},{lat}" for _, (lng, lat) in trip_orders])
    mapbox_url = (
        f"https://api.mapbox.com/optimized-trips/v1/mapbox/driving/{coord_str}"
        f"?geometries=geojson&source=first&access_token={MAPBOX_TOKEN}"
    )
    response = requests.get(mapbox_url).json()

    if "trips" not in response:
        return jsonify({"error": "Mapbox failed to generate route", "details": response}), 500

    route = response['trips'][0]['geometry']['coordinates']
    waypoints = response['waypoints']
    ordered_coords = [None] * len(waypoints)
    for wp in waypoints:
        index = wp['waypoint_index']
        ordered_coords[index] = wp['location']

    return jsonify({
        "route": route,
        "stops": ordered_coords,
        "orders": [
            {
                "orderID": o.orderID,
                "address": f"{o.street}, {o.city}, {o.state} {o.zip}",
                "weight": calculate_order_weight(o)
            }
            for o, _ in trip_orders
        ],
        "total_weight": total_weight
    }), 200


@order_bp.route('/optimized-route-map', methods=['GET'])
def get_optimized_route_map():
    MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")
    if not MAPBOX_TOKEN:
        return jsonify({"error": "Mapbox token not set"}), 500

    def calculate_order_weight(order):
        total_weight = 0
        for item in order.order_items:
            product = Product.query.get(item.productID)
            if product:
                total_weight += item.quantity * float(product.weight)
        return total_weight

    def get_order_coordinates(order):
        address = f"{order.street}, {order.city}, {order.state} {order.zip}"
        response = requests.get(
            f"https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json",
            params={"access_token": MAPBOX_TOKEN}
        )
        response.raise_for_status()
        data = response.json()
        if not data['features']:
            raise ValueError(f"Could not geocode address: {address}")
        return data['features'][0]['geometry']['coordinates']  # [lng, lat]

    all_orders = Order.query.order_by(Order.orderDate.asc()).all()
    trip_orders = []
    total_weight = 0

    for order in all_orders:
        weight = calculate_order_weight(order)
        if len(trip_orders) < 10 and (total_weight + weight) <= 200:
            coords = get_order_coordinates(order)
            trip_orders.append((order, coords))
            total_weight += weight

    if not trip_orders:
        return jsonify({"error": "No eligible orders found"}), 404

    origin_coords = [-121.8863, 37.3382]  # SJSU

    if len(trip_orders) == 1:
        _, dest_coords = trip_orders[0]
        coord_str = f"{origin_coords[0]},{origin_coords[1]};{dest_coords[0]},{dest_coords[1]}"
        url = (
            f"https://api.mapbox.com/directions/v5/mapbox/driving/{coord_str}"
            f"?geometries=geojson&access_token={MAPBOX_TOKEN}"
        )
        response = requests.get(url).json()
        if "routes" not in response:
            return jsonify({"error": "Mapbox failed", "details": response}), 500
        route = response['routes'][0]['geometry']['coordinates']
        ordered_coords = [origin_coords, dest_coords]
    else:
        coord_str = ";".join([f"{lng},{lat}" for _, (lng, lat) in trip_orders])
        url = (
            f"https://api.mapbox.com/optimized-trips/v1/mapbox/driving/{coord_str}"
            f"?geometries=geojson&source=first&access_token={MAPBOX_TOKEN}"
        )
        response = requests.get(url).json()
        if "trips" not in response:
            return jsonify({"error": "Mapbox failed", "details": response}), 500
        route = response['trips'][0]['geometry']['coordinates']
        waypoints = response['waypoints']
        ordered_coords = [None] * len(waypoints)
        for wp in waypoints:
            index = wp['waypoint_index']
            ordered_coords[index] = wp['location']

    # 🔄 Generate Folium map
    m = folium.Map(location=[ordered_coords[0][1], ordered_coords[0][0]], zoom_start=13, tiles="CartoDB positron")
    folium.PolyLine(locations=[(lat, lng) for lng, lat in route], color='purple', weight=5).add_to(m)

    folium.Marker(location=[ordered_coords[0][1], ordered_coords[0][0]],
                  popup="Start (SJSU)",
                  icon=folium.Icon(color='green')).add_to(m)

    folium.Marker(location=[ordered_coords[-1][1], ordered_coords[-1][0]],
                  popup="Final Stop",
                  icon=folium.Icon(color='red')).add_to(m)

    for i, (lng, lat) in enumerate(ordered_coords[1:-1], 1):
        folium.Marker(
            location=[lat, lng],
            popup=f"Stop {i}",
            icon=folium.Icon(color='blue')
        ).add_to(m)

    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.html')
    m.save(tmp_file.name)
    return send_file(tmp_file.name, mimetype='text/html')

