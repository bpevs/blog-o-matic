import { promisify } from "@civility/utilities"
import * as fs from "fs"
import { prompt } from "inquirer"
import { load } from "js-yaml"
import { join } from "path"
import { IPost } from "../definitions"
import { postTemplate } from "../templates"
import * as q from "./questions"
const writeFile = promisify(fs.writeFile)
const now = new Date().getTime()


export async function postGenerator() {
  console.log("\n😳😳🤖😳 LET'S MAKE A BLOG POST! 😳😳🤖😳\n")

  const config = load(fs.readFileSync("./blog.config.yml", "utf8")) || {}

  const { author = "", title = "" } = await prompt([
    q.postTitle,
     { ...q.postAuthor, default: config.author || "" },
   ]) as IPost

  const permalink = title
    .replace(",", "")
    .replace(/[^a-zA-Z0-9_.@()-]/g, "-")
    .toLowerCase()

  const filePath = join("posts", `${permalink}.md`)
  const postData = { author, permalink, title, created: now, updated: now }

  await writeFile(filePath, postTemplate(postData))

  console.log(`
    Congratulations! 🎉 🎉 🎉
    You generated a blog post!
  `)
}
