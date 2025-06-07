from flask import Blueprint, request, jsonify
from ..models import User, Product, CartItem
from flask_jwt_extended import jwt_required, get_jwt_identity
import base64
from .. import db

# Create a Blueprint for cartItem-related routes
cart_item_bp = Blueprint('cart_item', __name__)

# Get cart items route
@cart_item_bp.route('/get', methods=['GET'])
@jwt_required() 
def get_all_items_from_cart():
    user_id = get_jwt_identity()

    cart_items = CartItem.query.filter_by(userID=user_id).all()
    items = []

    for cart_item in cart_items:
        product = Product.query.get(cart_item.productID)

        # If product was user's cart but deleted before they checkout
        if product is None:
            continue

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
                "image": f"data:image/jpeg;base64,{base64.b64encode(product.image).decode('utf-8')}"
            },
            'quantity': cart_item.quantity
        })
    return jsonify(items), 200

# Add item to cart route
@cart_item_bp.route('/post', methods=['POST'])
@jwt_required() 
def post_item_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('productID')
    quantity = data.get('quantity', 1)

    if not user_id or not product_id:
        return jsonify({'error': 'userID and productID are required.'}), 400

    # Check if the item is already in the cart
    cart_item = CartItem.query.filter_by(userID=user_id, productID=product_id).first()
    
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(userID=user_id, productID=product_id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({'message': 'Item added to cart successfully.'}), 200

# Update quantity route
@cart_item_bp.route('/put/<int:cart_item_id>', methods=['PUT'])
@jwt_required()
def put_item_in_cart(cart_item_id):
    data = request.get_json()
    new_quantity = data.get('quantity')

    # Check lower bound of new quantity
    if new_quantity is None or new_quantity < 1:
        return jsonify({'error': 'Minimum quantity per item is 1.'}), 400

    # Check upper bound of new quantity
    MAX_PER_ITEM = 10
    if new_quantity > MAX_PER_ITEM:
        return jsonify({'error': f'Maximum of {MAX_PER_ITEM} per item allowed in the cart.'}), 400

    # Check if cart item exists
    cart_item = CartItem.query.get(cart_item_id)
    if not cart_item:
        return jsonify({'error': 'Cart item not found.'}), 404

    # Check if product exists
    product = Product.query.get(cart_item.productID)
    if not product:
        return jsonify({'error': 'Product not found.'}), 404

    # Check product's stock
    if new_quantity > product.quantity:
        return jsonify({'error': f'Sorry, only {product.quantity} left in stock.'}), 400

    cart_item.quantity = new_quantity
    db.session.commit()
    return jsonify({'message': 'Quantity updated successfully!'}), 200


# Remove cart item route
@cart_item_bp.route('/delete/<int:cart_item_id>', methods=['DELETE'])
@jwt_required()
def delete_item_from_cart(cart_item_id):
    cart_item = CartItem.query.get(cart_item_id)

    # Check if cart item exists
    if not cart_item:
        return jsonify({'error': 'Cart item not found.'}), 404

    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({'message': 'Item removed from cart successfully.'}), 200
