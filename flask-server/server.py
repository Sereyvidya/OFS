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


if __name__ == "__main__":
    app.run(debug=True)

