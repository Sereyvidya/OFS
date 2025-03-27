from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from ..models import User   # Import the User model (class)
from .. import db           # Import db object to interact with database

# Create a Blueprint for authentication-related routes
auth_bp = Blueprint('auth', __name__)

# Signup route
@auth_bp.route('/signup', methods=['POST'])
def signup():
    # Get user-entered data and hash the password
    data = request.get_json()
    hashed_password = generate_password_hash(data.get('password'))

    # Create a new user
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

    # Try to add the new user to the database
    try:
        db.session.add(new_user)    # Add the new user to the session
        db.session.commit()         # Commit the transaction to save the user
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:  
        db.session.rollback()       # Rollback the session in case of an error
        return jsonify({"error": str(e)}), 400

# Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    # Get user entered-data and look for user in the database using their email
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()

    # Checks if the user exists and the password matches
    if user and check_password_hash(user.password, data.get('password')):
        # Create a JWT token for the user
        access_token = create_access_token(identity=str(user.userID))
        return jsonify({"message": "Login successful", "token": access_token}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401
