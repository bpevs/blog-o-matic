// Find files that pass a predicate
// Returns a promise with an array of files/directories
import { readdir, stat } from "fs"
import * as path from "path"


function findThings(
  searchPath: string,
  predicate: (...args: any[]) => boolean,
  rootPath: string = searchPath,
  done: (results: any) => void,
): void {

  let results: any[] = []

  readdir(searchPath, (error, items) => {
    if (error) throw error
    if (!items) return

    let pending = items.length
    if (!pending) return done(results)

    items.forEach(item => {
      const itemPath = path.resolve(searchPath, item)
      stat(itemPath, (error, stat) => {
        if (error) throw error

        const relativeItemPath = itemPath.replace(rootPath, "")
        if (predicate(relativeItemPath, stat)) {
          results.push(relativeItemPath)
        }

        if (stat && stat.isDirectory()) {
          findThings(itemPath, predicate, rootPath, res => {
            results = results.concat(res)
            if (!--pending) done(results)
          })
        } else if (!--pending) done(results)
      })
    })
  })
}


export function findAll(rootPath, predicate): Promise<string[]> {
  return new Promise(resolve => {
    findThings(rootPath, predicate, undefined, resolve)
  })
}
