from flask import Blueprint, request, jsonify
from . import db  # Import db object initialized in __init__.py
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint('main', __name__)

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data.get('password'))

    new_user = User(
        firstName=data.get('firstName'),
        lastName=data.get('lastName'),
        email=data.get('email'),
        phone=data.get('phone'),
        password=hashed_password,
        addressLine1=data.get('addressLine1'),
        addressLine2=data.get('addressLine2'),
        city=data.get('city'),
        state=data.get('state'),
        zipCode=data.get('zip'),
        country=data.get('country')
    )

    print(new_user)
    
    try:
        db.session.add(new_user)    # Add new user
        db.session.commit()         # Commits new user to db
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        db.session.rollback()       # Undo all add/commit if try fails
        return jsonify({"error": str(e)}), 400

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()

    if user and check_password_hash(user.password, data.get('password')):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401
