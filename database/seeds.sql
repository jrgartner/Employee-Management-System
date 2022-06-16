--creating dummy data

USE employee_db;

INSERT INTO departments (id, department) VALUES ("1", "Project Management");
INSERT INTO departments (id, department) VALUES ("2", "Engineering Team");
INSERT INTO departments (id, department) VALUES ("3", "Consultants");


INSERT INTO roles (id, title, salary, depId) VALUES ("1", "Lead PM", "90000", "1");
INSERT INTO roles (id, title, salary, depId) VALUES ("2", "Staff Engineer", "80000", "2");
INSERT INTO roles (id, title, salary, depId) VALUES ("3", "Engineer", "60000", "3");


INSERT INTO employees (id, firstName, lastName, roleId, managerId) VALUES ("1", "Bill", "Burke", "1", NULL);
INSERT INTO employees (id, firstName, lastName, roleId, managerId) VALUES ("2", "Steve", "Harrington", "1", "1");
INSERT INTO employees (id, firstName, lastName, roleId, managerId) VALUES ("3", "Princess", "Disco", "2", "4");