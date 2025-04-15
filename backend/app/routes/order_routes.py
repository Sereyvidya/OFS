from flask import Blueprint, request, jsonify
from ..models import User, Product, CartItem, Order, OrderItem
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
import stripe

# This is where you add your stripe secret key
stripe.api_key = ''

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
            amount = total_in_cents,
            currency = 'usd',
            payment_method = payment_method_id,
            confirm = True,
        )

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
                order_item = OrderItem(
                    orderID=order.orderID,
                    productID=item['productID'],
                    quantity=item['quantity'],
                    priceAtPurchase=item['priceAtPurchase']
                )
                db.session.add(order_item)

            db.session.commit()
            return jsonify({'message': 'Order placed and payment successful'}), 201

        else:
            return jsonify({'error': 'Payment not successful'}), 402

    except stripe.error.CardError as e:
        return jsonify({'error': e.user_message}), 402

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
