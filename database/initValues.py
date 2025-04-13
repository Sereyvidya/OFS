import mysql.connector

connection = mysql.connector.connect(
    host = "localhost",
    port = 3306,
    user = "root",
    password = "password",
    database="OFS"
)

# Initial products: Additional information about each product stored in additional arrays
# If you ever want to add a new example product, just add it to the end of each array (And name the image product_name.jpg)
products = [
    {"name": "Apple", "description": "3 lb bag", "price": 5.99, "quantity": 50, "category": "Fruits", "weight": 3.0},
    {"name": "Bacon", "description": "12 oz pack", "price": 5.49, "quantity": 30, "category": "Meat", "weight": 0.75},
    {"name": "Baking Powder", "description": "16 oz container", "price": 2.99, "quantity": 20, "category": "Pantry", "weight": 1.0},
    {"name": "Banana", "description": "1 bunch ripe", "price": 0.69, "quantity": 60, "category": "Fruits", "weight": 2.5},
    {"name": "Bell Pepper", "description": "1 large pepper", "price": 0.99, "quantity": 40, "category": "Vegetables", "weight": 0.5},
    {"name": "Black Pepper", "description": "2 oz ground", "price": 2.99, "quantity": 25, "category": "Spices", "weight": 0.125},
    {"name": "Blueberry", "description": "6 oz pack", "price": 2.99, "quantity": 35, "category": "Fruits", "weight": 0.375},
    {"name": "Blue Crab", "description": "1 live (approx. 1 lb)", "price": 13.99, "quantity": 20, "category": "Seafood", "weight": 1.0},
    {"name": "Bread", "description": "1 loaf whole wheat", "price": 2.79, "quantity": 50, "category": "Bakery", "weight": 1.5},
    {"name": "Broccoli", "description": "1 head", "price": 1.89, "quantity": 40, "category": "Vegetables", "weight": 1.0},
    {"name": "Butter", "description": "16 oz stick", "price": 3.99, "quantity": 45, "category": "Dairy", "weight": 1.0},
    {"name": "Carrot", "description": "1 lb bag", "price": 1.29, "quantity": 55, "category": "Vegetables", "weight": 1.0},
    {"name": "Cereal", "description": "18 oz box", "price": 4.49, "quantity": 30, "category": "Pantry", "weight": 1.125},
    {"name": "Cheese", "description": "8 oz block cheddar", "price": 3.99, "quantity": 50, "category": "Dairy", "weight": 0.5},
    {"name": "Chicken Breast", "description": "4 lb", "price": 10.99, "quantity": 40, "category": "Meat", "weight": 4.0},
    {"name": "Chicken Drumstick", "description": "4 lb", "price": 6.79, "quantity": 45, "category": "Meat", "weight": 4.0},
    {"name": "Chicken Thigh", "description": "4 boneless thighs", "price": 8.99, "quantity": 40, "category": "Meat", "weight": 4.0},
    {"name": "Chicken Wing", "description": "4 lb wings", "price": 4.99, "quantity": 50, "category": "Meat", "weight": 4.0},
    {"name": "Coffee Powder", "description": "12 oz bag ground", "price": 8.99, "quantity": 25, "category": "Beverages", "weight": 0.75},
    {"name": "Cooking Oil", "description": "1 liter bottle", "price": 4.99, "quantity": 30, "category": "Pantry", "weight": 2.2},
    {"name": "Egg", "description": "12 count carton", "price": 2.99, "quantity": 70, "category": "Dairy", "weight": 1.5},
    {"name": "Flour", "description": "5 lb bag all-purpose", "price": 3.49, "quantity": 35, "category": "Pantry", "weight": 5.0},
    {"name": "Grape", "description": "1 lb seedless", "price": 2.99, "quantity": 40, "category": "Fruits", "weight": 1.0},
    {"name": "Ground Beef", "description": "1 lb", "price": 6.99, "quantity": 30, "category": "Meat", "weight": 1.0},
    {"name": "Ham", "description": "1 lb smoked slices", "price": 5.99, "quantity": 35, "category": "Meat", "weight": 1.0},
    {"name": "Heavy Cream", "description": "16 oz carton", "price": 4.79, "quantity": 20, "category": "Dairy", "weight": 1.0},
    {"name": "Honey", "description": "12 oz bottle raw", "price": 5.99, "quantity": 15, "category": "Pantry", "weight": 0.75},
    {"name": "Lamb Shoulder", "description": "1 lb fresh", "price": 10.99, "quantity": 20, "category": "Meat", "weight": 1.0},
    {"name": "Lobster", "description": "1 live (approx. 1.5 lbs)", "price": 19.99, "quantity": 10, "category": "Seafood", "weight": 1.5},
    {"name": "Milk", "description": "1 gallon whole", "price": 3.99, "quantity": 50, "category": "Dairy", "weight": 8.6},
    {"name": "Onion", "description": "1 large", "price": 1.19, "quantity": 60, "category": "Vegetables", "weight": 0.5},
    {"name": "Orange Juice", "description": "1 quart", "price": 4.99, "quantity": 25, "category": "Beverages", "weight": 2.1},
    {"name": "Orange", "description": "1 large navel", "price": 1.29, "quantity": 45, "category": "Fruits", "weight": 0.5},
    {"name": "Oyster", "description": "1 dozen fresh", "price": 14.99, "quantity": 15, "category": "Seafood", "weight": 2.0},
    {"name": "Pasta", "description": "16 oz box", "price": 2.49, "quantity": 40, "category": "Pantry", "weight": 1.0},
    {"name": "Peanut Butter", "description": "16 oz jar", "price": 3.99, "quantity": 30, "category": "Pantry", "weight": 1.0},
    {"name": "Pineapple", "description": "1 whole", "price": 3.99, "quantity": 25, "category": "Fruits", "weight": 4.0},
    {"name": "Pork Chop", "description": "1 lb bone-in", "price": 6.99, "quantity": 30, "category": "Meat", "weight": 1.0},
    {"name": "Potato", "description": "5 lb bag russet", "price": 2.99, "quantity": 50, "category": "Vegetables", "weight": 5.0},
    {"name": "Rice", "description": "2 lb bag white", "price": 4.99, "quantity": 60, "category": "Pantry", "weight": 2.0},
    {"name": "Salmon", "description": "8 oz fillet", "price": 7.99, "quantity": 30, "category": "Seafood", "weight": 0.5},
    {"name": "Salt", "description": "26 oz container", "price": 1.99, "quantity": 40, "category": "Spices", "weight": 1.625},
    {"name": "Salami", "description": "8 oz pack sliced", "price": 7.49, "quantity": 30, "category": "Meat", "weight": 0.5},
    {"name": "Sausage", "description": "12 oz pack pork", "price": 5.99, "quantity": 40, "category": "Meat", "weight": 0.75},
    {"name": "Shrimp", "description": "1 lb jumbo", "price": 11.99, "quantity": 30, "category": "Seafood", "weight": 1.0},
    {"name": "Spinach", "description": "1 bunch", "price": 2.49, "quantity": 35, "category": "Vegetables", "weight": 1.0},
    {"name": "Squid", "description": "1 lb", "price": 8.99, "quantity": 20, "category": "Seafood", "weight": 1.0},
    {"name": "Steak", "description": "1 lb premium ribeye", "price": 12.99, "quantity": 25, "category": "Meat", "weight": 1.0},
    {"name": "Strawberry", "description": "16 oz pack", "price": 3.49, "quantity": 30, "category": "Fruits", "weight": 1.0},
    {"name": "Sugar", "description": "4 lb bag", "price": 3.99, "quantity": 45, "category": "Pantry", "weight": 4.0},
    {"name": "Tea Leaves", "description": "8 oz box", "price": 6.99, "quantity": 20, "category": "Beverages", "weight": 0.5},
    {"name": "Tofu", "description": "14 oz block", "price": 2.49, "quantity": 40, "category": "Dairy", "weight": 0.875},
    {"name": "Tomato", "description": "1 lb bag", "price": 1.99, "quantity": 50, "category": "Vegetables", "weight": 1.0},
    {"name": "Tuna", "description": "5 oz can", "price": 1.29, "quantity": 50, "category": "Seafood", "weight": 0.312},
    {"name": "Vinegar", "description": "16 oz bottle", "price": 2.49, "quantity": 30, "category": "Pantry", "weight": 1.0},
    {"name": "Whole Chicken", "description": "1 whole (approx. 4 lbs)", "price": 8.99, "quantity": 15, "category": "Meat", "weight": 4.0},
    {"name": "Yogurt", "description": "6 oz cup vanilla", "price": 1.29, "quantity": 60, "category": "Dairy", "weight": 0.375}
]

cursor = connection.cursor()

for i in range(0, len(products)):
    # Read the image file as binary so SQL can store it

    # If you're using WindowOS, uncomment this line and run it
    # with open("images\\" + products[i]['name'] + ".jpg", 'rb') as file:
    #     image_data = file.read()

    # Uncomment this if you're using MacOS

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

connection.commit()

cursor.close()
connection.close()

print("Success")