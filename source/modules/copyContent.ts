import * as fs from "fs"
import { Options } from "../definitions"
import { findAll } from "../utilities/findAll"
import { createDir } from "../utilities/fsWrappers"
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

  content.forEach(async (filePath: string) => {
    const fileParentPath = (options.output + filePath).split("/")
    fileParentPath.pop()

    await createDir(fileParentPath.join("/"))
    const input = options.input + filePath
    const output = options.output + filePath
    fs.copyFile(input, output, fs.constants.COPYFILE_FICLONE, (...args) => args)
  })

  log.done("DONE COPY CONTENT")
}
