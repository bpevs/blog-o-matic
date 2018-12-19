import * as path from "path"
import { IConfig, IPrivateConfig } from "../definitions"
import { fsPublisher } from "./fs"
import { send } from "./helpers/scp"


export async function scpPublisher(
  cwd: string,
  config: IConfig,
  privateConfig: IPrivateConfig,
) {
  if (!config.blog.out || !privateConfig || !privateConfig.scp) {
    console.log(config.blog.out, privateConfig)
    throw new Error("This blog isn't set up for scp publishing")
  }

  await fsPublisher(cwd, config)

  send({
    file: path.resolve(config.blog.out || ""),
    host: privateConfig.scp.host,
    path: privateConfig.scp.path,
    port: privateConfig.scp.port,
    user: privateConfig.scp.user,
  })
}
