from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from ..models import User   # Import the User model (class)
from .. import db           # Import db object to interact with database
import re
from flask_jwt_extended import (
    jwt_required,
    create_access_token, create_refresh_token,
    set_access_cookies, set_refresh_cookies,
    verify_jwt_in_request, get_jwt_identity,
    unset_jwt_cookies
)


# Create a Blueprint for authentication-related routes
auth_bp = Blueprint('auth', __name__)

# Signup route
@auth_bp.route('/post/signup', methods=['POST'])
def signup():
    # Get user-entered data and hash the password
    data = request.get_json()

    # Check that all fields are filled up
    required_fields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword']
    for field in required_fields:
        if not data.get(field):
            if field == 'firstName':
                return jsonify({"error": "Please enter your first name."}), 400
            elif field == 'lastName':
                return jsonify({"error": "Please enter your last name."}), 400
            elif field == 'email':
                return jsonify({"error": "Please enter your email."}), 400
            elif field == 'phone':
                return jsonify({"error": "Please enter your phone number."}), 400
            elif field == 'password':
                return jsonify({"error": "Please enter your password."}), 400
            else:
                return jsonify({"error": "Please confirm your password."}), 400

    NAME_PATTERN = r"^[A-Za-z]+$"
    # First name format validation
    if not re.match(NAME_PATTERN, data.get("firstName")):
        return jsonify({"error": "First name must contain only letters."}), 400

    # Check first name length
    MAX_NAME_LENGTH = 50
    if len(data.get("firstName")) > MAX_NAME_LENGTH:
        return jsonify({"error": "First name must be 50 characters or less."}), 400

    # Last name format validation
    if not re.match(NAME_PATTERN, data.get("lastName")):
        return jsonify({"error": "Last name must contain only letters."}), 400

    # Check last name length
    if len(data.get("lastName")) > MAX_NAME_LENGTH:
        return jsonify({"error": "Last name must be 50 characters or less."}), 400

    # Email format validation
    EMAIL_PATTERN = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    if not re.match(EMAIL_PATTERN, data.get("email")):
        return jsonify({"error": "Invalid email format."}), 400

    # Check email length
    MAX_EMAIL_LENGTH = 320
    if len(data.get("email")) > MAX_EMAIL_LENGTH:
        return jsonify({"error": "Email must be 320 characters or less."}), 400

    # Case-insensitive check if email already exists
    if User.query.filter(db.func.lower(User.email) == data.get("email").lower()).first():
        return jsonify({"error": "Email already registered."}), 400

    # Phone format validation
    PHONE_PATTERN = r"^\d{10}$"
    if not re.match(PHONE_PATTERN, data.get("phone")):
        return jsonify({"error": "Phone number must be 10 digits only."}), 400

    # Password format validation
    PASSWORD_PATTERN = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    if not re.match(PASSWORD_PATTERN, data.get("password")):
        return jsonify({"error": "Password does not meet requirement."}), 400

    # Check password length
    MAX_PASSWORD_LENGTH = 128
    if len(data.get("password")) > MAX_PASSWORD_LENGTH:
        return jsonify({"error": "Password must be 128 characters or less."}), 400

    # Check password and confirm password
    if data.get("password") != data.get("confirmPassword"):
        return jsonify({"error": "Passwords do not match."}), 400

    # Hash the password before storing
    hashed_password = generate_password_hash(data.get('password'))

    # Create a new user
    new_user = User(
        firstName=data.get('firstName'),
        lastName=data.get('lastName'),
        email=data.get('email'),
        phone=data.get('phone'),
        password=hashed_password
    )

    # Try to add the new user to the database
    try:
        db.session.add(new_user)    # Add the new user to the session
        db.session.commit()         # Commit the session to save the user
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:  
        db.session.rollback()       # Rollback the session in case of an error
        return jsonify({"error": "An error occurred while registering. Please try again."}), 500

# Login route
@auth_bp.route('/post/login', methods=['POST'])
def login():
    # Get user entered-data and look for user in the database using their email
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()

    # Checks if the user exists and the password matches
    if user and check_password_hash(user.password, data.get('password')):
        # Create a JWT token for the user
        access_token = create_access_token(identity=str(user.userID))
        refresh_token = create_refresh_token(identity=str(user.userID))

        # return jsonify({"message": "Login successful", "token": access_token}), 200
        
        response = jsonify({
            "message": "Login successful.",
            "isAdmin": user.isAdmin
        })
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response
    else:
        return jsonify({"error": "Invalid email or password."}), 401

# Logout route
@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"message": "Logged out successfully."})
    unset_jwt_cookies(response)
    return response, 200

# Refresh JWT token route
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        user_id = get_jwt_identity()
        access_token = create_access_token(identity=user_id)
        response = jsonify({"message": "Token refreshed.", "isAdmin": user.isAdmin})
        set_access_cookies(response, access_token)
        return response
    except Exception as e:
        return jsonify({"error": "Invalid or expired refresh token."}), 401
