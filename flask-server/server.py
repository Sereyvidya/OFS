from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # testing
    print(username)
    print(password)

    return jsonify({
        "username": username,
        "password": password
    })

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data.get('fullName')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    # Debugging print statements
    print(f"Register Request - Name: {full_name}, Email: {email}, Username: {username}, Password: {password}")

    # Basic validation to check if all required fields are present
    if not full_name or not email or not username or not password:
        return jsonify({"error": "Missing required fields"}), 400

    return jsonify({
        "message": "Registration successful!",
        "fullName": full_name,
        "email": email,
        "username": username
    }), 200


if __name__ == "__main__":
    app.run(debug=True)

