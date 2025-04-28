import os
import tempfile
import threading
import time

import folium
import requests
import stripe
from dotenv import load_dotenv
from flask import Blueprint, current_app, jsonify, request, send_file
from flask_jwt_extended import get_jwt_identity, jwt_required

from .. import db
from ..models import CartItem, Order, OrderItem, Product, User

dotenv_path = os.path.join(os.path.dirname(__file__), "stripe.env")
load_dotenv(dotenv_path=dotenv_path)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
if not stripe.api_key:
    raise ValueError("Stripe secret key not found.")

order_bp = Blueprint('order', __name__)

# ------------------------- PLACE ORDER ------------------------- #
@order_bp.route('/add', methods=['POST'])
@jwt_required()
def place_order():
    data = request.get_json()
    user_id = get_jwt_identity()
    street, city, state, zip_code, total = data.get('street'), data.get('city'), data.get('state'), data.get('zip'), data.get('total')
    cart_items = data.get('cartItems', [])
    payment_method_id = data.get('paymentMethodId')

    if not all([street, city, state, zip_code, total, cart_items, payment_method_id]):
        return jsonify({'error': 'Missing order or payment details'}), 400

    try:
        total_in_cents = int(float(total) * 100)
        intent = stripe.PaymentIntent.create(
            amount=total_in_cents,
            currency='usd',
            payment_method=payment_method_id,
            confirm=True,
            automatic_payment_methods={'enabled': True, 'allow_redirects': 'never'}
        )

        if intent['status'] == 'succeeded':
            order = Order(userID=user_id, street=street, city=city, state=state, zip=zip_code, total=total)
            db.session.add(order)
            db.session.flush()

            for item in cart_items:
                product = Product.query.get(item['productID'])
                if not product or product.quantity < item['quantity']:
                    db.session.rollback()
                    return jsonify({'error': f'Insufficient stock for product {item["productID"]}'}), 400

                product.quantity -= item['quantity']
                db.session.add(OrderItem(
                    orderID=order.orderID,
                    productID=item['productID'],
                    quantity=item['quantity'],
                    priceAtPurchase=item['priceAtPurchase']
                ))
                CartItem.query.filter_by(userID=user_id, productID=item['productID']).delete()

            db.session.commit()
            return jsonify({'message': 'Order placed and payment successful'}), 201

        return jsonify({'error': 'Payment not successful'}), 402

    except stripe.error.CardError as e:
        return jsonify({'error': e.user_message}), 402
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ------------------------- GET ORDER HISTORY ------------------------- #

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

# ------------------------- DEPLOY ROUTE ------------------------- #
@order_bp.route('/deploy', methods=['POST'])
def deploy_orders():
    MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")
    if not MAPBOX_TOKEN:
        return jsonify({"error": "Mapbox token not set"}), 500

    def get_weight(o):
        return sum(item.quantity * float(Product.query.get(item.productID).weight) for item in o.order_items)

    def get_coords(o):
        address = f"{o.street}, {o.city}, {o.state} {o.zip}"
        r = requests.get(
            f"https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json",
            params={"access_token": MAPBOX_TOKEN}
        )
        r.raise_for_status()
        features = r.json()['features']
        return features[0]['geometry']['coordinates'] if features else None

    orders = Order.query.filter_by(status='awaiting').order_by(Order.orderDate.asc()).all()
    trip_orders, total = [], 0

    for o in orders:
        w = get_weight(o)
        if len(trip_orders) < 10 and total + w <= 200:
            coords = get_coords(o)
            if coords:
                trip_orders.append((o, coords))
                total += w

    if not trip_orders:
        return jsonify({"error": "No eligible orders"}), 404

    # Robot starts at sjsu
    origin_coords = [-121.8863, 37.3382]
    coord_list = [f"{origin[0]},{origin[1]}"] + [f"{lng},{lat}" for _, (lng, lat) in trip_orders]
    coord_str = ";".join(coord_list)

    url = f"https://api.mapbox.com/optimized-trips/v1/mapbox/driving/{coord_str}?geometries=geojson&source=first&access_token={MAPBOX_TOKEN}"
    res = requests.get(url).json()
    if "trips" not in res:
        return jsonify({"error": "Mapbox failed", "details": res}), 500

    # Scale 1 minute travel to 1 second real time
    legs = res['trips'][0]['legs']  # Legs between stops
    cumulative_times = []
    current_time = 0
    for leg in legs:
        current_time += leg['duration']  # seconds in real life
        cumulative_times.append(current_time / 60)  # scale: 1 min = 1 sec

    # Update orders to "en route"
    for o, _ in trip_orders:
        o.status = 'en route'
    db.session.commit()

    # Thread to mark each delivered after scaled cumulative delay
    order_ids = [o.orderID for o, _ in trip_orders]
    app = current_app._get_current_object()

    def deliver_stops(app):
        with app.app_context():
            for idx, oid in enumerate(order_ids):
                time.sleep(cumulative_times[idx])
                order = Order.query.get(oid)
                if order:
                    order.status = 'delivered'
                    db.session.commit()

    threading.Thread(target=deliver_stops, args=(app,)).start()

    return jsonify({"message": "Deployment triggered"}), 200


