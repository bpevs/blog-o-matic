module.exports = function wallaby() {
  return {
    env: {
      runner: "node",
      type: "node",
    },
    files: [
      "tsconfig.json",
      "jestsetup.js",
      "source/**/*.ts",
      "!source/**/*.test.ts",
    ],
    testFramework: "jest",
    tests: [
      "source/**/*.test.js",
    ],
  }
}
