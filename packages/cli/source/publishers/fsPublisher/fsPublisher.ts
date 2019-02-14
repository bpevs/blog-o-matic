import { IConfig } from "../../definitions"
import {
  compile,
  IUploadEntity,
  writeFile,
} from "../../helpers"


/**
 * Publish to a local fs directory. Does a few things:
 * - Create an index file that points to blog posts
 * - Make json, md, and html files to describe each post
 * - Optimize images
 */
export async function fsPublisher(cwd: string, config: IConfig) {
  const filesToUpload = await compile(cwd, config)

  console.log("Writing blog to local filesystem...")

  await Promise.all(
    filesToUpload.map(({ content, path }: IUploadEntity) => {
      return writeFile(path, content)
    }),
  )

  console.log("DONE uploading to fs!!!")
}
