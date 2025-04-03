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
    {"name": "Apple", "description": "1 lb of fresh apples", "price": 1.99, "quantity": 50, "category": "Fruits"},
    {"name": "Bacon", "description": "12 oz pack of bacon", "price": 5.49, "quantity": 30, "category": "Meat"},
    {"name": "Baking Powder", "description": "16 oz container of baking powder", "price": 2.99, "quantity": 20, "category": "Pantry"},
    {"name": "Banana", "description": "1 bunch of ripe bananas", "price": 0.69, "quantity": 60, "category": "Fruits"},
    {"name": "Bell Pepper", "description": "1 large bell pepper", "price": 1.49, "quantity": 40, "category": "Vegetables"},
    {"name": "Black Pepper", "description": "2 oz ground black pepper", "price": 3.99, "quantity": 25, "category": "Spices"},
    {"name": "Blueberry", "description": "6 oz pack of blueberries", "price": 2.99, "quantity": 35, "category": "Fruits"},
    {"name": "Bread", "description": "1 loaf of whole wheat bread", "price": 2.79, "quantity": 50, "category": "Bakery"},
    {"name": "Broccoli", "description": "1 head of fresh broccoli", "price": 1.89, "quantity": 40, "category": "Vegetables"},
    {"name": "Butter", "description": "16 oz stick of butter", "price": 3.99, "quantity": 45, "category": "Dairy"},
    {"name": "Carrot", "description": "1 lb of fresh carrots", "price": 1.29, "quantity": 55, "category": "Vegetables"},
    {"name": "Cereal", "description": "18 oz box of cereal", "price": 4.49, "quantity": 30, "category": "Pantry"},
    {"name": "Cheese", "description": "8 oz block of cheddar cheese", "price": 3.99, "quantity": 50, "category": "Dairy"},
    {"name": "Chicken Breast", "description": "1 lb of boneless chicken breast", "price": 5.99, "quantity": 40, "category": "Meat"},
    {"name": "Coffee Powder", "description": "12 oz bag of ground coffee", "price": 8.99, "quantity": 25, "category": "Beverages"},
    {"name": "Cooking Oil", "description": "1 liter bottle of cooking oil", "price": 4.99, "quantity": 30, "category": "Pantry"},
    {"name": "Egg", "description": "12 count carton of eggs", "price": 2.99, "quantity": 70, "category": "Dairy"},
    {"name": "Flour", "description": "5 lb bag of all-purpose flour", "price": 3.49, "quantity": 35, "category": "Pantry"},
    {"name": "Grape", "description": "1 lb of seedless grapes", "price": 2.99, "quantity": 40, "category": "Fruits"},
    {"name": "Ground Beef", "description": "1 lb of ground beef", "price": 6.99, "quantity": 30, "category": "Meat"},
    {"name": "Heavy Cream", "description": "16 oz carton of heavy cream", "price": 4.79, "quantity": 20, "category": "Dairy"},
    {"name": "Honey", "description": "12 oz bottle of raw honey", "price": 5.99, "quantity": 15, "category": "Pantry"},
    {"name": "Milk", "description": "1 gallon of whole milk", "price": 3.99, "quantity": 50, "category": "Dairy"},
    {"name": "Onion", "description": "1 large onion", "price": 1.19, "quantity": 60, "category": "Vegetables"},
    {"name": "Orange Juice", "description": "1 quart of orange juice", "price": 4.99, "quantity": 25, "category": "Beverages"},
    {"name": "Orange", "description": "1 large navel orange", "price": 1.29, "quantity": 45, "category": "Fruits"},
    {"name": "Pasta", "description": "16 oz box of pasta", "price": 2.49, "quantity": 40, "category": "Pantry"},
    {"name": "Peanut Butter", "description": "16 oz jar of peanut butter", "price": 3.99, "quantity": 30, "category": "Pantry"},
    {"name": "Pineapple", "description": "1 whole fresh pineapple", "price": 3.99, "quantity": 25, "category": "Fruits"},
    {"name": "Potato", "description": "5 lb bag of russet potatoes", "price": 2.99, "quantity": 50, "category": "Vegetables"},
    {"name": "Rice", "description": "2 lb bag of white rice", "price": 4.99, "quantity": 60, "category": "Pantry"},
    {"name": "Salmon", "description": "8 oz fillet of salmon", "price": 7.99, "quantity": 30, "category": "Seafood"},
    {"name": "Salt", "description": "26 oz container of table salt", "price": 1.99, "quantity": 40, "category": "Spices"},
    {"name": "Spinach", "description": "1 bunch of fresh spinach", "price": 2.49, "quantity": 35, "category": "Vegetables"},
    {"name": "Strawberry", "description": "16 oz pack of fresh strawberries", "price": 3.49, "quantity": 30, "category": "Fruits"},
    {"name": "Sugar", "description": "4 lb bag of granulated sugar", "price": 3.99, "quantity": 45, "category": "Pantry"},
    {"name": "Tea Leaves", "description": "8 oz bag of loose tea leaves", "price": 6.99, "quantity": 20, "category": "Beverages"},
    {"name": "Tofu", "description": "14 oz block of firm tofu", "price": 2.49, "quantity": 25, "category": "Vegetarian"},
    {"name": "Tomato Sauce", "description": "24 oz jar of tomato sauce", "price": 3.49, "quantity": 40, "category": "Pantry"},
    {"name": "Tomato", "description": "1 lb of fresh tomatoes", "price": 2.29, "quantity": 50, "category": "Vegetables"},
    {"name": "Vinegar", "description": "16 oz bottle of vinegar", "price": 2.99, "quantity": 30, "category": "Pantry"},
    {"name": "Yogurt", "description": "32 oz tub of plain yogurt", "price": 4.99, "quantity": 40, "category": "Dairy"}
]


cursor = connection.cursor()

for i in range(0, len(products)):
    # Read the image file as binary so SQL can store it

    # If you're using WindowOS, uncomment this line and run it
    # with open("images\\" + products[i]['name'] + ".jpg", 'rb') as file:
    #     image_data = file.read()

    # Uncomment this if you're using MacOS
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
            image
        ) 
        VALUES (%s, %s, %s, %s, %s, %s);
    """
    cursor.execute(insert_query, (
                    products[i]['name'], products[i]['description'],
                    products[i]['price'], products[i]['quantity'], 
                    products[i]['category'], image_data))

connection.commit()

cursor.close()
connection.close()

print("Success")