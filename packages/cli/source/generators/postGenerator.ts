import { get, promisify } from "@civility/utilities"
import * as fs from "fs"
import { prompt } from "inquirer"
import { safeLoad } from "js-yaml"
import { join } from "path"
import { postTemplate } from "../templates"
const writeFile = promisify(fs.writeFile)


interface IPost {
  AUTHOR?: string
  LOCATION?: string
  TITLE?: string
}


export async function postGenerator() {
  console.log("\n😳😳🤖😳 LET'S MAKE A BLOG POST! 😳😳🤖😳\n")

  if (!fs.existsSync("./blog.config.yml")) {
    throw new Error("This is not a blog! Please go to the dir where blog.config.yml exists.")
  }

  const config = safeLoad(fs.readFileSync("./blog.config.yml", "utf8")) || {}

  const questions = [
    {
      default: new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      message: "title:",
      name: "TITLE",
      type: "input",
    },
    {
      default: get(config, [ "blog", "author" ]) || "",
      message: "author:",
      name: "AUTHOR",
      type: "input",
    },
    {
      default: get(config, [ "blog", "location" ]) || "",
      message: "location:",
      name: "LOCATION",
      type: "input",
    },
  ]

  const { AUTHOR = "", LOCATION = "", TITLE = "" } = await prompt(questions) as IPost
  const filename = TITLE.replace(",", "").replace(/[^a-zA-Z0-9_.@()-]/g, "-").toLowerCase()
  await writeFile(join("posts", `${filename}.md`), postTemplate({
    AUTHOR, LOCATION, TITLE,
    CREATED: new Date().getTime(),
    UPDATED: new Date().getTime(),
  }))

  console.log(`
    Congratulations! 🎉 🎉 🎉
    You generated a blog post!
  `)
}
