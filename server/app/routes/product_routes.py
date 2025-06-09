import base64
from werkzeug.utils import secure_filename
import os
from .. import db
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Product  # Import the Product model

# Define a Blueprint for product-related routes
product_bp = Blueprint('product', __name__)

# Get all products
@product_bp.route('/get', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    
    productList = [{
        "productID": product.productID,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "quantity": product.quantity,
        "category": product.category,
        "weight": product.weight,
        "image": f"data:image/jpeg;base64,{base64.b64encode(product.image).decode('utf-8')}"
    } for product in products]
    
    return jsonify(productList), 200

# Add a product
@product_bp.route('/post', methods=['POST'])
@jwt_required()
def post_product():
    # Only admin can add product
    admin_id = get_jwt_identity()
    try:
        data = request.get_json()

        name = data.get("name")
        price = float(data.get("price"))
        description = data.get("description")
        category = data.get("category")
        quantity = float(data.get("quantity"))
        weight = float(data.get("weight"))
        image = data.get("image")

        # Validation 
        if not name or len(name) > 50:
            return jsonify({"error": "Name must be provided and 50 characters or less."}), 400
        if not price or price < 0.10 or price > 999.99:
            return jsonify({"error": "Price must be between $0.10 and $999.99."}), 400
        if not weight or weight <  0.125 or weight > 99.875:
            return jsonify({"error": "Weight must be between 0.125 lbs and 99.875 lbs."}), 400
        if not description or len(description) > 255:
            return jsonify({"error": "Description must be provided and 255 characters or less."}), 400
        if not category:
            return jsonify({"error": "Category must be provided."}), 400
        if not quantity or quantity < 0 or quantity > 999:
            return jsonify({"error": "Quantity must be between 0 and 999 lbs."}), 400

        if image:
            if image.startswith("data:image/"):
                header, base64_data = image.split(",", 1)
                image_data = base64.b64decode(base64_data)

        # Create a new product
        new_product = Product(
            name=name,
            price=float(price),
            weight=float(weight),
            description=description,
            category=category,
            quantity=int(quantity),
            image=image_data
        )

        # Save the product to the database
        db.session.add(new_product)
        db.session.commit()

        return jsonify({"message": "Product added successfully!"}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 400

# Update product
@product_bp.route('/put/<int:product_id>', methods=['PUT'])
@jwt_required() 
def put_product(product_id):
    # Only admin can update product
    admin_id = get_jwt_identity()
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found."}), 404

        data = request.get_json()

        name = data.get("name")
        price = float(data.get("price"))
        description = data.get("description")
        category = data.get("category")
        quantity = float(data.get("quantity"))
        weight = float(data.get("weight"))
        image = data.get("image")

        # Validation 
        if not name or len(name) > 50:
            return jsonify({"error": "Name must be provided and 50 characters or less."}), 400
        if not price or price < 0.10 or price > 999.99:
            return jsonify({"error": "Price must be between $0.10 and $999.99."}), 400
        if not weight or weight <  0.125 or weight > 99.875:
            return jsonify({"error": "Weight must be between 0.125 lbs and 99.875 lbs."}), 400
        if not description or len(description) > 255:
            return jsonify({"error": "Description must be provided and 255 characters or less."}), 400
        if not category:
            return jsonify({"error": "Category must be provided."}), 400
        if not quantity or quantity < 0 or quantity > 999:
            return jsonify({"error": "Quantity must be between 0 and 999 lbs."}), 400

        # Update fields
        product.name = name
        product.price = float(price)
        product.weight = float(weight)
        product.description = description
        product.category = category
        product.quantity = int(quantity)

        # Update image only if a new one is uploaded
        if image:
            if image.startswith("data:image/"):
                header, base64_data = image.split(",", 1)
                product.image = base64.b64decode(base64_data)

        db.session.commit()

        return jsonify({"message": "Product updated successfully!"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 400

# Remove product
@product_bp.route('/delete/<int:product_id>', methods=['DELETE'])
@jwt_required() 
def delete_product(product_id):
    # Only admin can delete product
    admin_id = get_jwt_identity()

    product = Product.query.get(product_id)

    # Check if cart item exists
    if not product:
        return jsonify({'error': 'Product not found.'}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully.'}), 200
