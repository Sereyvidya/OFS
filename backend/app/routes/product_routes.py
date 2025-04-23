from flask import Blueprint, request, jsonify
import base64
from werkzeug.utils import secure_filename
import os
from .. import db
from ..models import Product  # Import the Product model

# Define a Blueprint for product-related routes
product_bp = Blueprint('product', __name__)

# Directory to store uploaded images
UPLOAD_FOLDER = "../database/Images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the folder exists

@product_bp.route('/display', methods=['GET'])
def get_products():
    products = Product.query.all()
    
    productList = [{
        "productID": product.productID,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "quantity": product.quantity,
        "category": product.category,
        "weight": product.weight,
        "image": base64.b64encode(product.image).decode('utf-8')
    } for product in products]
    
    return jsonify(productList)


@product_bp.route('/add', methods=['POST'])
def add_product():
    try:
        # Extract form data
        name = request.form.get("name")
        price = request.form.get("price")
        description = request.form.get("description")
        category = request.form.get("category")
        quantity = request.form.get("quantity")
        weight = request.form.get("weight")
        image = request.files.get("image")

        print(repr(weight))
        print(weight.replace('.', '', 1).isdigit())
        # Validation
        if not name or len(name) > 50:
            return jsonify({"error": "Product name must be provided and 50 characters or less."}), 400
        if not price or not price.replace('.', '', 1).isdigit():
            return jsonify({"error": "Product price must be a valid number."}), 400
        if not weight or not weight.replace('.', '', 1).isdigit():
            return jsonify({"error": "Product weight must be a valid number."}), 400
        if not description or len(description) > 255:
            return jsonify({"error": "Product description must be provided and 255 characters or less."}), 400
        if not category:
            return jsonify({"error": "Product category must be provided."}), 400
        if not quantity or not quantity.isdigit():
            return jsonify({"error": "Product quantity must be a valid number."}), 400

        # Read image as binary data
        image_data = None
        if image:
            image_data = image.read()  # Read the image file as binary data

        # Create a new product
        new_product = Product(
            name=name,
            price=float(price),
            weight=float(weight),
            description=description,
            category=category,
            quantity=int(quantity),
            image=image_data  # Save the binary data in the database
        )

        # Save the product to the database
        db.session.add(new_product)
        db.session.commit()

        return jsonify({"message": "Product added successfully!"}), 201

    except Exception as e:
        db.session.rollback()  # Rollback the transaction in case of an error
        print(f"Error: {e}")  # Log the error for debugging
        return jsonify({"error": str(e)}), 400

@product_bp.route('/edit/<int:product_id>', methods=['PUT'])
def edit_product(product_id):
    try:
        # Find the product
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found."}), 404

        # Extract form data
        name = request.form.get("name")
        price = request.form.get("price")
        description = request.form.get("description")
        category = request.form.get("category")
        quantity = request.form.get("quantity")
        weight = request.form.get("weight")
        image = request.files.get("image")

        # Validation (same as in /add)
        if not name or len(name) > 50:
            return jsonify({"error": "Product name must be provided and 50 characters or less."}), 400
        if not price or not price.replace('.', '', 1).isdigit():
            return jsonify({"error": "Product price must be a valid number."}), 400
        if not weight or not weight.replace('.', '', 1).isdigit():
            return jsonify({"error": "Product weight must be a valid number."}), 400
        if not description or len(description) > 255:
            return jsonify({"error": "Product description must be provided and 255 characters or less."}), 400
        if not category:
            return jsonify({"error": "Product category must be provided."}), 400
        if not quantity or not quantity.isdigit():
            return jsonify({"error": "Product quantity must be a valid number."}), 400

        # Update fields
        product.name = name
        product.price = float(price)
        product.weight = float(weight)
        product.description = description
        product.category = category
        product.quantity = int(quantity)

        # Update image only if a new one is uploaded
        if image:
            product.image = image.read()

        # Commit changes
        db.session.commit()

        return jsonify({"message": "Product updated successfully!"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 400

