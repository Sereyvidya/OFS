# Initialize Flask application's factory function (create_app())

import os
from config import Config
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

# load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'stripe.env'))

# Create SQLAlchemy object to interact with the database
db = SQLAlchemy()

def create_app():
    # Create and configure Flask app
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize the database, enable CORS, and set up JWT management
    db.init_app(app)
    CORS(app)
    JWTManager(app)

    # Register the application's blueprints (including product blueprint)
    from .routes import (
        auth_bp, 
        product_bp,
        cart_item_bp
        # employee_bp, 
        # order_bp, 
        # user_bp
    )
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(product_bp, url_prefix='/product')
    app.register_blueprint(cart_item_bp, url_prefix='/cart-item')

    # Create database tables using the models defined in the application 
    with app.app_context():
        db.create_all()

    return app
