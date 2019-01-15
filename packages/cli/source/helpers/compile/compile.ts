import { join, relative, resolve } from "path"
import {
  createImageOutput,
  createMarkdownOutput,
  ignore,
  readFile,
  recursivelyUpload,
  remarkable,
  writeFile,
} from ".."
import { IConfig, IPost } from "../../definitions"


/**
 * Collect locals files and prep for upload
 * - Create an index file that points to blog posts
 * - Make json, md, and html files to describe each post
 * - Optimize images
 */
export async function compile(cwd: string, config: IConfig) {
  const sourceRootPath = join(cwd, config.in || "")
  const targetPath = resolve(sourceRootPath, config.out || "./build")
  if (!sourceRootPath || !targetPath) throw new Error("Incorrect configuration")

  const indexList: any[] = []
  const filesToUpload: any[] = []

  const test = ignore(await readFile(join(sourceRootPath, ".blogignore"), "utf-8"))

  console.log("Collecting upload data...")
  await recursivelyUpload(sourceRootPath, targetPath, writeFiles)

  const md: string = indexList
    .map(({ permalink, title }: IPost) => `- [${title}](${permalink})`)
    .join("\n")

  add("md", md, join(targetPath, "index.md"))
  add("html", remarkable.render(md), join(targetPath, "index.html"))
  add("json", JSON.stringify(indexList), join(targetPath, "index.json"))
  console.log("done")


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

        const permalink = join(writePath, frontmatter.permalink)
        indexList.push(frontmatter)
        const json = JSON.stringify(frontmatter)

        add("md", md, join(writePath, permalink, "index.md"))
        add("html", html, join(writePath, permalink, "index.html"))
        add("json", json, join(writePath, permalink, "index.json"))

        return
      } catch (error) {
        console.warn("Failed to write markdown", error)
        return
      }

      case "jpeg":
      case "jpg":
      case "png": try {
        const [ large, medium, small, tiny ] = await createImageOutput(sourcePath)
        add("image", large, join(writePath, `${name}.large.${extension}`))
        add("image", medium, join(writePath, `${name}.medium.${extension}`))
        add("image", small, join(writePath, `${name}.small.${extension}`))
        add("image", tiny, join(writePath, `${name}.tiny.${extension}`))
        return
      } catch (error) {
        console.warn("Failed to write image", error)
        return
      }

      case "default": try {
        const text = await readFile(sourcePath, "utf-8")
        add("raw", text, join(writePath, `${name}.${extension}`))
        return
      } catch (error) {
        console.warn("Failed to write file:", error)
        return
      }
    }
  }

  function add(type: string, content: any, path: string): void {
    filesToUpload.push({ content, path, type })
  }
}

