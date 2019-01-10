import { load } from "js-yaml"
const Remarkable = require("remarkable")


export const remarkable = new Remarkable("commonmark", {
  breaks: true,
  html: true,
})


export async function createMarkdownOutput(
  text: string,
): Promise<[ { [key: string]: any } | null, string, string ]> {
  const parsed = /(?:^---\n)([\s\S]*)(?:---\n)(([\s\S])*)/gm.exec(text) || []
  const hasFrontmatter = parsed.length

  const md = (hasFrontmatter ? parsed[2] : text)
    .replace(/\.jpeg/g, ".medium.jpeg")
    .replace(/\.jpg/g, ".medium.jpg")
    .replace(/\.png/g, ".medium.png")
    .replace(/\]\(\.\.\//g, "](../../")

  const html = remarkable.render(md)

  if (!hasFrontmatter) return [ null, md, html ]

  const frontmatter = load(parsed[1])
  return [ frontmatter, md, html ]
}
