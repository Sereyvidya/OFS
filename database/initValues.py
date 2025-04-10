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
    {"name": "Apple", "description": "1 lb of apples", "price": 1.99, "quantity": 50, "category": "Fruits", "weight": 1.0},
    {"name": "Bacon", "description": "12 oz pack of bacon", "price": 5.49, "quantity": 30, "category": "Meat", "weight": 0.75},
    {"name": "Baking Powder", "description": "16 oz container of baking powder", "price": 2.99, "quantity": 20, "category": "Pantry", "weight": 1.0},
    {"name": "Banana", "description": "1 bunch of ripe bananas", "price": 0.69, "quantity": 60, "category": "Fruits", "weight": 2.5},
    {"name": "Bell Pepper", "description": "1 large bell pepper", "price": 1.49, "quantity": 40, "category": "Vegetables", "weight": 0.5},
    {"name": "Black Pepper", "description": "2 oz ground black pepper", "price": 3.99, "quantity": 25, "category": "Spices", "weight": 0.125},
    {"name": "Blueberry", "description": "6 oz pack of blueberries", "price": 2.99, "quantity": 35, "category": "Fruits", "weight": 0.375},
    {"name": "Blue Crab", "description": "1 fresh blue crab", "price": 13.99, "quantity": 20, "category": "Seafood", "weight": 1.0},
    {"name": "Bread", "description": "1 loaf of whole wheat bread", "price": 2.79, "quantity": 50, "category": "Bakery", "weight": 1.5},
    {"name": "Broccoli", "description": "1 head of broccoli", "price": 1.89, "quantity": 40, "category": "Vegetables", "weight": 1.0},
    {"name": "Butter", "description": "16 oz stick of butter", "price": 3.99, "quantity": 45, "category": "Dairy", "weight": 1.0},
    {"name": "Carrot", "description": "1 lb of carrots", "price": 1.29, "quantity": 55, "category": "Vegetables", "weight": 1.0},
    {"name": "Cereal", "description": "18 oz box of cereal", "price": 4.49, "quantity": 30, "category": "Pantry", "weight": 1.125},
    {"name": "Cheese", "description": "8 oz block of cheddar cheese", "price": 3.99, "quantity": 50, "category": "Dairy", "weight": 0.5},
    {"name": "Chicken Breast", "description": "1 lb of boneless chicken breast", "price": 5.99, "quantity": 40, "category": "Meat", "weight": 1.0},
    {"name": "Chicken Drumstick", "description": "1 lb of chicken drumsticks", "price": 4.79, "quantity": 45, "category": "Meat", "weight": 1.0},
    {"name": "Chicken Thigh", "description": "1 lb of boneless chicken thighs", "price": 4.99, "quantity": 40, "category": "Meat", "weight": 1.0},
    {"name": "Chicken Wing", "description": "1 lb of fresh chicken wings", "price": 4.99, "quantity": 50, "category": "Meat", "weight": 1.0},
    {"name": "Coffee Powder", "description": "12 oz bag of ground coffee", "price": 8.99, "quantity": 25, "category": "Beverages", "weight": 0.75},
    {"name": "Cooking Oil", "description": "1 liter bottle of cooking oil", "price": 4.99, "quantity": 30, "category": "Pantry", "weight": 2.2},
    {"name": "Egg", "description": "12 count carton of eggs", "price": 2.99, "quantity": 70, "category": "Dairy", "weight": 1.5},
    {"name": "Flour", "description": "5 lb bag of all-purpose flour", "price": 3.49, "quantity": 35, "category": "Pantry", "weight": 5.0},
    {"name": "Grape", "description": "1 lb of seedless grapes", "price": 2.99, "quantity": 40, "category": "Fruits", "weight": 1.0},
    {"name": "Ground Beef", "description": "1 lb of ground beef", "price": 6.99, "quantity": 30, "category": "Meat", "weight": 1.0},
    {"name": "Ham", "description": "1 lb of smoked ham slices", "price": 5.99, "quantity": 35, "category": "Meat", "weight": 1.0},
    {"name": "Heavy Cream", "description": "16 oz carton of heavy cream", "price": 4.79, "quantity": 20, "category": "Dairy", "weight": 1.0},
    {"name": "Honey", "description": "12 oz bottle of raw honey", "price": 5.99, "quantity": 15, "category": "Pantry", "weight": 0.75},
    {"name": "Lamb Shoulder", "description": "1 lb of fresh lamb shoulder", "price": 10.99, "quantity": 20, "category": "Meat", "weight": 1.0},
    {"name": "Lobster", "description": "1 whole live lobster (approx. 1.5 lbs)", "price": 19.99, "quantity": 10, "category": "Seafood", "weight": 1.5},
    {"name": "Milk", "description": "1 gallon of whole milk", "price": 3.99, "quantity": 50, "category": "Dairy", "weight": 8.6},
    {"name": "Onion", "description": "1 large onion", "price": 1.19, "quantity": 60, "category": "Vegetables", "weight": 0.5},
    {"name": "Orange Juice", "description": "1 quart of orange juice", "price": 4.99, "quantity": 25, "category": "Beverages", "weight": 2.1},
    {"name": "Orange", "description": "1 large navel orange", "price": 1.29, "quantity": 45, "category": "Fruits", "weight": 0.5},
    {"name": "Oyster", "description": "1 dozen fresh oysters", "price": 14.99, "quantity": 15, "category": "Seafood", "weight": 2.0},
    {"name": "Pasta", "description": "16 oz box of pasta", "price": 2.49, "quantity": 40, "category": "Pantry", "weight": 1.0},
    {"name": "Peanut Butter", "description": "16 oz jar of peanut butter", "price": 3.99, "quantity": 30, "category": "Pantry", "weight": 1.0},
    {"name": "Pineapple", "description": "1 whole pineapple", "price": 3.99, "quantity": 25, "category": "Fruits", "weight": 4.0},
    {"name": "Pork Chop", "description": "1 lb of bone-in pork chop", "price": 6.99, "quantity": 30, "category": "Meat", "weight": 1.0},
    {"name": "Potato", "description": "5 lb bag of russet potatoes", "price": 2.99, "quantity": 50, "category": "Vegetables", "weight": 5.0},
    {"name": "Rice", "description": "2 lb bag of white rice", "price": 4.99, "quantity": 60, "category": "Pantry", "weight": 2.0},
    {"name": "Salmon", "description": "8 oz fillet of salmon", "price": 7.99, "quantity": 30, "category": "Seafood", "weight": 0.5},
    {"name": "Salt", "description": "26 oz container of table salt", "price": 1.99, "quantity": 40, "category": "Spices", "weight": 1.625},
    {"name": "Salami", "description": "8 oz pack of sliced salami", "price": 7.49, "quantity": 30, "category": "Meat", "weight": 0.5},
    {"name": "Sausage", "description": "12 oz pack of pork sausages", "price": 5.99, "quantity": 40, "category": "Meat", "weight": 0.75},
    {"name": "Shrimp", "description": "1 lb of jumbo shrimp (peeled & deveined)", "price": 11.99, "quantity": 30, "category": "Seafood", "weight": 1.0},
    {"name": "Spinach", "description": "1 bunch of spinach", "price": 2.49, "quantity": 35, "category": "Vegetables", "weight": 1.0},
    {"name": "Squid", "description": "1 lb of cleaned squid", "price": 8.99, "quantity": 20, "category": "Seafood", "weight": 1.0},
    {"name": "Steak", "description": "1 lb of premium ribeye steak", "price": 12.99, "quantity": 25, "category": "Meat", "weight": 1.0},
    {"name": "Strawberry", "description": "16 oz pack of strawberries", "price": 3.49, "quantity": 30, "category": "Fruits", "weight": 1.0},
    {"name": "Sugar", "description": "4 lb bag of granulated sugar", "price": 3.99, "quantity": 45, "category": "Pantry", "weight": 4.0},
    {"name": "Tea Leaves", "description": "8 oz bag of loose tea leaves", "price": 6.99, "quantity": 20, "category": "Beverages", "weight": 0.5},
    {"name": "Tofu", "description": "14 oz block of firm tofu", "price": 2.49, "quantity": 25, "category": "Vegetarian", "weight": 0.875},
    {"name": "Tomato Sauce", "description": "24 oz jar of tomato sauce", "price": 3.49, "quantity": 40, "category": "Pantry", "weight": 1.5},
    {"name": "Tomato", "description": "1 lb of tomatoes", "price": 2.29, "quantity": 50, "category": "Vegetables", "weight": 1.0},
    {"name": "Tuna", "description": "8 oz tuna steak", "price": 9.49, "quantity": 25, "category": "Seafood", "weight": 0.5},
    {"name": "Vinegar", "description": "16 oz bottle of vinegar", "price": 2.99, "quantity": 30, "category": "Pantry", "weight": 1.0},
    {"name": "Whole Chicken", "description": "1 whole fresh chicken (approx. 4 lbs)", "price": 9.99, "quantity": 25, "category": "Meat", "weight": 4.0},
    {"name": "Yogurt", "description": "32 oz tub of plain yogurt", "price": 4.99, "quantity": 40, "category": "Dairy", "weight": 2.0}
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