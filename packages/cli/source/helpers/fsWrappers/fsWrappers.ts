import { promisify } from "@civility/utilities"
import * as fs from "fs"
import * as path from "path"


export const readdir = promisify(fs.readdir)
export const readFile = promisify(fs.readFile)
export const stat = promisify(fs.stat)


export function copyFile(
  input: string,
  output: string,
  options = fs.constants.COPYFILE_FICLONE,
): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.copyFile(input, output, options, (error, ...args: any[]) => {
      error ? reject(error) : resolve.apply(null, args)
    })
  })
}

export function createDir(dirPath: string): Promise<string> {
  return new Promise(resolve => {
    fs.open(dirPath, "r", error => {
      if (!error || error.code !== "ENOENT") return resolve()

      fs.mkdir(dirPath, error => {
        if (!error || error.code !== "ENOENT") return resolve()

        createDir(path.dirname(dirPath))
          .then(() => createDir(dirPath))
          .then(resolve, resolve)
      })
    })
  })
}

export async function isFile(path: string): Promise<boolean> {
  try {
    const results = await stat(path)
    return !results.isDirectory()
  } catch (error) {
    return true
  }
}

export function writeFile(path: string, content: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const callback = (error: any) => error ? reject(error) : resolve()

    const dirPath = path.substring(0, path.lastIndexOf("/"))

    createDir(dirPath).then(
      () => fs.writeFile(path, content, "utf8", callback),
      reject,
    )
  })
}
