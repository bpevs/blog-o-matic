import { classNames as cx, get } from "@civility/utilities"
import * as React from "react"
import { Media } from "../Media/Media"


export type ListProps = React.HTMLAttributes<any>

export function List({ children, ...props }: ListProps) {
  let images = 0
  let lis = 0
  React.Children.forEach(children, (child: any) => {
    if (child && child.type === "li") {
      lis++
      if (get(child, [ "props", "children", "1", "type" ]) === Media) images++
    }
  })

  const isImageList = lis === images
  const className = cx(props.className, isImageList && "image-list")

  return (
    <ul {...props} className={className}>
      {children}
    </ul>
  )
}
