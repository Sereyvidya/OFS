from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    from . import routes  # Import routes after initializing the app
    app.register_blueprint(routes.bp)

    print("Creating tables...")  # Debugging line
    with app.app_context():
        db.create_all()

    return app