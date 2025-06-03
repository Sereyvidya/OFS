import base64
from werkzeug.utils import secure_filename
import os
from .. import db
from flask import Blueprint, jsonify
from ..models import Product  # Import the Product model

# Define a Blueprint for product-related routes
product_bp = Blueprint('product', __name__)

# Get products route
@product_bp.route('/get', methods=['GET'])
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