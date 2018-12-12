import React from "react"
import "./App.css"
import Textbox from "./components/textbox"


export default function() {
  return (
    <div className="App">
      <h1>The Blog</h1>
      <Textbox style={{
        border: "1px solid black",
        color: "black",
        height: "100%",
        margin: "20px",
        maxWidth: "1200px",
        padding: "10px 30px 10px 30px",
        width: "95%",
      }} />
    </div>
  )
}
