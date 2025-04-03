from . import db

# User model
class User(db.Model):
    userID = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(320), unique=True, nullable=False)
    phone = db.Column(db.String(10), nullable=False)
    password = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f"<User {self.email}>"
    
# Product
class Product(db.Model):
    productID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Numeric(5, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image = db.Column(db.LargeBinary, nullable=False)

    def __repr__(self):
        return f"<User {self.productName}>"
