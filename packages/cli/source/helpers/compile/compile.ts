import { join, relative } from "path"
import {
  createImageOutput,
  createMarkdownOutput,
  ignore,
  readFile,
  remarkable,
  traverse,
} from ".."
import { IConfig, IPost } from "../../definitions"
import { template as defaultTemplate } from "../createMarkdownOutput/defaultHTMLTemplate"
const ejs = require("ejs")


export interface IUploadEntity {
  content: any,
  path: string,
  type: string,
}

/**
 * Collect local files and prep for upload
 * - Create an index file that points to blog posts
 * - Make json, md, and html files to describe each post
 * - Optimize images
 */
export async function compile(cwd: string, config: IConfig): Promise<IUploadEntity[]> {
  const sourceRootPath = join(cwd, config.in || "")
  const targetPath = config.out || "./build"
  if (!sourceRootPath || !targetPath) throw new Error("Incorrect configuration")

  const indexList: any[] = []
  const filesToUpload: any[] = []

  const test = ignore((await readFile(join(sourceRootPath, ".blogignore"), "utf-8")))

  console.log("Collecting files to upload...")

  let template
  try {
    template = await readFile(join(sourceRootPath, "index.ejs"), "utf-8")
  } catch (error) {
    console.log("Using default template...")
  }

  await traverse(
    sourceRootPath,
    targetPath,
    writeFiles.bind(null, indexList, test, add, template),
  )

  const md: string = indexList
    .map(({ permalink, title }: IPost) => `- [${title}](${permalink})`)
    .join("\n")

  const blog = remarkable.render(md)
  const html = ejs.render(template || defaultTemplate, { blog, frontmatter: null })

  add("md", md, join(targetPath, "index.md"))
  add("html", html, join(targetPath, "index.html"))
  add("json", JSON.stringify(indexList), join(targetPath, "index.json"))

  console.log("Done Collecting Files")
  return filesToUpload

  function add(type: string, content: any, path: string): void {
    filesToUpload.push({ content, path, type })
  }
}

// For each source file, build the correct files, and write them to target path
async function writeFiles(
  indexList: any[],
  test: (arg: string) => boolean,
  add: (...args: any[]) => void,
  template: string,
  sourcePath: string,
  targetPath: string,
  rootPath: string,
) {
  const readPath = relative(rootPath, sourcePath)
  const writePath = targetPath.substring(0, targetPath.lastIndexOf("/"))
  const extension = sourcePath.substring(sourcePath.lastIndexOf(".") + 1, sourcePath.length)
  const name = sourcePath.substring(sourcePath.lastIndexOf("/") + 1, sourcePath.lastIndexOf("."))

  if (!test(readPath)) return

  try {
    switch (extension) {
      case "md":
        const unparsedText = await readFile(sourcePath, "utf-8")
        const [ frontmatter, md, html ] = await createMarkdownOutput(unparsedText, template)

        // Not a blog post
        if (!frontmatter) return add("raw", md, join(writePath, `${name}.${extension}`))

        const jsonString = JSON.stringify(frontmatter)
        const id = frontmatter.id

        indexList.push(frontmatter)

        add("md", md, join(writePath, id, "index.md"))
        add("html", html, join(writePath, id, "index.html"))
        add("json", jsonString, join(writePath, id, "index.json"))
        break

      case "jpeg":
      case "jpg":
      case "png":
        const [ large, medium, small, tiny ] = await createImageOutput(sourcePath)
        add("image", await large.toBuffer(), join(writePath, `${name}.large.${extension}`))
        add("image", await medium.toBuffer(), join(writePath, `${name}.medium.${extension}`))
        add("image", await small.toBuffer(), join(writePath, `${name}.small.${extension}`))
        add("image", await tiny.toBuffer(), join(writePath, `${name}.tiny.${extension}`))
        break

      default:
        const text = await readFile(sourcePath, "utf-8")
        add("raw", text, join(writePath, `${name}.${extension}`))
    }
  } catch (error) {
    console.warn(`Failed to write ${extension} file`, error)
  }
}
