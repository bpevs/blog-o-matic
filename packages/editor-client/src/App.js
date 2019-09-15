import { Blog } from "@blog-o-matic/react"
import React from "react"

export default function() {
  return <Blog
    dev
    root="/"
    id={window.location.pathname.substring(1)}
  />
}
