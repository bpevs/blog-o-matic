import * as elements from "@blog-o-matic/react"
import { Only } from "@civility/react"
import marksy from "marksy"
import React, { Component, createElement } from "react"
import { fetchPost, fetchPosts } from "../service/fetchPosts"

const compile = marksy({ createElement, elements })


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
      this.setState({ list: await fetchPosts() })
    } else {
      const post = await fetchPost(path)
      const stuff = post.split("---")
      stuff.shift()
      stuff.shift()
      this.setState({ content: stuff.join("---") })
    }
  }

  render() {
    const { className, style } = this.props
    const content = this.state.content
      ? compile(this.state.content, null, {}).tree
      : null

    const list = (this.state.list || [])
      .map(({ permalink }) => (
        <li key={permalink}>
          <a href={`/${permalink}`}>{permalink}</a>
        </li>
      ))

    return (
      <div style={style} className={className}>
        <Only if={content}>{content}</Only>
        <Only if={list && !content}><ul>{list}</ul></Only>
        <Only if={!content && !list}>No Blog Post Here!</Only>
      </div>
    )
  }
}
