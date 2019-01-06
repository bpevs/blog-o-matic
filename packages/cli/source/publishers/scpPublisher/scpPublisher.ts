import { promisify } from "@civility/utilities"
import { exec as execModule } from "child_process"
import * as path from "path"
import { IConfig } from "../../definitions"
import { fsPublisher } from "../fsPublisher/fsPublisher"

const exec = promisify(execModule)

export interface ISCPOptions {
  file: string
  host: string
  path: string
  port?: string
  user?: string
}

/** @source https://github.com/ecto/node-scp */
function send({ file, host, path, port, user }: ISCPOptions) {
  const url = (user == null ? "" : user + "@") + host + ":" + path
  const portText = port ? `-P ${port}` : ""
  return exec(`scp -r ${portText} -o "ControlMaster no" ${file} ${url}`)
}

export async function scpPublisher(cwd: string, config: IConfig) {
  if (!config.out || !config.publishers.scp) {
    throw new Error("This blog isn't set up for scp publishing")
  }

  await fsPublisher(cwd, config)

  try {
    const result = await send({
      ...config.publishers.scp,
      file: path.resolve(config.out || ""),
    })
    console.log("Published to: ", result)
  } catch (error) {
    console.log(error)
  }
}
