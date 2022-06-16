const util = require("util");
const mysql = require("mysql");

//connecting to the SQL database
module.exports = mysql.createConnection({
  host: "localhost",
  port: 3306,

  //enter your username
  user: "root",

  //enter your password
  password: "password",
  database: "employee_db",
});
