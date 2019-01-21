import { Blog } from "@blog-o-matic/react"
import "highlight.js/styles/ocean.css"
import React from "react"
import "./App.css"


export default function() {
  return (
    <div className="App">
      <Blog
        dev
        root="/"
        id={window.location.pathname.substring(1)}
      />
    </div>
  )
}
