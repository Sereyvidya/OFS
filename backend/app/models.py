from . import db

# User model
class User(db.Model):
    userID = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password = db.Column(db.String(255), nullable=False)
    addressLine1 = db.Column(db.String(100))
    addressLine2 = db.Column(db.String(100))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    zipCode = db.Column(db.String(20))
    country = db.Column(db.String(100))

    def __repr__(self):
        return f"<User {self.email}>"
    
class Product(db.Model):
    __tablename__ = 'products'

    productID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    productName = db.Column(db.String(100), nullable=False)
    productDesc = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    organic = db.Column(db.Boolean, nullable=False)
    image = db.Column(db.LargeBinary, nullable=True)

    def __repr__(self):
        return f"<User {self.productName}>"
