import { get } from "@civility/utilities"
import * as React from "react"


export type ImageProps = React.ImgHTMLAttributes<any> & {
  context: any,
}

export function Image({ context, ...props }: ImageProps) {
  const post = get(context, [ "post" ])
  if (!post || (context.type !== "blog")) {
    return <img {...props} />
  }

  const src = (post.contentRoot + "/" + props.src)

  return <img
    {...props}
    className={ "col-12 " + (props.className || "") }
    src={src}
  />
}
