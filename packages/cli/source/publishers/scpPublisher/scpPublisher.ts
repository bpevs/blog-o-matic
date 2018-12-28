import * as path from "path"
import { IConfig } from "../../definitions"
import { fsPublisher } from "../fsPublisher/fsPublisher"
import { send } from "../helpers/scp"


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
