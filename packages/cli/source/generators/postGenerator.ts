import { get, promisify } from "@civility/utilities"
import * as fs from "fs"
import { prompt } from "inquirer"
import { safeLoad } from "js-yaml"
import { join } from "path"
import { IPost } from "../definitions"
import { postTemplate } from "../templates"
const writeFile = promisify(fs.writeFile)


export async function postGenerator() {
  console.log("\n😳😳🤖😳 LET'S MAKE A BLOG POST! 😳😳🤖😳\n")

  const config = safeLoad(fs.readFileSync("./blog.config.yml", "utf8")) || {}

  const questions = [
    {
      default: new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      message: "title:",
      name: "title",
      type: "input",
    },
    {
      default: get(config, [ "blog", "author" ]) || "",
      message: "author:",
      name: "author",
      type: "input",
    },
    {
      default: get(config, [ "blog", "location" ]) || "",
      message: "location:",
      name: "location",
      type: "input",
    },
  ]

  const { author = "", location = "", title = "" } = await prompt(questions) as IPost
  const filename = title.replace(",", "").replace(/[^a-zA-Z0-9_.@()-]/g, "-").toLowerCase()
  await writeFile(join("posts", `${filename}.md`), postTemplate({
    author, location, title,
    CREATED: new Date().getTime(),
    UPDATED: new Date().getTime(),
  }))

  console.log(`
    Congratulations! 🎉 🎉 🎉
    You generated a blog post!
  `)
}
