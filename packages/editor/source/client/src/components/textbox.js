import { Only } from "@civility/react"
import marksy from "marksy"
import React, { Component, createElement } from "react"

const compile = marksy({ createElement })


export default class MyEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: null,
      list: null,
    }
    this.onChange = editorState => this.setState({ editorState })
  }

  async componentDidMount() {
    const path = window.location.pathname
    if (path === "/") {
      const list = await (await fetch("/posts")).json()
      this.setState({ list })
    }

    fetch("/blog" + window.location.pathname + ".md")
      .then(res => res.text())
      .then(md => {
        const stuff = md.split("---")
        stuff.shift()
        stuff.shift()
        this.setState({ content: stuff.join("---") })
      })
      .catch(() => console.log("no post"))
  }

  render() {
    const { className, style } = this.props
    const content = this.state.content
      ? compile(this.state.content, null, {}).tree
      : null

    const list = this.state.list && this.state.list.length
      ? this.state.list.map(item => {
        const name = item.substring(0, item.length - 3)
        return <li><a href={`/${name}`}>{name}</a></li>
      })
      : null

    return (
      <div style={style} className={className}>
        <Only if={content}>{content}</Only>
        <Only if={list && !content}><ul>{list}</ul></Only>
        <Only if={!content && !list}>No Blog Post Here!</Only>
      </div>
    )
  }
}
