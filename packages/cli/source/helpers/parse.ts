import { load } from "js-yaml"


export function parse(text: string): any {
  const parsed = /(?:^---\n)([\s\S]*)(?:---\n)(([\s\S])*)/gm.exec(text) || []
  const md = parsed[2]

  return {
    frontmatter: load(parsed[1]),
    text: md
      .replace(/\]\(\.\.\/\.\.\/images\//g, "](../images/medium/"),
  }
}
