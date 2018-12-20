/** @source https://github.com/ecto/node-scp */

import { promisify } from "@civility/utilities"
import { exec as execModule } from "child_process"

const exec = promisify(execModule)

export interface ISCPOptions {
  file: string
  host: string
  path: string
  port?: string
  user?: string
}

export function send({ file, host, path, port, user }: ISCPOptions) {
  const url = (user == null ? "" : user + "@") + host + ":" + path
  const portText = port ? `-P ${port}` : ""
  return exec(`scp -r ${portText} -o "ControlMaster no" ${file} ${url}`)
}


export function get({ file, host, path, port = "22", user }: ISCPOptions) {
  const url = (user === undefined ? "" : user + "@") + host + ":" + file
  return exec(`scp -r -P ${port} -o "ControlMaster no" ${url} ${path}`)
}
