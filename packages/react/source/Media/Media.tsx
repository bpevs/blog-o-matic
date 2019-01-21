import * as React from "react"
import { Image } from "../Image/Image"
import { Video } from "../Video/Video"


const IMAGE = "image"
const VIDEO = "video"


export function Media(props: any) {
  switch (getType(props.src)) {
    case VIDEO: return <Video {...props} />
    case IMAGE: return <Image {...props} />
    default: return <Image {...props} />
  }
}


function getType(url: string) {
  if (url.indexOf("vimeo") > -1) return VIDEO

  return IMAGE
}
