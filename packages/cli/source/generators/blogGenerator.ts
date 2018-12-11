import { promisify } from "@civility/utilities"
import * as fs from "fs"
import { prompt } from "inquirer"
import { join } from "path"
import { configTemplate, ignoreTemplate, privateTemplate } from "../templates"
import { basicQs, scpQs, sshQs } from "./blogQuestions"
const homedir = require("os").homedir()
const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)


export interface IConfig {
  DATE_FORMAT: string
  NAME: string
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
  const privateInfo: IPrivate | null = config.SERVICE === "SCP"
    ? await prompt(scpQs) as IPrivate
    : null

  if (privateInfo && privateInfo.USE_SSH) {
    const LOCATION_PROMPTS = await prompt(sshQs) as { SSH_LOCATION: string }
    privateInfo.SSH_LOCATION = LOCATION_PROMPTS.SSH_LOCATION
  }

  try {
    await Promise.all([
      mkdir(config.NAME),
      mkdir(join(homedir, ".blog-o-matic"), { recursive: true }),
    ])
  } catch (error) {
    if (error.code === "EEXIST") return console.warn("FAILED: A blog already exists here!")
  }

  await Promise.all([
    writeFile(join(config.NAME, "blog.config.yml"), configTemplate(config)),
    writeFile(join(config.NAME, ".blogignore"), ignoreTemplate()),
    mkdir(join(config.NAME, "resources")),
    mkdir(join(config.NAME, "posts")),
  ])

  if (privateInfo) {
    writeFile(join(homedir, ".blog-o-matic", `${config.NAME}.yml`), privateTemplate(privateInfo))
  }

  console.log(`
    Congratulations! 🎉 🎉 🎉
    Blog-o-Matic successfully created your edit folder!
    You can write whatever you want in here!
    (Or if you're lazy like us, you can run \`blog generate post\`)
  `)
}
