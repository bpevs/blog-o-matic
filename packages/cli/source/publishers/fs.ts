import { ncp } from "ncp"
import * as path from "path"
import { IConfig } from "../definitions"
import { optimizeImages } from "./helpers/optimizeImages"


export async function fsPublisher(cwd: string, config: IConfig) {
  const input = path.resolve(cwd, "resources")
  const output = config.blog.out

  if (!input) throw new Error("Blog has no resources folder!")
  if (!output) throw new Error("Config requires .blog.out")

  await optimizeImages({ input, output })

  return new Promise(resolve => {
    ncp(
      path.resolve(cwd, "posts"),
      path.resolve(output, "posts"), {}, () => {
      resolve()
    })
  })
}
