import { Only } from "@civility/react"
import { classNames as cx, decodeHTMLEntities, get } from "@civility/utilities"
import * as React from "react"


export type ImageProps = React.ImgHTMLAttributes<any> & {
  context: any,
  showText?: boolean,
}

export function Image({ context, showText = false, ...props }: ImageProps) {
  const root = get(context, ["root"]) || ""
  const src = root + props.src
  return <React.Fragment>
    <a href={src}>
      <img
        {...props}
        className={cx("col-12", "image", props.className)}
        src={src}
      />
      <Only if={props.alt && showText}>
        <span className="block center col-12 h6">
          {decodeHTMLEntities(props.alt || "")}
        </span>
      </Only>
    </a>
  </React.Fragment>
}
