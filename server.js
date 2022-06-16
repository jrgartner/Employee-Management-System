const path = require("path");
const fs = require("fs");
let mysql = require("mysql");
let inquirer = require("inquirer");
const connection = require("./database/connection");

connection.connect(function (err) {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  init();
});

// welcome screen to the ems
function init() {
  console.log(`Welcome to the Employee Management System (EMS)`);
  wwyltd();
}
// asking what the user would you like to do?
function wwyltd() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "doWhat",
        message: "What would you like to do today?",
        choices: [
          {
            name: "View all Employees",
            value: "VIEW_EMPLOYEES",
          },
          {
            name: "View all Roles",
            value: "VIEW_ROLES",
          },
          {
            name: "View all Departments",
            value: "VIEW_DEPT",
          },
          {
            name: "Add employee",
            value: "ADD_EMPLOYEE",
          },
          {
            name: "Update Employee",
            value: "UPDATE_EMP",
          },
          {
            name: "Add Role",
            value: "ADD_ROLE",
          },
          {
            name: "Add Department",
            value: "ADD_DEPT",
          },
        ],
      },
    ])
    .then(({ doWhat }) => {
      if (doWhat === "VIEW_EMPLOYEES") {
        viewEmployee();
      } else if (doWhat === "ADD_EMPLOYEE") {
        addEmployeeByPaul();
      } else if (doWhat === "ADD_ROLE") {
        addRoles();
      } else if (doWhat === "UPDATE_EMP") {
        updateEmployeeByPaul();
      } else if (doWhat === "ADD_DEPT") {
        addDepartment();
      } else if (doWhat === "VIEW_ROLES") {
        viewRoles();
      } else if (doWhat === "VIEW_DEPT") {
        viewDepartments();
      } else if (doWhat === "UPDATE_ROLE") {
        updateRole();
      }
    });
}
// view employees
function viewDepartments() {
  console.log("Selecting all departments...\n");
  connection.query(
    "SELECT id AS `ID`, department AS `Department` FROM departments",
    function (err, res) {
      if (err) throw err;
      // Loggin all results of the SELECT statement
      console.table(res);
      areYouFinished();
    }
  );
}
function viewRoles() {
  console.log("Selecting all roles...\n");
  connection.query(
    "SELECT title AS `Title`, salary AS `Salary`, depId AS `Department Id` FROM roles",
    function (err, res) {
      if (err) throw err;
      // Loging all results of the SELECT statement
      console.table(res);
      areYouFinished();
    }
  );
}
function viewEmployee() {
  console.log("Selecting all employees...\n");
  connection.query(
    "SELECT firstName AS `First Name`, lastName AS `Last Name`, roleId AS `Role Id` FROM employees",
    function (err, res) {
      if (err) throw err;
      // Loggin all results of the SELECT statement
      console.table(res);
      areYouFinished();
    }
  );
}
// adding the employee, the department, and the role
function updateRole() {
  // getting the role data
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    const roles = res.map((element) => {
      return element.id;
    });
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is their first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is their last name?",
        },
        // asking a role question based on role data
        {
          name: "roleId",
          type: "list",
          message: "What is their role id?",
          choices: roles,
        },
      ])
      .then(function (answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query("INSERT INTO employees SET ?", answer, function (err) {
          if (err) throw err;
          console.log(
            `${answer.firstName} ${answer.lastName} was added successfully`
          );
          // re-prompt the user for if they want to bid or post
          areYouFinished();
        });
      });
  });
}
function addEmployeeByPaul() {
  connection.query("SELECT id, title from roles", function (err, res) {
    if (err) throw err;
    // const lastName = res.map(element => {
    //   return element.lastName
    const roles = res.map((element) => element.title);
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the new employees first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the new employees last name?",
        },
        {
          name: "roles",
          type: "list",
          message: "What is the title of their role?",
          choices: roles,
        },
      ])
      .then((answers) => {
        const chosenRole = res.find((element) => {
          return element.title === answers.roles;
        });
        console.log(chosenRole.id);
        const newEmployee = {
          firstName: answers.firstName,
          lastName: answers.lastName,
          roleId: chosenRole.id,
        };
        connection.query(
          "INSERT INTO employees SET ?",
          newEmployee,
          (err, success) => {
            if (err) throw err;
            console.log(`${newEmployee.firstName} was added successfully`);
            areYouFinished();
          }
        );
      });
  });
}
function updateEmployeeByPaul() {
  connection.query("Select * from employees", function (err, res) {
    if (err) throw err;
    //new list of first and last names
    const names = res.map((element) => {
      return `${element.id}: ${element.firstName} ${element.lastName}`;
    });
    connection.query("SELECT title, id from roles", function (err, success) {
      if (err) throw err;
      const roles = success.map((element) => element.title);
      inquirer
        .prompt([
          {
            name: "who",
            type: "list",
            choices: names,
            message: "Whom would you like to update?",
          },
          {
            name: "roles",
            type: "list",
            message: "What is the title of their new role?",
            choices: roles,
          },
        ])
        .then((answers) => {
          console.log(answers);
          const empIdToUpdate = answers.who.split(":")[0];
          console.log(empIdToUpdate);
          const chosenRole = success.find((element) => {
            return element.title === answers.roles;
          });
          console.log(chosenRole.id);
          connection.query(
            "UPDATE employees SET roleId=? where id=?",
            [chosenRole.id, empIdToUpdate],
            function (err, yay) {
              if (err) throw err;
              console.log(`role successfully changed`);
              areYouFinished();
            }
          );
        });
    });
  });
}

