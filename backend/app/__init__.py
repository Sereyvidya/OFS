from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config

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
    from .routes import auth_bp, user_bp, product_bp, cartItem_bp, order_bp, employee_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(product_bp, url_prefix='/product')
    app.register_blueprint(cartItem_bp, url_prefix='/cartItem')
    app.register_blueprint(order_bp, url_prefix='/order')
    app.register_blueprint(employee_bp, url_prefix='/employee')

    # Create database tables using the models defined in the application 
    with app.app_context():
        db.create_all()

    return app
