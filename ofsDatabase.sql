drop database if exists OFS;                   -- These first lines select a database in mySQL and should only be run one time by mySQL
create database OFS;
use OFS;

create table users (
	userID int auto_increment primary key,     -- userID will automatically increment by 1 every time a user is added
    email varchar(100) not null,
    passwrd varchar(100) not null,
    employee bool not null,                    -- Is this user an employee?
    deliveryAddress varchar(255),
    paymentAddress varchar(255)
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
    foreign key (userID) references users(userID) on delete cascade,       -- Cascade deletion: If user/product is deleted, delete the cart item
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
    foreign key (userID) references users(userID)
);

CREATE TABLE orderItems (  -- You can't store arrays, so this table stores items within each order
    orderItemID int auto_increment primary key,
    orderID int not null,
    productID int not null,
    quantity int default 1,
    foreign key (orderID) references orders(orderID),
    foreign key (productID) references products(productID)
);