import * as path from "path"
import { argv } from "yargs"
import { Options } from "./definitions"
import { buildContentMap } from "./modules/buildContentMap"
import { optimizeImages } from "./modules/optimizeImages"


const options: Options = {
  input: path.resolve(process.cwd(), argv.in || "./content"),
  output: path.resolve(process.cwd(), argv.out || "./public"),
  pretty: argv.pretty || true,
}


export const buildBlog = buildContentMap(options)
  .then(() => optimizeImages(options))
  .then(() => options.output)
