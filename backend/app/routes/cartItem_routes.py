from flask import Blueprint, request, jsonify
from ..models import User, Product, CartItem
from flask_jwt_extended import jwt_required, get_jwt_identity
import base64
from .. import db

# Create a Blueprint for cartItem-related routes
cartItem_bp = Blueprint('cartItem', __name__)

# Add cart item route
@cartItem_bp.route('/add', methods=['POST'])
@jwt_required() 
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('productID')
    quantity = data.get('quantity', 1)

    if not user_id or not product_id:
        return jsonify({'error': 'userID and productID are required'}), 400

    # Check if the item is already in the cart
    cart_item = CartItem.query.filter_by(userID=user_id, productID=product_id).first()
    
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(userID=user_id, productID=product_id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({'message': 'Item added to cart successfully'}), 200

# Get cart item route
@cartItem_bp.route('/get', methods=['GET'])
@jwt_required() 
def get_cart_items():
    user_id = get_jwt_identity()

    cart_items = CartItem.query.filter_by(userID=user_id).all()
    items = []

    for cart_item in cart_items:
        product = Product.query.get(cart_item.productID)
        items.append({
            'cartItemID': cart_item.cartItemID,
            'product': {
                "productID": product.productID,
                "name": product.name,
                "description": product.description,
                "price": product.price,
                "quantity": product.quantity,
                "category": product.category,
                "weight": product.weight,
                "image": base64.b64encode(product.image).decode('utf-8')
            },
            'quantity': cart_item.quantity
        })

    return jsonify(items), 200

# Update quantity route
@cartItem_bp.route('/update/<int:cart_item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(cart_item_id):
    data = request.get_json()
    new_quantity = data.get('quantity')

    if new_quantity is None or new_quantity < 1:
        return jsonify({'error': 'Quantity must be at least 1'}), 400

    cart_item = CartItem.query.get(cart_item_id)
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404

    cart_item.quantity = new_quantity
    db.session.commit()
    return jsonify({'message': 'Quantity updated successfully'}), 200


# Delete cart item route
@cartItem_bp.route('/remove/<int:cart_item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(cart_item_id):
    cart_item = CartItem.query.get(cart_item_id)

    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404

    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({'message': 'Item removed from cart successfully'}), 200
