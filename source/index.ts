import * as path from "path";
import { buildContentMap } from "./modules/buildContentMap";
// import "./modules/optimizeImages";

buildContentMap({
  input: path.resolve(__dirname, "../example"),
  output: path.resolve(__dirname, "../public"),
});
