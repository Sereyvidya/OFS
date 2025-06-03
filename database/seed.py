import mysql.connector, time
from werkzeug.security import generate_password_hash

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

# Seed database with products
products = [
    {"name": "Apple", "description": "3 lb bag", "price": 5.99, "quantity": 50, "category": "Fruits", "weight": 3.0},
    {"name": "Bacon", "description": "12 oz pack", "price": 5.49, "quantity": 30, "category": "Meat", "weight": 0.75},
]
cursor = connection.cursor()

for i in range(0, len(products)):

    # Read the image file as binary so SQL can store it
    try: 
        with open("images/" + products[i]['name'] + ".jpg", 'rb') as file:
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
                        products[i]['name'], products[i]['description'],
                        products[i]['price'], products[i]['quantity'], 
                        products[i]['category'], products[i]['weight'], image_data))
                        
    except Exception as e:
        print(f"Error inserting product {products[i]['name']}: {e}")

print("Products added successfully.")

# Manager info
# first_name = "Alice"
# last_name = "Smith"
# email = "alice.smith@ofs.com"
# phone = "1234567890"
# plain_password = "Password123$"

# hashed_password = generate_password_hash(plain_password)

# try:
#     insert_query = """
#         INSERT INTO employee (
#             firstName, lastName, email, phone, password
#         )
#         VALUES (%s, %s, %s, %s, %s);
#     """
#     cursor.execute(insert_query, (first_name, last_name, email, phone, hashed_password))
#     print("Manager inserted successfully.")
# except Exception as e:
#     print(f"Error inserting manager: {e}")

connection.commit()
cursor.close()
connection.close()
