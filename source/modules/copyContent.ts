import { Options } from "../definitions"
import { findAll } from "../utilities/findAll"
import { copyFile, createDir } from "../utilities/fsWrappers"
import * as log from "../utilities/log"
import { isImage, isMetadata } from "../utilities/validators"

/**
 * Build Content Map
 * - Find each metadata.json. Add its location to ./content.json
 * - Find each root file of metadata.json:
 *  - gallery: look in /raw and get the name of each file to find its name
 *  - article: ignore site will look for README.md
 *  - site: ignore site will look for index.html
 */


export async function copyContent(options: Options): Promise<void> {
  await createDir(options.output)

  log.start("START COPY CONTENT")

  const content: string[] = await findAll(options.input, (file: string, stat: any) => {
    const metadata = isMetadata(file)
    const image = isImage(file)
    return !metadata && !image && !stat.isDirectory()
  })

  await Promise.all(content.map(async (filePath: string) => {
    const input = options.input + filePath
    const output = options.output + filePath

    const fileParentPath = output.indexOf("/") === -1
      ? output
      : output.substring(0, output.lastIndexOf("/"))

    await createDir(fileParentPath)
    await copyFile(input, output)

    log.progress("- " + input)
  }))

  log.done("DONE COPY CONTENT")
}
