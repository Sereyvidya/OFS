from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

users = {}

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')

    # Debugging print statements
    print(f"Register Request - Name: {first_name + " " + last_name}, Email: {email}, Password: {password}")

    # Basic validation to check if all required fields are present
    if not first_name or not last_name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    users[email] = password
    print("Current registered users:", users)

    return jsonify({
        "message": "Registration successful!",
        "fullName": first_name + " " + last_name,
        "email": email,
        "password": password
    }), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # testing
    print(email)
    print(password)

    # Authentication
    if email in users and users[email] == password:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


if __name__ == "__main__":
    app.run(debug=True)

