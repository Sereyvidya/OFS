# Initialize Flask application's factory function (create_app())

import os
from config import Config
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

# Create SQLAlchemy object to interact with the database
db = SQLAlchemy()

def create_app():
    # Create and configure Flask app
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize the database, enable CORS, and set up JWT management
    db.init_app(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
    jwt = JWTManager(app)

    # Error checks for tokens
    @jwt.invalid_token_loader
    def invalid_token_callback(err):
        print("Invalid token error:", err)
        return jsonify({"error": "Invalid token"}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print("Expired token for:", jwt_payload)
        return jsonify({"error": "Token expired"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(err):
        print("Missing token:", err)
        return jsonify({"error": "Missing token"}), 401

    # Register the application's blueprints (including product blueprint)
    from .routes import (
        auth_bp,
        user_bp, 
        product_bp,
        cart_item_bp,
        order_bp
        # employee_bp, 
    )
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(product_bp, url_prefix='/product')
    app.register_blueprint(cart_item_bp, url_prefix='/cart-item')
    app.register_blueprint(order_bp, url_prefix='/order')

    # Create database tables using the models defined in the application 
    with app.app_context():
        db.create_all()

    return app
