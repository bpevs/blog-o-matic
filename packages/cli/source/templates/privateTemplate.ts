import { forEach } from "@civility/utilities"
import { IPrivateConfig } from "../definitions"


export const privateTemplate = (args: IPrivateConfig = {}) => {
  let template = ""

  forEach(args, (item: any, name: string) => {
    if (item != null) template += `${name}: ${item}\n`
  })

  return template
}
