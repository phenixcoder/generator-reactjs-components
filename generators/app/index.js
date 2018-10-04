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

  _mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : "";
    const baseDir = isRelativeToScript ? __dirname : ".";

    return targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir);
      try {
        fs.mkdirSync(curDir);
      } catch (err) {
        if (err.code === "EEXIST") {
          // curDir already exists!
          return curDir;
        }

        // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
        if (err.code === "ENOENT") {
          // Throw the original parentDir error on curDir `ENOENT` failure.
          throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
        }

        const caughtErr = ["EACCES", "EPERM", "EISDIR"].indexOf(err.code) > -1;
        if (!caughtErr || (caughtErr && targetDir === curDir)) {
          throw err; // Throw if it's just the last created dir.
        }
      }

      return curDir;
    }, initDir);
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

    const prompts = [
      {
        type: "confirm",
        name: "useScss",
        message: "Would you like to use SCSS for styling?",
        default: false
      }
    ];

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
      this.destinationPath("src/" + this.modulePath + "/component.js"),
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
