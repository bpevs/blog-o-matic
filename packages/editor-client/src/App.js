import { Blog } from "@blog-o-matic/react"
import "@civility/stylesheets/dist/civility.css"
import "highlight.js/styles/ocean.css"
import React from "react"
import "./App.css"


export default function() {
  return <Blog
    dev
    root="/"
    id={window.location.pathname.substring(1)}
  />
}
