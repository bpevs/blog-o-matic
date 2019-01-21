import { classNames as cx, get } from "@civility/utilities"
import * as React from "react"


export type ImageProps = React.ImgHTMLAttributes<any> & {
  context: any,
}

export function Image({ context, ...props }: ImageProps) {
  const root = get(context, [ "root" ])

  const src = ((root || "") + "/" + props.src)

  return <img
    {...props}
    className={ cx("col-12", "image", props.className) }
    src={src}
  />
}
