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
        })
    else:
        return jsonify({"error": "User not found"}), 404

# To delete account
@user_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def del_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # If the user exists, delete the user
    if user:
        from .. import db 
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Account successfully deleted"}), 200
    else:
        return jsonify({"error": "User not found"}), 404