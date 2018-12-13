import { ncp } from "ncp"
import { resolve } from "path"
import { optimizeImages } from "./helpers/optimizeImages"


export async function fsPublisher(output: string) {
  const input = resolve(process.cwd(), "resources")
  await optimizeImages({ input, output })
  ncp(resolve(process.cwd(), "posts"), resolve(output, "posts"), {}, () => {
    console.log("Done.")
  })
}
