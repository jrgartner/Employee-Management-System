//creating the js file asking if the user would like to continue or not

const inquirer = require("inquirer");

module.exports = function areYouFinished() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "continue",
        message: "Would you like to continue editting?",
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
};
