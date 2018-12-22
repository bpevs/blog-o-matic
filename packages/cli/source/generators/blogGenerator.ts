import { promisify } from "@civility/utilities"
import * as fs from "fs"
import { createPromptModule } from "inquirer"
import { dump } from "js-yaml"
import { join } from "path"
import { IConfig } from "../definitions"
import * as q from "./questions"


const prompt = createPromptModule()
const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const ignoreText = `.DS_Store
.Spotlight-V100
.Trashes
._*\n
`


export async function blogGenerator() {
  console.log("\n😳😳🤖😳 WELCOME TO BLOG-O-MATIC! 😳😳🤖😳\n")

  const config = await prompt([
    q.blogAuthor,
    q.blogTitle,
    q.blogPublisher,
  ]) as IConfig

  Object.assign(config, { version: "4.0.0" })

  if (config.publisher === "fs") Object.assign(
    config,
    await prompt([ q.blogOut ]),
  )
  if (config.publisher === "scp") Object.assign(
    config,
    await prompt([ q.host, q.port, q.user, q.path ]),
  )

  await mkdir(config.title)

  await Promise.all([
    writeFile(join(config.title, "blog.config.yml"), dump(config)),
    writeFile(join(config.title, ".blogignore"), ignoreText),
    mkdir(join(config.title, "resources")),
    mkdir(join(config.title, "posts")),
  ])

  console.log(`
    Congratulations! 🎉 🎉 🎉
    Blog-o-Matic successfully created your edit folder!
    You can write whatever you want in here!
    (Or if you're lazy like us, you can run \`blog post\`)
  `)
}
