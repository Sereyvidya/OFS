import os
import stripe
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from .. import db
from ..models import CartItem, Order, OrderItem, Product, User

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
if not stripe.api_key:
    raise ValueError("Stripe secret key not found.")

# Create a Blueprint for order-related routes
order_bp = Blueprint('order', __name__)

# Add an order
@order_bp.route('/post', methods=['POST'])
@jwt_required()
def post_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    street, city, state, zip_code = data.get('street'), data.get('city'), data.get('state'), data.get('zip')
    total, weight = data.get('total'), data.get('weight')
    lat, lng = data.get('lat'), data.get('lng')
    order_items = data.get('orderItems', [])
    payment_method_id = data.get('paymentMethodId')

    if not all([street, city, state, zip_code, total, order_items, payment_method_id]):
        return jsonify({'error': 'Missing order or payment details.'}), 400

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
            order = Order(userID=user_id, street=street, city=city, state=state, zip=zip_code, total=total, weight=weight, lat=lat, lng=lng)
            db.session.add(order)
            db.session.flush()

            for item in order_items:
                product = Product.query.get(item['productID'])
                if not product or product.quantity < item['quantity']:
                    db.session.rollback()
                    return jsonify({'error': f'Sorry, {item["productID"]} is unavailable or has insufficient stock.'}), 400

                product.quantity -= item['quantity']
                db.session.add(OrderItem(
                    orderID=order.orderID,
                    productID=item['productID'],
                    quantity=item['quantity'],
                    priceAtPurchase=item['priceAtPurchase']
                ))
                CartItem.query.filter_by(userID=user_id, productID=item['productID']).delete()

            db.session.commit()
            return jsonify({'message': 'Order placed successfully.'}), 201

        return jsonify({'error': 'Payment could not be completed. Please check your card details or try a different method.'}), 402

    except stripe.error.StripeError as e:
        print(f"[Stripe Error] {str(e)}")
        return jsonify({'error': 'A payment processing error occurred. Please try again.'}), 402
    except Exception as e:
        print(f"[Order Error] {str(e)}")
        return jsonify({'error': 'Something went wrong while placing your order. Please try again.'}), 500

# Get user's orders
@order_bp.route('/get/user', methods=['GET'])
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(userID=user_id).all()
    orderList = []

    for order in orders:
        orderList.append({
            "orderDate": order.orderDate,
            "street": order.street,
            "zip": order.zip,
            "total": order.total,
            "status": order.status
        })
    
    return jsonify(orderList), 200

# Get all awaiting orders
@order_bp.route('/get/awaiting', methods=['GET'])
@jwt_required()
def get_all_awaiting_orders():
    admin_id = get_jwt_identity()

    orders = Order.query.filter(Order.status.in_(['awaiting'])).all()
    result = []
    
    for order in orders:
        result.append({
            'orderID': order.orderID,
            'street': order.street,
            'city': order.city,
            'state': order.state,
            'zip': order.zip,
            'total': order.total,
            'weight': order.weight,
            'status': order.status,
            'lat': order.lat,
            'lng': order.lng
        })

    return jsonify(result), 200

# Update an order's status
@order_bp.route('/put/delivered/<int:order_id>', methods=['PUT'])
@jwt_required()
def put_delivered_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found.'}), 404
    order.status = 'delivered'
    db.session.commit()
    return jsonify({'message': 'Order marked as delivered.'}), 200
