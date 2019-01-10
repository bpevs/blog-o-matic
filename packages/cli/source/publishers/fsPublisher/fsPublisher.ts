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
export async function fsPublisher(cwd: string, config: IConfig) {
  const sourceRootPath = join(cwd, config.in || "")
  const targetPath = resolve(sourceRootPath, config.out || "./build")
  if (!sourceRootPath || !targetPath) throw new Error("Incorrect configuration")

  const indexList: string[] = []
  const indexFilePath = join(targetPath, "index.html")
  const test = ignore(await readFile(join(sourceRootPath, ".blogignore"), "utf-8"))

  console.log("Uploading blog...")
  await recursivelyUpload(sourceRootPath, targetPath, writeFiles)
  await writeFile(indexFilePath, remarkable.render(indexList.join("\n")))
  console.log("DONE!!!")


  // For each source file, build the correct files, and write them to target path
  async function writeFiles(sourcePath: string, targetPath: string) {
    const writePath = targetPath.substring(0, targetPath.lastIndexOf("/"))
    const extension = sourcePath.substring(sourcePath.lastIndexOf(".") + 1, sourcePath.length)
    const name = sourcePath.substring(sourcePath.lastIndexOf("/") + 1, sourcePath.lastIndexOf("."))
    if (!test(relative(sourceRootPath, sourcePath))) return

    switch (extension) {
      case "md": try {
        const unparsedText = await readFile(sourcePath, "utf-8")
        const [ frontmatter, md, html ] = await createMarkdownOutput(unparsedText)

        // Not blog post
        if (!frontmatter) return writeFile(join(writePath, `${name}.${extension}`), md)

        indexList.push(`- [${frontmatter.title}](${join("posts", frontmatter.permalink)})`)

        return Promise.all([
          writeFile(join(writePath, name, "index.md"), md),
          writeFile(join(writePath, name, "index.html"), html),
          writeFile(join(writePath, name, "index.json"), JSON.stringify(frontmatter)),
        ])
      } catch (error) {
        console.warn("Failed to write markdown", error)
        return
      }

      case "jpeg":
      case "jpg":
      case "png": try {
        const [ large, medium, small, tiny ] = await createImageOutput(sourcePath)

        await createDir(writePath)

        return Promise.all([
          large.toFile(join(writePath, `${name}.large.${extension}`)),
          medium.toFile(join(writePath, `${name}.medium.${extension}`)),
          small.toFile(join(writePath, `${name}.small.${extension}`)),
          tiny.toFile(join(writePath, `${name}.tiny.${extension}`)),
        ])
      } catch (error) {
        console.warn("Failed to write image", error)
        return
      }

      case "default": try {
        const text = await readFile(sourcePath, "utf-8")
        return writeFile(join(writePath, `${name}.${extension}`), text)
      } catch (error) {
        console.warn("Failed to write file:", error)
        return
      }
    }
  }
}
