import mysql.connector
import random
from datetime import datetime

# Connect to MySQL
connection = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    password="password",
    database="OFS"
)

cursor = connection.cursor()

# Extended list of 15 San Jose addresses
addresses = [
    ("123 Maple Ave", "San Jose", "California", "95123"),
    ("2500 Bambi Lane", "San Jose", "California", "95116"),
    ("456 Willow St", "San Jose", "California", "95125"),
    ("789 Pinecrest Dr", "San Jose", "California", "95132"),
    ("1600 King Rd", "San Jose", "California", "95122"),
    ("88 South 4th St", "San Jose", "California", "95112"),
    ("500 S Market St", "San Jose", "California", "95113"),
    ("2103 Curtner Ave", "San Jose", "California", "95124"),
    ("920 S Winchester Blvd", "San Jose", "California", "95128"),
    ("1 W San Carlos St", "San Jose", "California", "95113"),
    ("1450 S Bascom Ave", "San Jose", "California", "95128"),
    ("350 W Julian St", "San Jose", "California", "95110"),
    ("1620 McKee Rd", "San Jose", "California", "95116"),
    ("180 Woz Way", "San Jose", "California", "95110"),
    ("3031 Tisch Way", "San Jose", "California", "95128")
]

# Random lat/lng within San Jose
def random_coords():
    lat = round(random.uniform(37.29, 37.39), 6)
    lng = round(random.uniform(-121.92, -121.82), 6)
    return lat, lng

# Insert 15 orders
for i in range(15):
    street, city, state, zip_code = addresses[i]
    total = round(random.uniform(20.00, 150.00), 2)
    weight = round(random.uniform(2.0, 25.0), 3)
    lat, lng = random_coords()

    insert_order = """
        INSERT INTO `order` (
            userID, orderDate, street, city, state, zip,
            total, weight, status, lat, lng
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """

    cursor.execute(insert_order, (
        1, datetime.now(), street, city, state, zip_code,
        total, weight, "awaiting", lat, lng
    ))

print("15 random San Jose orders inserted for userID 1.")

connection.commit()
cursor.close()
connection.close()
