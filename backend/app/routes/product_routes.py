from flask import Blueprint, request, jsonify
from .. import db
from ..models import Product  # Import the Product model

# Define a Blueprint for product-related routes
product_bp = Blueprint('product_bp', __name__)

@product_bp.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    description = data.get('description')
    category = data.get('category')

    if not name or not price or not category:
        return jsonify({"error": "Missing required fields"}), 400

    # Create a new product object and add it to the database
    new_product = Product(
        name=name,
        price=price,
        description=description,
        category=category
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Product added successfully!"}), 201
