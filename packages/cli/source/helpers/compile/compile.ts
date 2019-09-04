import { load } from "js-yaml"
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
import {
  channelTemplate as defaultChannelRSSTemplate,
} from "../createMarkdownOutput/defaultRSSTemplate"
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

  const blogMeta = load(await readFile("blog.config.yml", "utf8")) || {}
  const test = ignore((await readFile(join(sourceRootPath, ".blogignore"), "utf-8")))

  let htmlTemplate = ""
  let rssTemplate = ""
  try {
    htmlTemplate = await readFile(join(sourceRootPath, "index.ejs"), "utf-8")
  } catch (error) {
    console.log("Using default htmlTemplate...")
  }

  try {
    rssTemplate = await readFile(join(sourceRootPath, "rss.ejs"), "utf-8")
  } catch (error) {
    console.log("Using default rssTemplate...")
  }


  console.log("Collecting files to upload...")

  await traverse(
    sourceRootPath,
    targetPath,
    (sourcePath, targetPath, rootPath) => processFile(sourcePath, targetPath, {
      htmlTemplate, indexList, pushToQueue, rootPath, test,
    }),
  )

  const posts = indexList
    .filter(({ frontmatter }) => frontmatter.published && !frontmatter.private && !frontmatter.unlisted)
    .sort((a, b) => b.frontmatter.created - a.frontmatter.created)

  const postsFrontmatter = posts.map(({ frontmatter }) => frontmatter)
  pushToQueue("json", JSON.stringify(postsFrontmatter), join(targetPath, "index.json"))

  const rssChannel = ejs.render(rssTemplate || defaultChannelRSSTemplate, {
    meta: blogMeta,
    posts: posts
      .filter(post => post.frontmatter)
      .slice(0, 5),
  })
  pushToQueue("rss", rssChannel, join(targetPath, "rss.xml"))

  const tableOfContents: string = postsFrontmatter
    .map(({ permalink, title }: IPost) => `- [${title}](${permalink})`)
    .join("\n")
  const blog = remarkable.render(tableOfContents)
  const html = ejs.render(htmlTemplate || defaultTemplate, { blog, frontmatter: null })
  pushToQueue("html", html, join(targetPath, "index.html"))
  pushToQueue("md", tableOfContents, join(targetPath, "index.md"))

  console.log("Done Collecting Files")

  return filesToUpload

  function pushToQueue(type: string, content: any, path: string): void {
    if (content && content.data) {
      filesToUpload.push({ content: content.data, metadata: content.info, path, type })
    } else {
      filesToUpload.push({ content, path, type })
    }
  }
}

interface ProcessFileOptions {
  rootPath?: string, // Path to base filewrites against
  indexList?: any[],
  test?: (arg: string) => boolean,
  pushToQueue?: (...args: any[]) => void, // Push to the queue of files to write
  htmlTemplate?: string, // Optional htmlTemplate to wrap processed html
  rssTemplate?: string,
}

/**
 * For each post source file, build the correct files, and queue them to write to the target path.
 * This is for a single input file; use it with `traverse` to write
 */
async function processFile(
  sourcePath: string,
  targetPath: string,
  options: ProcessFileOptions,
) {
  const {
    indexList = [],
    htmlTemplate,
    pushToQueue = () => { return },
    rootPath,
    test = () => true,
  } = options
  const readPath = rootPath ? relative(rootPath, sourcePath) : sourcePath
  const writePath = targetPath.substring(0, targetPath.lastIndexOf("/"))
  const extension = sourcePath.substring(sourcePath.lastIndexOf(".") + 1, sourcePath.length)
  const name = sourcePath.substring(sourcePath.lastIndexOf("/") + 1, sourcePath.lastIndexOf("."))

  if (!test(readPath)) return

  try {
    switch (extension) {
      case "md":
        const unparsedText = await readFile(sourcePath, "utf-8")
        const [frontmatter, md, html, htmlBody] = await createMarkdownOutput(unparsedText, htmlTemplate)

        // Not a blog post
        if (!frontmatter) return pushToQueue("raw", md, join(writePath, `${name}.${extension}`))

        const jsonString = JSON.stringify(frontmatter)
        const id = frontmatter.id

        indexList.push({ frontmatter, md, html, htmlBody })

        pushToQueue("md", md, join(writePath, id, "index.md"))
        pushToQueue("html", html, join(writePath, id, "index.html"))
        pushToQueue("json", jsonString, join(writePath, id, "index.json"))
        break

      case "jpeg":
      case "jpg":
      case "png":
        const [large, medium, small, tiny] = await createImageOutput(sourcePath)
        const options = { resolveWithObject: true }
        pushToQueue("image", await large.toBuffer(options), join(writePath, `${name}.large.${extension}`))
        pushToQueue("image", await medium.toBuffer(options), join(writePath, `${name}.medium.${extension}`))
        pushToQueue("image", await small.toBuffer(options), join(writePath, `${name}.small.${extension}`))
        pushToQueue("image", await tiny.toBuffer(options), join(writePath, `${name}.tiny.${extension}`))
        break

      default:
        const text = await readFile(sourcePath, "utf-8")
        pushToQueue("raw", text, join(writePath, `${name}.${extension}`))
    }
  } catch (error) {
    console.warn(`Failed to write ${extension} file`, error)
  }
}
