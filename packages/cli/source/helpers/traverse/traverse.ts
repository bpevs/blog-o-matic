import { join, normalize } from "path"
import { isFile, readdir } from "../fsWrappers/fsWrappers"


/**
 * Target-agnostic function to recursively parse through a dir, and run
 * passed-in callbacks on the contents.
 * @param sourcePath - Where we copy from
 * @param targetPath - Where we upload to on remote filesystem
 * @param uploadDir - How we upload directories to the remote
 * @param uploadFile - How we upload files to the remote
 */
export async function traverse(
  sourcePath: string,
  targetPath: string,
  uploadFile: (source: string, target: string, rootPath?: string) => Promise<any>,
  rootPath?: string,
) {
  if (await isFile(sourcePath)) return uploadFile(sourcePath, targetPath, rootPath)

  const dirContents = await readdir(sourcePath)

  return Promise.all(dirContents.map((itemName: string) => {
    return traverse(
      normalize(join(sourcePath, itemName)),
      normalize(join(targetPath, itemName)),
      uploadFile,
      rootPath || sourcePath,
    )
  }))
}
