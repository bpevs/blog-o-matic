const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const baseDir = path.resolve(__dirname, "..");

/* Inform webpack that our node modules are commonjs
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */
const testFiles = glob.sync("app/**/*Spec.js", { gitignore: true })
  .map(function(module) {
    return path.join(baseDir, module);
  });

/* Test Configuration
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */
var testConfig = Object.assign({}, require("./webpack.base.js"), {
  devtool: "inline-source-map",
  entry: testFiles,
  output: {
    path: path.join(baseDir, "public", "build"),
    publicPath: "/build/",
    filename: "test.js"
  }
});

module.exports = testConfig;
