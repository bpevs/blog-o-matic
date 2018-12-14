import { ncp } from "ncp"
import * as path from "path"
import { optimizeImages } from "./helpers/optimizeImages"


export async function fsPublisher(output: string) {
  const input = path.resolve(process.cwd(), "resources")
  await optimizeImages({ input, output })
  return new Promise(resolve => {
    ncp(
      path.resolve(process.cwd(), "posts"),
      path.resolve(output, "posts"), {}, () => {
      resolve()
    })
  })
}
