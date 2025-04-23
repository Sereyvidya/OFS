import base64

from flask import Blueprint, jsonify, request

from . import db

product_bp = Blueprint('product_bp', __name__)

# User
class User(db.Model):
    __tablename__ = 'user'
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
    __tablename__ = 'product'
    productID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Numeric(5, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    weight = db.Column(db.Numeric(5, 3), nullable=False)
    image = db.Column(db.LargeBinary(length=4294967295), nullable=False)

    def __repr__(self):
        return f"<Product {self.name}>"

# CartItem 
class CartItem(db.Model):
    __tablename__ = 'cart_item'
    cartItemID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.userID'), nullable=False)
    productID = db.Column(db.Integer, db.ForeignKey('product.productID'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    def __repr__(self):
        return f"<CartItem belonging to userID {userID} and productID {productID}>"

# Order
class Order(db.Model):
    __tablename__ = 'order'
    orderID = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.userID', ondelete="CASCADE"), nullable=False)
    orderDate = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    street = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip = db.Column(db.String(10), nullable=False)
    total = db.Column(db.Numeric(7, 2), nullable=False)

    order_items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")


# OrderItem
class OrderItem(db.Model):
    __tablename__ = 'order_item'
    orderItemID = db.Column(db.Integer, primary_key=True)
    orderID = db.Column(db.Integer, db.ForeignKey('order.orderID'), nullable=False)
    productID = db.Column(db.Integer, db.ForeignKey('product.productID'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    priceAtPurchase = db.Column(db.Numeric(5, 2), nullable=False)

# Employee
class Employee(db.Model):
    __tablename__ = 'employee'
    employeeID = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(320), unique=True, nullable=False)
    phone = db.Column(db.String(10), nullable=False)
    password = db.Column(db.String(256), nullable=False)

    def __repr__(self):
        return f"<Employee {self.email}>"
