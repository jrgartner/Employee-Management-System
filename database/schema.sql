--dropping the database if it already exist
DROP DATABASE IF EXISTS employee_db;
--creating new database
CREATE DATABASE employee_db;
USE employee_db;

--creating the departments table
CREATE TABLE departments(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

--creating the roles table
CREATE TABLE roles(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary decimal(12, 2) NOT NULL,
  depId INTEGER (11) NOT NULL, 
  PRIMARY KEY (id) 
);

--creating the employees table
CREATE TABLE employees(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  firstName VARCHAR(30) NOT NULL,
  lastName VARCHAR(30) NOT NULL,
  roleId INTEGER (11) NOT NULL, --populating here actually->title salray depid
  managerId INTEGER(11),
  PRIMARY KEY (id)
);
