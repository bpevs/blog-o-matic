import { load } from "js-yaml"
const Remarkable = require("remarkable")


export const remarkable = new Remarkable("commonmark", {
  breaks: true,
  html: true,
})


export async function createMarkdownOutput(
  text: string,
): Promise<[ { [key: string]: any }, string, string ]> {
  const parsed = /(?:^---\n)([\s\S]*)(?:---\n)(([\s\S])*)/gm.exec(text) || []
  const md = parsed[2]
    .replace(/\.jpeg/g, "-medium.jpeg")
    .replace(/\.jpg/g, "-medium.jpg")
    .replace(/\.png/g, "-medium.png")
    .replace(/\]\(\.\.\//g, "](../../")
  const frontmatter = load(parsed[1])
  const html = remarkable.render(md)

  return [ frontmatter, md, html ]
}
