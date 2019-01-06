import { join, normalize } from "path"
import { isFile, readdir } from "../fsWrappers/fsWrappers"


/**
 * Target-agnostic function to recursively parse through a dir, and upload
 * the contents via passed-in callbacks.
 * @param sourcePath - Where we copy from
 * @param targetPath - Where we upload to on remote filesystem
 * @param uploadDir - How we upload directories to the remote
 * @param uploadFile - How we upload files to the remote
 */
export async function recursivelyUpload(
  sourcePath: string,
  targetPath: string,
  uploadFile: (source: string, target: string) => Promise<any>,
  uploadDir?: (source: string, target: string) => Promise<any>,
) {
  if (await isFile(sourcePath)) return uploadFile(sourcePath, targetPath)

  if (uploadDir) await uploadDir(sourcePath, targetPath)
  const dirContents = await readdir(sourcePath)

  return Promise.all(dirContents.map((itemName: string) => {
    return recursivelyUpload(
      normalize(join(sourcePath, itemName)),
      normalize(join(targetPath, itemName)),
      uploadFile,
      uploadDir,
    )
  }))
}
