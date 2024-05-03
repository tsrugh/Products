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
select * from employee;
INSERT INTO employee (employeeName, employeeEmail, employeePhone) values ('lucas pereira dos santos', 'lucaspdsts@gmail.com', '11971008836');
INSERT INTO userEmployee (userEmployeeLogin, userEmployeePass, userEmployeeIdEmployeeId) values ('tsrugh', 'umaSenha123', 1);
insert into roles (rolesName) values ('mannager');

SELECT * FROM employee;
SELECT * FROM userEmployee;

SELECT employee.employeeName as userName, roles.rolesName from employee
join userEmployee on userEmployee.userEmployeeId = employee.employeeId
join roles on roles.rolesId  = userEmployee.rolesId
Where userEmployeeLogin = 'tsrugh';

update roles set rolesname = 'manager' where rolesId = 1;

select * from employee;

