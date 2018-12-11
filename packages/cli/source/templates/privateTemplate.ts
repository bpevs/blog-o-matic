import { forEach } from "@civility/utilities"

export interface IPrivateTemplateProps {
  FILESYSTEM_LOCATION?: string
  PORT?: string
  SERVER_LOCATION?: string
  SSH_LOCATION?: string
  USE_SSH?: boolean
}


export const privateTemplate = (args: IPrivateTemplateProps = {}) => {
  let template = ""

  forEach(args, (item, name) => {
    if (item) template += `${name}: ${item}\n`
  })

  return template
}
