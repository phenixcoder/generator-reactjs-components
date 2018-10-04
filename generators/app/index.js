"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");

module.exports = class extends Generator {
  initializing(args) {
    this.log("init");
    console.log(arguments["1"]);
    this.modulePath = arguments["1"];
    this.moduleName = path.parse(arguments["1"]).name;
  }

  prompting() {

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `REACT JS Generator\n${chalk.red(
          "Make new components"
        )} \nusing this generator!`
      )
    );

    const prompts = [];

    if (arguments["1"]) {
      this.modulePath = arguments["1"];
      this.moduleName = path.parse(arguments["1"]).name;
    } else {
      prompts.push([{
        type    : 'input',
        name    : 'moduleName',
        message : 'Enter Component name'
      }]);
    }

    prompts.push({
      type: "confirm",
      name: "useScss",
      message: "Would you like to use SCSS for styling?",
      default: false
    });

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.log("create files for Module " + this.modulePath);
    // this._mkDirByPathSync("src/" + this.modulePath);

    this.fs.copyTpl(
      this.templatePath("component.js"),
      this.destinationPath("src/" + this.modulePath + "/index.js"),
      { compName: this.moduleName }
    );
    this.fs.copyTpl(
      this.templatePath("component.test.js"),
      this.destinationPath(
        "src/" + this.modulePath + "/" + this.moduleName + ".test.js"
      ),
      { compName: this.moduleName }
    );
    let format = this.props.useScss ? "scss" : "css";

    this.fs.copyTpl(
      this.templatePath("component.css"),
      this.destinationPath(
        "src/" + this.modulePath + "/" + this.moduleName + "." + format
      ),
      { compName: this.moduleName }
    );
  }

  // install() {
  //   this.installDependencies();
  // }
};
