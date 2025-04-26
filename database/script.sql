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
    weight decimal(5, 3) not null,
    image longblob not null                          -- Blobs store binary data for images (We can change to image url (varchar) if it helps)
);

CREATE TABLE cart_item (
	cartItemID int auto_increment primary key,
	userID int not null,
    productID int not null, 
    quantity int default 1,                    -- How much of the item is the user adding to the cart?
    foreign key (userID) references user(userID) on delete cascade,       -- Cascade deletion: If user/product is deleted, delete the cart item
    foreign key (productID) references product(productID) on delete cascade
);

CREATE TABLE `order` (
    orderID int auto_increment primary key,
    userID int not null,
    orderDate datetime default current_timestamp,
    street varchar(100) not null,
    city varchar(50) not null,
    state varchar(50) not null,
    zip varchar(10) not null,
    total decimal(7, 2) not null,
    foreign key (userID) references user(userID) on delete cascade
);

CREATE TABLE order_item (
    orderItemID int auto_increment primary key,
    orderID int not null,
    productID int not null,
    quantity int not null,
    priceAtPurchase decimal(5,2) not null,  -- Store the price at time of purchase
    foreign key (orderID) references `order`(orderID) on delete cascade,
    foreign key (productID) references product(productID) on delete cascade
);

CREATE TABLE employee (
	employeeID int auto_increment primary key,     -- employeeID will automatically increment by 1 every time a user is added
    firstName varchar(50) not null,
    lastName varchar(50) not null,
    email varchar(320) not null,
    phone varchar(10) not null,
    password varchar(256) not null
);
