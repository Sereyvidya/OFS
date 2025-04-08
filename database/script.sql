drop database if exists OFS;                   -- These first lines select a database in mySQL and should only be run one time by mySQL
create database OFS;
use OFS;

CREATE TABLE user (
	userID int auto_increment primary key,     -- userID will automatically increment by 1 every time a user is added
    firstName varchar(50) not null,
    lastName varchar(50) not null,
    email varchar(320) not null,
    phone varchar(10) not null,
    password varchar(256) not null
);

CREATE TABLE product (
	productID int auto_increment primary key,
    name varchar(50) not null,                 -- productName and productDesc and things users will see
    description varchar(255) not null,
    price decimal(5, 2) not null,
    quantity int not null,                     -- How much of the product is available?
    category varchar(50) not null,                     -- Product's category (For filter option)
    image longblob                             -- Blobs store binary data for images (We can change to image url (varchar) if it helps)
);

CREATE TABLE cartItem (
	cartItemID int auto_increment primary key,
	userID int not null,
    productID int not null, 
    quantity int default 1,                    -- How much of the item is the user adding to the cart?
    foreign key (userID) references user(userID) on delete cascade,       -- Cascade deletion: If user/product is deleted, delete the cart item
    foreign key (productID) references product(productID) on delete cascade
);

-- create table orders (
-- 	orderID int auto_increment not null primary key,
--     userID int not null,
--     totalCost decimal(10, 2),                   -- Cost calculated from items in the order
--     created_at timestamp default current_timestamp,  -- When the order was placed so that OFS employees can see this
--     deliveryStatus varchar(10),                 -- delivery status
--     orderRating int,                            -- Orders can be rated by customers (1-5 stars)
--     ratingDesc text,                            -- Decription of possible improvements from the user
--     foreign key (userID) references user(userID)
-- );

-- CREATE TABLE orderItems (  -- You can't store arrays, so this table stores items within each order
--     orderItemID int auto_increment primary key,
--     orderID int not null,
--     productID int not null,
--     quantity int default 1,
--     foreign key (orderID) references orders(orderID),
--     foreign key (productID) references products(productID)
-- );