import { prompt } from "inquirer"
import { basicQs, scpQs, sshQs } from "./questions"

interface IRes {
  [key: string]: any
}

export interface IConfig {
  DATE_FORMAT: string
  NAME: string
  SERVICE: string
}

export interface IPrivate {
  FILESYSTEM_LOCATION: string
  PORT: string
  SERVER_LOCATION: string
  SSH_LOCATION?: string
}

export async function run(): Promise<{ config: IConfig, private: IPrivate }> {
  const config = {}
  const privateInfo = {}

  console.log("WELCOME TO BLOG-O-MATIC,")
  console.log("YOUR ONE-STOP-SHOP FOR BLOG CREATION!")

  const { DATE_FORMAT, NAME, SERVICE } = await prompt(basicQs) as IRes
  Object.assign(config, { DATE_FORMAT, NAME, SERVICE })

  if (SERVICE === "SCP") {
    const { FILESYSTEM_LOCATION, PORT, SERVER_LOCATION, USE_SSH } = await prompt(scpQs) as IRes
    Object.assign(privateInfo, { FILESYSTEM_LOCATION, PORT, SERVER_LOCATION })
    if (USE_SSH) Object.assign(privateInfo, await prompt(sshQs) as IRes)
  }

  return {
    config: config as IConfig,
    private: privateInfo as IPrivate,
  }
}
