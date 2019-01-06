import { join, relative, resolve } from "path"
import { IConfig } from "../../definitions"
import {
  createDir,
  createImageOutput,
  createMarkdownOutput,
  ignore,
  readFile,
  recursivelyUpload,
  remarkable,
  writeFile,
} from "../../helpers"


/**
 * Publish to a local fs directory. Does a few things:
 * - Create an index file that points to blog posts
 * - Make json, md, and html files to describe each post
 * - Optimize images
 */
export async function fsPublisher(sourceRootPath: string, config: IConfig) {
  const targetPath = resolve(sourceRootPath, config.out)
  if (!sourceRootPath || !targetPath) throw new Error("Incorrect configuration")

  const indexList: string[] = []
  const indexFilePath = join(targetPath, "index.html")
  const test = ignore(await readFile(join(sourceRootPath, ".blogignore"), "utf-8"))

  await recursivelyUpload(sourceRootPath, targetPath, writeFiles)
  return writeFile(indexFilePath, remarkable.render(indexList.join("\n")))


  // For each source file, build the correct files, and write them to target path
  async function writeFiles(sourcePath: string, targetPath: string) {
    const writePath = targetPath.substring(0, targetPath.lastIndexOf("/"))
    const extension = sourcePath.substring(sourcePath.lastIndexOf(".") + 1, sourcePath.length)
    const name = sourcePath.substring(sourcePath.lastIndexOf("/") + 1, sourcePath.lastIndexOf("."))

    if (!test(relative(sourceRootPath, sourcePath))) return

    switch (extension) {
      case "md":
        const unparsedText = await readFile(sourcePath, "utf-8")
        const [ frontmatter, md, html ] = await createMarkdownOutput(unparsedText)
        indexList.push(`- [${frontmatter.title}](${join("posts", frontmatter.permalink)})`)

        return Promise.all([
          writeFile(join(writePath, name, "index.json"), JSON.stringify(frontmatter)),
          writeFile(join(writePath, name, "index.md"), md),
          writeFile(join(writePath, name, "index.html"), html),
        ])

      case "jpeg":
      case "jpg":
      case "png":
        const [ large, medium, small, tiny ] = await createImageOutput(sourcePath)

        await createDir(writePath)

        return Promise.all([
          large.toFile(join(writePath, `${name}-large.${extension}`)),
          medium.toFile(join(writePath, `${name}-medium.${extension}`)),
          small.toFile(join(writePath, `${name}-small.${extension}`)),
          tiny.toFile(join(writePath, `${name}-tiny.${extension}`)),
        ])

      case "default":
        const text = await readFile(sourcePath, "utf-8")
        return writeFile(join(writePath, `${name}.${extension}`), text)
    }
  }
}
