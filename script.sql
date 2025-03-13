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