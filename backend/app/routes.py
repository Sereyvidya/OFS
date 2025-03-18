from flask import Blueprint, request, jsonify
from . import db  # Import db object initialized in __init__.py
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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
        zipCode=data.get('zipCode'),
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
    # Get user from database
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()

    # Compare passwords
    if user and check_password_hash(user.password, data.get('password')):
        access_token = create_access_token(identity=str(user.userID))
        return jsonify({"message": "Login successful", "token": access_token}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@bp.route('/profile', methods=['GET'])
@jwt_required()  # Protect the route with JWT authentication
def profile():
    user_id = get_jwt_identity()  # Get user ID from JWT token
    user = User.query.get(user_id)  # Query user data from DB
    
    if user:
        return jsonify({
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "phone": user.phone,
            "addressLine1": user.addressLine1,
            "addressLine2": user.addressLine2,
            "city": user.city,
            "state": user.state,
            "zipCode": user.zipCode,
            "country": user.country
        })
    else:
        return jsonify({"error": "User not found"}), 404