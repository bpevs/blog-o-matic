import * as fs from "fs"
import * as path from "path"


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

export function writeJSON(path: string, content: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const callback = error => error ? reject(error) : resolve()

    const dirPath = path.split("/")
    dirPath.pop()

    createDir(dirPath.join("/")).then(
      () => fs.writeFile(path, content, "utf8", callback),
      reject,
    )
  })
}
