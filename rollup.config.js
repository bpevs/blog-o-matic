import typescript from "rollup-plugin-typescript2"

export default {
  entry: "./source/index.ts",
  output: {
    file: "./dist/index.js",
    format: "iife",
  },
  plugins: [ typescript() ],
}
