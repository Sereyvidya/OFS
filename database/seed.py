import mysql.connector, time
from werkzeug.security import generate_password_hash
import os

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
    # Fruits
    {"name": "Bananas", "description": "per 1 bunch", "price": 1.29, "quantity": 40, "category": "Fruits", "weight": 2.5},
    {"name": "Apples", "description": "per 2 lb bag", "price": 3.29, "quantity": 35, "category": "Fruits", "weight": 3.0},
    {"name": "Grapes", "description": "per 2 lb pack", "price": 5.99, "quantity": 25, "category": "Fruits", "weight": 2.0},
    {"name": "Strawberries", "description": "per 1 lb pack", "price": 3.99, "quantity": 20, "category": "Fruits", "weight": 1.0},
    # Needs fixing
    {"name": "Oranges", "description": "per 4 count bag", "price": 3.79, "quantity": 30, "category": "Fruits", "weight": 3.5},

    # Vegetables
    {"name": "Carrots", "description": "per 2 lb bag", "price": 2.49, "quantity": 25, "category": "Vegetables", "weight": 2.0},
    {"name": "Broccoli", "description": "per 1 head", "price": 1.89, "quantity": 30, "category": "Vegetables", "weight": 1.0},
    {"name": "Spinach", "description": "per 16 oz bag", "price": 4.99, "quantity": 20, "category": "Vegetables", "weight": 1.0},
    {"name": "Red Bell Pepper", "description": "per 1 pepper", "price": 1.29, "quantity": 40, "category": "Vegetables", "weight": 0.5},
    {"name": "Sweet Potatoes", "description": "per 3 count bag", "price": 3.99, "quantity": 15, "category": "Vegetables", "weight": 2.0},

    # Meat
    {"name": "Ground Beef", "description": "per 1 lb pack", "price": 6.49, "quantity": 30, "category": "Meat", "weight": 1.0},
    {"name": "Chicken Breast", "description": "per 1.5 lb pack", "price": 7.99, "quantity": 25, "category": "Meat", "weight": 1.5},
    {"name": "Pork Chops", "description": "per 1 lb pack", "price": 5.99, "quantity": 20, "category": "Meat", "weight": 1.0},
    {"name": "Bacon", "description": "per 12 oz pack", "price": 5.49, "quantity": 18, "category": "Meat", "weight": 0.75},
    {"name": "Beef Stew Meat", "description": "per 1 lb pack", "price": 6.99, "quantity": 12, "category": "Meat", "weight": 1.0},

    # Seafood
    {"name": "Salmon Fillet", "description": "per 1 lb", "price": 9.99, "quantity": 15, "category": "Seafood", "weight": 1.0},
    {"name": "Shrimp", "description": "per 1 lb bag", "price": 8.99, "quantity": 20, "category": "Seafood", "weight": 1.0},
    {"name": "Tilapia Fillet", "description": "per 1 lb", "price": 6.99, "quantity": 18, "category": "Seafood", "weight": 1.0},
    {"name": "Crab Legs", "description": "per 1 lb", "price": 14.99, "quantity": 10, "category": "Seafood", "weight": 1.0},
    {"name": "Baby Octopus", "description": "per 1 lb", "price": 9.99, "quantity": 15, "category": "Seafood", "weight": 1.0},

    # Dairy
    {"name": "Whole Milk", "description": "per 1 gallon", "price": 3.99, "quantity": 25, "category": "Dairy", "weight": 8.6},
    {"name": "Cheddar Cheese", "description": "per 8 oz block", "price": 2.99, "quantity": 20, "category": "Dairy", "weight": 0.5},
    {"name": "Yogurt", "description": "per 6 oz cup", "price": 1.19, "quantity": 35, "category": "Dairy", "weight": 0.375},
    {"name": "Butter", "description": "per 1 lb", "price": 4.49, "quantity": 18, "category": "Dairy", "weight": 1.0},
    {"name": "Eggs", "description": "per dozen", "price": 3.29, "quantity": 20, "category": "Dairy", "weight": 1.5},

    # Pantry
    {"name": "Spaghetti", "description": "per 16 oz box", "price": 1.59, "quantity": 40, "category": "Pantry", "weight": 1.0},
    {"name": "All-Purpose Flour", "description": "per 5 lb bag", "price": 3.29, "quantity": 25, "category": "Pantry", "weight": 5.0},
    {"name": "White Rice", "description": "per 2 lb bag", "price": 2.99, "quantity": 30, "category": "Pantry", "weight": 2.0},
    {"name": "Pinto Beans", "description": "per 15 oz can", "price": 1.19, "quantity": 35, "category": "Pantry", "weight": 0.9375},
    {"name": "Olive Oil", "description": "per 16.9 oz bottle", "price": 6.99, "quantity": 20, "category": "Pantry", "weight": 1.0},

    # Beverages
    {"name": "Orange Juice", "description": "per 52 oz bottle", "price": 4.49, "quantity": 20, "category": "Beverages", "weight": 3.25},
    {"name": "Oat Milk", "description": "per 64 oz carton", "price": 4.29, "quantity": 15, "category": "Beverages", "weight": 4.0},
    {"name": "Black Tea", "description": "per 20-bag box", "price": 3.99, "quantity": 18, "category": "Beverages", "weight": 0.25},
    {"name": "Cold Brew Coffee", "description": "per 32 oz bottle", "price": 5.99, "quantity": 12, "category": "Beverages", "weight": 2.0},
    {"name": "Almond Milk", "description": "per 64 oz carton", "price": 3.29, "quantity": 16, "category": "Beverages", "weight": 4.0},

    # Bakery 
    {"name": "Whole Wheat Bread", "description": "per 1 loaf", "price": 3.29, "quantity": 30, "category": "Bakery", "weight": 1.5},
    {"name": "Bagels", "description": "per 6 count pack", "price": 3.99, "quantity": 25, "category": "Bakery", "weight": 1.25},
    {"name": "Croissants", "description": "per 4 count pack", "price": 4.49, "quantity": 15, "category": "Bakery", "weight": 1.0},
    {"name": "Muffins", "description": "per 4 count pack", "price": 3.99, "quantity": 20, "category": "Bakery", "weight": 1.0},
    {"name": "Ciabatta Rolls", "description": "per 6 count pack", "price": 4.79, "quantity": 18, "category": "Bakery", "weight": 1.5},

    # Spices
    {"name": "Cinnamon", "description": "per 2 oz jar", "price": 2.49, "quantity": 25, "category": "Spices", "weight": 0.125},
    {"name": "Garlic Powder", "description": "per 2 oz jar", "price": 2.99, "quantity": 20, "category": "Spices", "weight": 0.125},
    {"name": "Paprika", "description": "per 2 oz jar", "price": 2.79, "quantity": 18, "category": "Spices", "weight": 0.125},
    {"name": "Cumin", "description": "per 2 oz jar", "price": 2.59, "quantity": 15, "category": "Spices", "weight": 0.125},
    {"name": "Chili Powder", "description": "per 2 oz jar", "price": 2.89, "quantity": 20, "category": "Spices", "weight": 0.125},

    # Vegetarian
    {"name": "Tofu", "description": "per 14 oz block", "price": 2.49, "quantity": 30, "category": "Vegetarian", "weight": 0.875},
    {"name": "Vegan Patties", "description": "per 2 count pack", "price": 5.99, "quantity": 20, "category": "Vegetarian", "weight": 0.5},
    # {"name": "Chickpeas", "description": "per 15 oz can", "price": 1.39, "quantity": 25, "category": "Vegetarian", "weight": 0.9375},
    {"name": "Veggie Mix", "description": "per 1 lb bag", "price": 4.99, "quantity": 15, "category": "Vegetarian", "weight": 1.0},
    {"name": "Lentils", "description": "per 1 lb bag", "price": 2.49, "quantity": 20, "category": "Vegetarian", "weight": 1.0},
]


cursor = connection.cursor()

for product in products:
    image_path = f"images/{product['name']}.jpg"

    if not os.path.exists(image_path):
        print(f"Skipping {product['name']}: no image yet.")
        continue

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
                        product['category'], product['weight'], image_data))
                        
    except Exception as e:
        print(f"Error inserting product {product['name']}: {e}")

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
