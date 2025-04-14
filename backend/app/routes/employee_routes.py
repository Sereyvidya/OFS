from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from ..models import Employee   # Import the Employee model
from .. import db           # Import db object to interact with database

# Create a Blueprint for authentication-related routes
employee_bp = Blueprint('employee', __name__)

# Login route
@employee_bp.route('/login', methods=['POST'])
def login():
    # Get employee entered-data and look for employee in the database using their email
    data = request.get_json()
    employee = Employee.query.filter_by(email=data.get('email')).first()
    print(data.get('email'), employee.email)
    print(data.get('password'))
    print(check_password_hash(employee.password, data.get('password')))

    # Checks if the employee exists and the password matches
    if employee and check_password_hash(employee.password, data.get('password')):
        # Create a JWT token for the employee
        access_token = create_access_token(identity=str(employee.employeeID))
        return jsonify({"message": "Login successful", "token": access_token}), 200
    else:
        return jsonify({"error": "Invalid email or password."}), 401