function addEmployee() {
  //getting the role data
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) throw err;
    const lastName = res.map((element) => {
      return element.lastName;
    });
    inquirer
      .prompt([
        // ask role question based on role data
        {
          name: "lastName",
          type: "list",
          message: "Who's role would you like to update?",
          choices: lastName,
        },
        {
          name: "newRole",
          type: "input",
          message: "What is their new role?",
        },
      ])
      .then(function (answer) {
        "UPDATE employees SET roleId = newRole WHERE condition;";
        connection.query("INSERT INTO employees SET ?", answer, function (err) {
          if (err) throw err;
          console.log(`${answer.lastName}  was added successfully`);
          // re-prompt the user for if they want to bid or post
          areYouFinished();
        });
      });
  });
}
function addDepartment() {
  // getting the role data
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    const departments = res.map((element) => {
      return element.id;
    });
    inquirer
      .prompt([
        {
          name: "department",
          type: "input",
          message: "What is their department?",
        },
      ])
      .then(function (answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO departments SET ?",
          answer,
          function (err) {
            if (err) throw err;
            console.log(`${answer.department} was added successfully`);
            // re-prompt the user for if they want to bid or post
            areYouFinished();
          }
        );
      });
  });
}
function addRoles() {
  // we need to get the role data
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    const departments = res.map((element) => {
      return element.id;
    });
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is their title?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is their salary?",
        },
        // ask role question based on role data
        {
          name: "depId",
          type: "list",
          message: "What is their department id?",
          choices: departments,
        },
      ])
      .then(function (answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query("INSERT INTO roles SET ?", answer, function (err) {
          if (err) throw err;
          console.log(`${answer.title} was added successfully`);
          // re-prompt the user for if they want to bid or post
          areYouFinished();
        });
      });
  });
}

function areYouFinished() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "continue",
        message: "Would you like to continue working?",
        choices: [
          {
            name: "Yes",
            value: true,
          },
          {
            name: "No",
            value: false,
          },
        ],
      },
    ])
    .then(function (answers) {
      if (answers.continue) {
        wwyltd();
      } else {
        console.log(`Goodbye`);
        process.exit();
      }
    });
}
