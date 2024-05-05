CREATE DATABASE product_sys;

use product_sys;


CREATE TABLE product(
	productId int primary key auto_increment,
    productName varchar (30) not null,
    productPrice float,
	userEmployeeId int,
    foreign key (userEmployeeId) references userEmployee (userEmployeeId)
);

CREATE TABLE employee(
	employeeId int primary key auto_increment,
    employeeName varchar(50) not null,
    employeeEmail varchar(50) not null,
    employeePhone varchar(11)
);

ALTER TABLE employee ADD CONSTRAINT UNIQUE employee(employeeEmail);

CREATE TABLE userEmployee(
	userEmployeeId int auto_increment,
    userEmployeeLogin varchar(10),
    userEmployeePass varchar(32),
    userEmployeeRegistrationDate date DEFAULT(CURRENT_DATE),
    userEmployeeIdEmployeeId int,
    foreign key (userEmployeeIdEmployeeId) references employee (employeeId),
    primary key (userEmployeeId, userEmployeeLogin)
);

CREATE TABLE roles(
	rolesId INT auto_increment,
    rolesName varchar (15) unique,
    primary key(rolesId)
);