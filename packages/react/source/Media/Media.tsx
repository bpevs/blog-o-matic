import * as React from "react"
import { Image } from "../Image/Image"
import { Video } from "../Video/Video"


const IMAGE = "image"
const LINK = "link"
const VIDEO = "video"
const videoFile = /\.(webm|mp4|ogg|ogv|)$/
const embedVideo = /(vimeo)/


export function Media(props: any) {
  switch (getType(props)) {
    case VIDEO: return <Video {...props} />
    case IMAGE: return <Image {...props} />
    case LINK:
    default:
      return <a {...props} />
  }
}

function getType(props: any) {
  const url = props.src || props.href
  if (embedVideo.test(url) || videoFile.test(url)) return VIDEO
  return props.src ? IMAGE : LINK
}
