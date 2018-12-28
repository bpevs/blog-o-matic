import { promisify } from "@civility/utilities"
import * as fs from "fs"
import { join, resolve } from "path"
import { IConfig } from "../../definitions"
import { createDir } from "../helpers/fsWrappers"
import { optimizeImages } from "../helpers/optimizeImages"
import { parse } from "../helpers/parse"
const Remarkable = require("remarkable")

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const remarkable = new Remarkable("commonmark", {
  breaks: true,
  html: true,
})

export async function fsPublisher(cwd: string, config: IConfig) {
  const output = resolve(cwd, config.out)

  if (!output) throw new Error("Config requires .blog.out")

  await createDir(output)
  const filenames = (await readdir(resolve(cwd, "posts")))
    .filter((filename: string) => /\.md$/.test(filename))
    .map((filename: string) => ({
      filename,
      name: filename.replace(".md", ""),
      out: resolve(output, filename.replace(".md", "")),
    }))

  const indexList: string[] = []

  await Promise.all(filenames
    .map(async ({ filename, name, out }: any) => {
      const md = await readFile(resolve(cwd, "posts", filename), "utf-8")
      const { frontmatter, text } = parse(md)

      indexList.push(`- [${frontmatter.title}](${frontmatter.permalink})`)
      await createDir(out)

      return Promise.all([
        writeFile(join(out, "index.md"), text),
        writeFile(join(out, "index.html"), remarkable.render(text)),
        writeFile(join(out, "index.json"), JSON.stringify(frontmatter)),
      ])
    }))

  await writeFile(
    join(output, "./index.html"),
    remarkable.render(indexList.join("\n")),
  )

  return optimizeImages({
    input: resolve(cwd, "resources"),
    output: join(output, "images"),
  })
}
