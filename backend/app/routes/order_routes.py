from flask import Blueprint, request, jsonify
from ..models import User, Product, CartItem, Order, OrderItem
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from dotenv import load_dotenv
import os
import stripe

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

