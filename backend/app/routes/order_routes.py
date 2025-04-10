from flask import Blueprint, request, jsonify
from ..models import User, Product, CartItem, Order, OrderItem
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db

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
    print(cart_items)

    if not all([street, city, state, zip_code, total, cart_items]):
        return jsonify({'error': 'Missing order details'}), 400

    try:
        user_id = get_jwt_identity()

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
        return jsonify({'message': 'Order placed successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500