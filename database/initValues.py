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
    "Apple", "Banana", "Bell Pepper", "Blueberries", 
    "Bread", "Broccoli", "Butter", "Carrot", "Cereal",
    "Cheese", "Chicken Breast", "Coffee", "Cooking Oil", 
    "Eggs", "Grapes", "Ground Beef", "Milk", "Onions",
    "Orange", "Pasta", "Peanut Butter", "Pineapple",
    "Potatoes", "Rice", "Spinach", "Strawberries",
    "Sugar", "Tomato Sauce", "Tomatoes"
]
desc = [
    "Fresh red apples", "Organic ripe bananas", "Mixed-color bell peppers", "Fresh blueberries", 
    "Whole grain loaf", "Fresh green broccoli", "1 lb salted butter", "Organic crunchy carrots", "Whole grain cereal",
    "Cheddar cheese block", "Boneless skinless chicken breast", "Ground coffee 12 oz", "Vegetable oil 48 oz", 
    "Dozen large eggs", "Seedless green grapes", "1 lb fresh ground beef", "1 gallon whole milk", "Yellow onions",
    "Juicy oranges", "1 lb spaghetti pasta", "16 oz peanut butter", "Whole tropical pineapple",
    "Russet potatoes", "5 lbs of white rice", "Leafy organic spinach", "Sweet strawberries",
    "4 lbs granulated sugar", "24 oz pasta sauce", "Ripe red tomatoes"
]
prices = [
    1.99, 1.20, 4.49, 3.49, 
    2.99, 2.99, 4.99, 2.50, 4.49,
    3.99, 8.99, 6.99, 6.49, 
    3.99, 5.99, 5.99, 4.49, 2.79,
    4.50, 1.79, 3.79, 3.99,
    4.99, 6.99, 3.29, 3.99,
    4.49, 2.99, 3.50
]
quantities = [
    50, 40, 35, 15, 
    25, 40, 15, 50, 30,
    25, 20, 20, 20, 
    30, 25, 20, 20, 30,
    30, 40, 30, 10,
    25, 15, 30, 20,
    25, 35, 40
]
organic = [
    True, True, True, True, 
    False, True, False, True, False,
    False, False, False, False, 
    False, True, False, False, False,
    True, False, False, True,
    False, False, True, True,
    False, False, False
]

cursor = connection.cursor()

for i in range(0, len(products)):
    # Read the image file as binary so SQL can store it
    with open("images\\" + products[i] + ".jpg", 'rb') as file:
        image_data = file.read()
    
    # Insert the binary data into the table
    insert_query = """
        INSERT INTO products (
            productName, 
            productDesc, 
            price, 
            quantity, 
            organic, 
            image
        ) 
        VALUES (%s, %s, %s, %s, %s, %s);
    """
    cursor.execute(insert_query, (products[i], desc[i], prices[i], quantities[i], organic[i], image_data))

connection.commit()

cursor.close()
connection.close()

print("Success")