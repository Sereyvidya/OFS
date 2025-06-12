from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User

# Create a Blueprint for user-related routes
user_bp = Blueprint('user', __name__)

# Get profile route
@user_bp.route('/get', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        return jsonify({
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "phone": user.phone,
            "isAdmin": user.isAdmin,
        }), 200
    else:
        return jsonify({"error": "User not found."}), 404

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
        return jsonify({"message": "Account successfully deleted."}), 200
    else:
        return jsonify({"error": "Error deleting account."}), 404