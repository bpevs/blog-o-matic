import { Options } from "../definitions"
import { findAll } from "../utilities/findAll"
import { createDir } from "../utilities/fsWrappers"
import * as log from "../utilities/log"
import { isMetadata } from "../utilities/validators"
import { writeMetaFiles } from "../utilities/writeMetaFiles"

/**
 * Build Content Map
 * - Find each metadata.json. Add its location to ./content.json
 * - Find each root file of metadata.json:
 *  - gallery: look in /raw and get the name of each file to find its name
 *  - article: ignore site will look for README.md
 *  - site: ignore site will look for index.html
 */


export async function buildContentMap(options: Options): Promise<void> {
  console.log(options)
  await createDir(options.output)

  log.start("START CONTENT MAP")

  const content: string[] = await findAll(options.input, isMetadata)
  await writeMetaFiles(options, content)

  log.done("DONE CONTENT MAP")
}
