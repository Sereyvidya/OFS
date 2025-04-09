from . import db
from flask import Blueprint, request, jsonify
import base64

product_bp = Blueprint('product_bp', __name__)

# User
class User(db.Model):
    userID = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(320), unique=True, nullable=False)
    phone = db.Column(db.String(10), nullable=False)
    password = db.Column(db.String(256), nullable=False)

    def __repr__(self):
        return f"<User {self.email}>"

# Product
class Product(db.Model):
    productID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Numeric(5, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image = db.Column(db.LargeBinary, nullable=False)  # Store binary data for the image

    def __repr__(self):
        return f"<Product {self.name}>"

# CartItem 
class CartItem(db.Model):
    cartItemID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.userID'), nullable=False)
    productID = db.Column(db.Integer, db.ForeignKey('product.productID'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    def __repr__(self):
        return f"<CartItem belonging to userID {userID} and productID {productID}>"

@product_bp.route('/add', methods=['POST'])
def add_product():
    try:
        # Extract form data
        name = request.form.get("name")
        price = request.form.get("price")
        description = request.form.get("description")
        category = request.form.get("category")
        quantity = request.form.get("quantity")
        image = request.files.get("image")

        # Validation
        if not name or len(name) > 50:
            return jsonify({"error": "Product name must be provided and 50 characters or less."}), 400
        if not price or not price.replace('.', '', 1).isdigit():
            return jsonify({"error": "Product price must be a valid number."}), 400
        if not description or len(description) > 255:
            return jsonify({"error": "Product description must be provided and 255 characters or less."}), 400
        if not category:
            return jsonify({"error": "Product category must be provided."}), 400
        if not quantity or not quantity.isdigit():
            return jsonify({"error": "Product quantity must be a valid number."}), 400

        # Read image as binary data
        image_data = None
        if image:
            image_data = image.read()

        # Create a new product
        new_product = Product(
            name=name,
            price=float(price),
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

@product_bp.route('/display', methods=['GET'])
def get_products():
    products = Product.query.all()
    
    productList = [{
        "productID": product.productID,
        "name": product.name,
        "description": product.description,
        "price": float(product.price),
        "quantity": product.quantity,
        "category": product.category,
        "image": base64.b64encode(product.image).decode('utf-8') if product.image else None
    } for product in products]
    
    return jsonify(productList)

# HTML code to display product image
html_code = """
<img
  src={`data:image/jpeg;base64,${product.image}`}
  alt={product.name}
  className="w-full aspect-1 object-cover rounded-md mt-1"
/>
"""
