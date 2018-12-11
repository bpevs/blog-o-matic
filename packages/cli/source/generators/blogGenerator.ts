import { promisify } from "@civility/utilities"
import * as fs from "fs"
import { createPromptModule } from "inquirer"
import { join } from "path"
import { configTemplate, ignoreTemplate, privateTemplate } from "../templates"
import { basicQs, scpQs, sshQs } from "./blogQuestions"
const prompt = createPromptModule()
const homedir = require("os").homedir()
const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)


export interface IConfig {
  AUTHOR: string
  DATE_FORMAT: string
  TITLE: string
  SERVICE: string
}

export interface IPrivate {
  FILESYSTEM_LOCATION?: string
  PORT?: string
  SERVER_LOCATION?: string
  SSH_LOCATION?: string
  USE_SSH?: boolean
}


export async function blogGenerator() {
  console.log("\n😳😳🤖😳 WELCOME TO BLOG-O-MATIC! 😳😳🤖😳\n")

  const config = await prompt(basicQs) as IConfig
  const privateInfo: IPrivate | null = config.SERVICE === "scp"
    ? await prompt(scpQs) as IPrivate
    : null

  if (privateInfo && privateInfo.USE_SSH) {
    const LOCATION_PROMPTS = await prompt(sshQs) as { SSH_LOCATION: string }
    privateInfo.SSH_LOCATION = LOCATION_PROMPTS.SSH_LOCATION
  }

  try {
    await Promise.all([
      mkdir(config.TITLE),
      mkdir(join(homedir, ".blog-o-matic"), { recursive: true }),
    ])
  } catch (error) {
    if (error.code === "EEXIST") return console.warn("FAILED: A blog already exists here!")
  }

  await Promise.all([
    writeFile(join(config.TITLE, "blog.config.yml"), configTemplate(config)),
    writeFile(join(config.TITLE, ".blogignore"), ignoreTemplate()),
    mkdir(join(config.TITLE, "resources")),
    mkdir(join(config.TITLE, "posts")),
  ])

  if (privateInfo) {
    writeFile(join(homedir, ".blog-o-matic", `${config.TITLE}.yml`), privateTemplate(privateInfo))
  }

  console.log(`
    Congratulations! 🎉 🎉 🎉
    Blog-o-Matic successfully created your edit folder!
    You can write whatever you want in here!
    (Or if you're lazy like us, you can run \`blog post\`)
  `)
}
