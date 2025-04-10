from flask import Blueprint, request, jsonify
import base64
from .. import db
from ..models import Product  # Import the Product model

# Define a Blueprint for product-related routes
product_bp = Blueprint('product', __name__)

# @product_bp.route('/products', methods=['POST'])
# def add_product():
#     data = request.get_json()
#     name = data.get('name')
#     price = data.get('price')
#     description = data.get('description')
#     category = data.get('category')

#     if not name or not price or not category:
#         return jsonify({"error": "Missing required fields"}), 400

#     # Create a new product object and add it to the database
#     new_product = Product(
#         name=name,
#         price=price,
#         description=description,
#         category=category
#     )

#     db.session.add(new_product)
#     db.session.commit()

#     return jsonify({"message": "Product added successfully!"}), 201

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
