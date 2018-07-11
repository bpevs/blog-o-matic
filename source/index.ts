import * as path from "path";
import { buildContentMap } from "./modules/buildContentMap";
import { optimizeImages } from "./modules/optimizeImages";

const options = {
  input: path.resolve(__dirname, "../example"),
  output: path.resolve(__dirname, "../public"),
};

buildContentMap(options).then(() => optimizeImages(options));
