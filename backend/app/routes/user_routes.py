from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User

# Create a Blueprint for user-related routes
user_bp = Blueprint('user', __name__)

# Profile route
@user_bp.route('/profile', methods=['GET'])
@jwt_required()     # User needs to be logged in (have JWT token to be here)
def profile():
    # Get the user's information by their JWT token
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # If the user exists, return their information
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
