import { ncp } from "ncp"
import { join, resolve } from "path"
import { IConfig } from "../definitions"
import { createDir } from "./helpers/fsWrappers"
import { optimizeImages } from "./helpers/optimizeImages"


export async function fsPublisher(cwd: string, config: IConfig) {
  const output = resolve(cwd, config.out)

  if (!output) throw new Error("Config requires .blog.out")

  const inImages = resolve(cwd, "resources")
  const inPosts = resolve(cwd, "posts")
  const outImages = join(output, "images")
  const outPosts = join(output, "posts")

  await createDir(output)
  await new Promise(done => ncp(inPosts, outPosts, {}, done))

  return optimizeImages({ input: inImages, output: outImages })
}