# ------------------------- GET ALL STATUSES ------------------------- #
@order_bp.route('/all-statuses', methods=['GET'])
def get_all_orders():
    def get_weight(o):
        return sum(item.quantity * float(Product.query.get(item.productID).weight) for item in o.order_items)
    return jsonify({
        "orders": [{
            "orderID": o.orderID,
            "address": f"{o.street}, {o.city}, {o.state} {o.zip}",
            "weight": get_weight(o),
            "status": o.status
        } for o in Order.query.order_by(Order.orderDate.asc()).all()]
    }), 200

# ------------------------- MAP RENDER ------------------------- #
@order_bp.route('/optimized-route-map', methods=['GET'])
def get_map():
    MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")
    if not MAPBOX_TOKEN:
        return jsonify({"error": "Mapbox token not set"}), 500

    def get_weight(o):
        return sum(item.quantity * float(Product.query.get(item.productID).weight) for item in o.order_items)

    def get_coords(o):
        addr = f"{o.street}, {o.city}, {o.state} {o.zip}"
        r = requests.get(
            f"https://api.mapbox.com/geocoding/v5/mapbox.places/{addr}.json",
            params={"access_token": MAPBOX_TOKEN}
        )
        r.raise_for_status()
        f = r.json()['features']
        return f[0]['geometry']['coordinates'] if f else None

    all_orders = Order.query.filter_by(status='awaiting').order_by(Order.orderDate.asc()).all()
    trip_orders, total = [], 0
    for o in all_orders:
        w = get_weight(o)
        if len(trip_orders) < 10 and total + w <= 200:
            coords = get_coords(o)
            if coords:
                trip_orders.append((o, coords))
                total += w

    if not trip_orders:
        return jsonify({"error": "No eligible orders"}), 404

    origin = [-121.8863, 37.3382]  # SJSU
    coord_str = ";".join([f"{lng},{lat}" for _, (lng, lat) in trip_orders])
    url = f"https://api.mapbox.com/optimized-trips/v1/mapbox/driving/{coord_str}?geometries=geojson&source=first&access_token={MAPBOX_TOKEN}"
    data = requests.get(url).json()

    if "trips" not in data:
        return jsonify({"error": "Mapbox failed", "details": data}), 500

    route = data['trips'][0]['geometry']['coordinates']
    stops = [wp['location'] for wp in data['waypoints']]

    m = folium.Map(location=[origin[1], origin[0]], zoom_start=13)
    folium.PolyLine(locations=[(lat, lng) for lng, lat in route], color='purple', weight=5).add_to(m)
    folium.Marker(location=[origin[1], origin[0]], popup="Start", icon=folium.Icon(color='green')).add_to(m)
    folium.Marker(location=[stops[-1][1], stops[-1][0]], popup="End", icon=folium.Icon(color='red')).add_to(m)

    for i, (lng, lat) in enumerate(stops[1:-1], 1):
        folium.Marker(location=[lat, lng], popup=f"Stop {i}", icon=folium.Icon(color='blue')).add_to(m)

    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".html")
    m.save(tmp_file.name)
    return send_file(tmp_file.name, mimetype='text/html')
