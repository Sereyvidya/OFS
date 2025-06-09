import mysql.connector, time
from werkzeug.security import generate_password_hash
import os
from product_data import products

for _ in range(20):
    try:
        connection = mysql.connector.connect(
          host="localhost", port=3306,
          user="root", password="password",
          database="OFS"
        )
        break
    except mysql.connector.errors.DatabaseError:
        time.sleep(2)
else:
    raise RuntimeError("Could not connect to MySQL after 20 attempts")


cursor = connection.cursor()

for product in products:
    image_path = f"images/{product['name']}.jpg"

    if not os.path.exists(image_path):
        image_path = f"images/Blank.jpg"

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
        # print(f"{product['name']}: original image size = {len(image_data)} bytes")
                        
    except Exception as e:
        print(f"Error inserting product {product['name']}: {e}")

print("Products added successfully.")

# Admin info
first_name = "Alice"
last_name = "Smith"
email = "alice.smith@ofs.com"
phone = "1234567890"
plain_password = "Password123$"

hashed_password = generate_password_hash(plain_password)

try:
    insert_query = """
        INSERT INTO user (
            firstName, lastName, email, phone, password, isAdmin
        )
        VALUES (%s, %s, %s, %s, %s, %s);
    """
    cursor.execute(insert_query, (first_name, last_name, email, phone, hashed_password, True))
    print("Admin inserted successfully.")
except Exception as e:
    print(f"Error inserting manager: {e}")

connection.commit()
cursor.close()
connection.close()
