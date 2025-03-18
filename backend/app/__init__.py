from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config

db = SQLAlchemy()

def create_app():
    # Create app
    app = Flask(__name__)

    # Configure app
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app)
    JWTManager(app)

    from . import routes  # Import routes after initializing the app
    app.register_blueprint(routes.bp)

    print("Creating tables...")  # Debugging line
    with app.app_context():
        db.create_all()

    return app