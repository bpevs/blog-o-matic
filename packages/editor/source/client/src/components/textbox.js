import marksy from "marksy"
import React, { Component, createElement } from "react"


const compile = marksy({ createElement })


export default class MyEditor extends Component {
  constructor(props) {
    super(props)
    this.state = { content: null }
    this.onChange = editorState => this.setState({ editorState })
  }

  componentDidMount() {
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
    return (
      <div
        style={this.props.style}
        className={this.props.className}>
      <div>
        {
          this.state.content
            ? compile(this.state.content, null, {}).tree
            : "No Blog Post Here!"
        }
      </div>
      </div>
    )
  }
}
