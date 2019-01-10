import { promisify } from "@civility/utilities"
import * as fs from "fs"
import { createPromptModule } from "inquirer"
import { dump } from "js-yaml"
import { join } from "path"
import { IConfig } from "../../definitions"
import * as q from "../questions"


const prompt = createPromptModule()
const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const ignoreText = `build/
.DS_Store
.Spotlight-V100
.Trashes
._*\n
`

const publisherQuestions: { [key: string]: any } = {
  fs: [ q.blogOut ],
  s3: [ q.s3Creds, q.s3Bucket ],
}

export async function blogGenerator() {
  console.log("\n😳😳🤖😳 WELCOME TO BLOG-O-MATIC! 😳😳🤖😳\n")

  const config = await prompt([
    q.blogAuthor,
    q.blogTitle,
    q.blogPublisher,
  ]) as IConfig

  Object.assign(config, { version: "4.0.0" })

  if (config.publisher && publisherQuestions[config.publisher]) {
    Object.assign(config, {
      [config.publisher]: await prompt(publisherQuestions[config.publisher]),
    })
  }

  await mkdir(config.title)

  await Promise.all([
    writeFile(join(config.title, "blog.config.yml"), dump(config)),
    writeFile(join(config.title, ".blogignore"), ignoreText),
    mkdir(join(config.title, "images")),
    mkdir(join(config.title, "posts")),
  ])

  console.log(`
    Congratulations! 🎉 🎉 🎉
    Blog-o-Matic successfully created your edit folder!
    You can write whatever you want in here!
    (Or if you're lazy like us, you can run \`blog post\`)
  `)
}
