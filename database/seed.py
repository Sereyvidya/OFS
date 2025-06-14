import mysql.connector, time
from werkzeug.security import generate_password_hash
import os
from data import products, addresses
import random
from datetime import datetime

# Connect to database
for _ in range(20):
    try:
        connection = mysql.connector.connect(
            host="database",
            # host="localhost", 
            port=3306,
            user="root", 
            password="password",
            database="OFS"
        )
        break
    except mysql.connector.errors.DatabaseError:
        time.sleep(2)
else:
    raise RuntimeError("Could not connect to MySQL after 20 attempts")
cursor = connection.cursor()

# Insert products
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_DIR = os.path.join(BASE_DIR, "images")

for product in products:
    image_path = os.path.join(IMAGE_DIR, f"{product['name']}.jpg")

    if not os.path.exists(image_path):
        image_path = os.path.join(IMAGE_DIR, "Blank.jpg")

    # Read the image file as binary so SQL can store it
    try: 
        with open(image_path, 'rb') as file:
            image_data = file.read()
        
        # Insert the binary data into the table
        insert_query = """
            INSERT INTO product (
                name, 
                description, 
                price, 
                quantity, 
                category, 
                weight,
                image
            ) 
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """
        cursor.execute(insert_query, (
                        product['name'], product['description'],
                        product['price'], product['quantity'], 
                        product['category'], product['weight'],
                        image_data
                        ))
                        
    except Exception as e:
        print(f"Error inserting product {product['name']}: {e}")
print("Products added successfully.")

# Insert an admin
try:
    first_name = "Alice"
    last_name = "Smith"
    email = "alice.smith@ofs.com"
    phone = "1234567890"
    plain_password = "Password123$"

    hashed_password = generate_password_hash(plain_password)

    insert_query = """
        INSERT INTO user (
            firstName, lastName, email, phone, password, isAdmin
        )
        VALUES (%s, %s, %s, %s, %s, %s);
    """
    cursor.execute(insert_query, (first_name, last_name, email, phone, hashed_password, True))
    user_id = cursor.lastrowid
    connection.commit()
    print("Admin inserted successfully.")

except Exception as e:
    print(f"Error inserting manager: {e}")

# Insert 15 random orders
# for i in range(15):
#     street, city, state, zip_code = addresses[i]
#     total = round(random.uniform(20.00, 150.00), 2)
#     weight = round(random.uniform(2.0, 25.0), 3)
#     # Random lat/lng in san jose
#     lat = round(random.uniform(37.29, 37.39), 6)
#     lng = round(random.uniform(-121.92, -121.82), 6)

#     insert_order = """
#         INSERT INTO `order` (
#             userID, orderDate, street, city, state, zip,
#             total, weight, status, lat, lng
#         )
#         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
#     """

#     cursor.execute(insert_order, (
#         user_id, datetime.now(), street, city, state, zip_code,
#         total, weight, "awaiting", lat, lng
#     ))
# print("15 random San Jose orders inserted for Admin use.")



# Commit and close connection
connection.commit()
cursor.close()
connection.close()
