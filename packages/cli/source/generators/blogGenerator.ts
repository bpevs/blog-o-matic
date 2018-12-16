import { promisify } from "@civility/utilities"
import * as fs from "fs"
import { createPromptModule } from "inquirer"
import { join } from "path"
import { IBlog, IPrivateConfig } from "../definitions"
import { configTemplate, ignoreTemplate, privateTemplate } from "../templates"
import { basicQs, scpQs, sshQs } from "./blogQuestions"

const prompt = createPromptModule()
const homedir = require("os").homedir()
const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)


export async function blogGenerator() {
  console.log("\n😳😳🤖😳 WELCOME TO BLOG-O-MATIC! 😳😳🤖😳\n")

  const config = await prompt(basicQs) as IBlog
  const privateInfo: IPrivateConfig | null = config.publisher === "scp"
    ? await prompt(scpQs) as IPrivateConfig
    : null

  if (privateInfo && privateInfo.scp && privateInfo.scp.ssh) {
    const { ssh } = await prompt(sshQs) as { ssh: string }
    privateInfo.scp.ssh = ssh
  }

  try {
    await Promise.all([
      mkdir(config.title),
      mkdir(join(homedir, ".blog-o-matic"), { recursive: true }),
    ])
  } catch (error) {
    if (error.code === "EEXIST") return console.warn("FAILED: A blog already exists here!")
  }

  await Promise.all([
    writeFile(join(config.title, "blog.config.yml"), configTemplate(config)),
    writeFile(join(config.title, ".blogignore"), ignoreTemplate()),
    mkdir(join(config.title, "resources")),
    mkdir(join(config.title, "posts")),
  ])

  if (privateInfo) {
    writeFile(join(homedir, ".blog-o-matic", `${config.title}.yml`), privateTemplate(privateInfo))
  }

  console.log(`
    Congratulations! 🎉 🎉 🎉
    Blog-o-Matic successfully created your edit folder!
    You can write whatever you want in here!
    (Or if you're lazy like us, you can run \`blog post\`)
  `)
}
