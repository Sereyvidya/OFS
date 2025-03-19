drop database if exists OFS;                   -- These first lines select a database in mySQL and should only be run one time by mySQL
create database OFS;
use OFS;

create table user (
	userID int auto_increment primary key,     -- userID will automatically increment by 1 every time a user is added
    firstName varchar(100) not null,
    lastName varchar(100) not null,
    email varchar(100) not null,
    phone varchar(100) not null,
    password varchar(255) not null,
    addressLine1 varchar(100) not null,
    addressLine2 varchar(100),
    city varchar(100) not null,
    state varchar(100) not null,
    zipCode varchar(100) not null,
    country varchar(100) not null
);

create table products (
	productID int auto_increment primary key,
    productName varchar(100) not null,         -- productName and productDesc and things users will see
    productDesc text,
    price decimal(10, 2) not null,
    quantity int not null,                     -- How much of the product is available?
    organic bool not null,                     -- Is the product organic? (For filter option)
    image longblob                             -- Blobs store binary data for images (We can change to image url (varchar) if it helps)
);

create table carts (
	cartID int auto_increment not null primary key,
	userID int not null,
    productID int not null, 
    quantity int default 1,                    -- How much of the item is the user adding to the cart?
    foreign key (userID) references user(userID) on delete cascade,       -- Cascade deletion: If user/product is deleted, delete the cart item
    foreign key (productID) references products(productID) on delete cascade
);

create table orders (
	orderID int auto_increment not null primary key,
    userID int not null,
    totalCost decimal(10, 2),                   -- Cost calculated from items in the order
    created_at timestamp default current_timestamp,  -- When the order was placed so that OFS employees can see this
    deliveryStatus varchar(10),                 -- delivery status
    orderRating int,                            -- Orders can be rated by customers (1-5 stars)
    ratingDesc text,                            -- Decription of possible improvements from the user
    foreign key (userID) references user(userID)
);

CREATE TABLE orderItems (  -- You can't store arrays, so this table stores items within each order
    orderItemID int auto_increment primary key,
    orderID int not null,
    productID int not null,
    quantity int default 1,
    foreign key (orderID) references orders(orderID),
    foreign key (productID) references products(productID)
);