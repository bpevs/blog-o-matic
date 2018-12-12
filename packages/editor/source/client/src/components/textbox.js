import { ContentState, Editor, EditorState } from "draft-js"
import "draft-js/dist/Draft.css"
import React, { Component } from "react"


const init = ContentState.createFromText(`
HELLO MY FELLOW CITIZENS.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt\
  ut labore et dolore magna aliqua. Diam in arcu cursus euismod quis viverra nibh. Eget duis\
  at tellus at urna condimentum mattis pellentesque id. Facilisis volutpat est velit egestas.\
  Aliquet nec ullamcorper sit amet risus nullam eget. Interdum posuere lorem ipsum dolor. At\
  augue eget arcu dictum. Molestie a iaculis at erat pellentesque adipiscing. Amet consectetur \
  adipiscing elit ut aliquam. Tristique risus nec feugiat in fermentum posuere.
`)


export default class MyEditor extends Component {
  constructor(props) {
    super(props)
    this.state = { editorState: EditorState.createWithContent(init) }
    this.onChange = editorState => this.setState({ editorState })
  }

  render() {
    return (
      <div
        style={this.props.style}
        className={this.props.className}>
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
        placeholder={init}
        />
      </div>
    )
  }
}
