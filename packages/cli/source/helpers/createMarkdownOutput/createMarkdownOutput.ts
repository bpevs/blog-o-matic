const ejs = require("ejs")
const Remarkable = require("remarkable")
import { load } from "js-yaml"
import { IPost } from "../../definitions"
import { template as defaultTemplate } from "./defaultHTMLTemplate"


export const remarkable = new Remarkable("commonmark", {
  breaks: true,
  html: true,
})


export async function createMarkdownOutput(
  text: string,
  template?: string,
): Promise<[IPost | null, string, string, string]> {
  const parsed = /(?:^---\n)([\s\S]*)(?:---\n)(([\s\S])*)/gm.exec(text) || []
  const hasFrontmatter = parsed.length

  const md = (hasFrontmatter ? parsed[2] : text)
    .replace(/\.jpeg/g, ".large.jpeg")
    .replace(/\.jpg/g, ".large.jpg")
    .replace(/\.png/g, ".large.png")
    .replace(/\]\(\.\.\//g, "](../../")

  const blog = remarkable.render(md)

  if (!hasFrontmatter) {
    const html = ejs.render(template || defaultTemplate, { blog, frontmatter: null })
    return [null, md, html, blog]
  }

  const frontmatter = load(parsed[1])
  const html = ejs.render(template || defaultTemplate, { blog, frontmatter })
  return [frontmatter, md, html, blog]
}
