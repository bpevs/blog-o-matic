import { Only } from "@civility/react"
import { classNames as cx } from "@civility/utilities"
import { highlight } from "highlight.js"
import marksy from "marksy"
import * as React from "react"
import { fetchPost } from "../fetchPost/fetchPost"
import { fetchPosts } from "../fetchPosts/fetchPosts"
import { List } from "../List/List"
import { Media } from "../Media/Media"
import { Posts } from "../Posts/Posts"

// Map markdown entities to React Components
const compile = marksy({
  createElement: React.createElement,
  elements: {
    a: Media,
    img: Media,
    ul: List,
  },

  highlight(language: any, code: any) {
    return highlight(language, code).value
  },
})


export type IBlogProps = React.HTMLAttributes<any> & {
  id?: string,
  list?: any[],
  post?: any,
  root?: string,
  shouldFetch?: boolean,
}

export interface IBlogState {
  list: any[]
  post: any
}

export class Blog extends React.Component<IBlogProps, IBlogState> {
  public state = {
    list: [],
    post: {
      text: null,
    },
  }

  constructor(props: any) {
    super(props)
  }

  public async componentDidMount() {
    const { id, root, shouldFetch = true }: IBlogProps = this.props
    if (shouldFetch && root && id) {
      this.setState({ post: await fetchPost(root, id) })
    } else if (shouldFetch && root) {
      this.setState({ list: await fetchPosts(root) })
    }
  }

  public render() {
    const { className, root, style } = this.props
    const post = this.props.post || this.state.post
    const list = this.props.list || this.state.list || []

    const content = (post && post.text)
      ? compile(post.text, null, { root }).tree
      : null

    return (
      <div style={style} className={cx(className, "mt4 mb4 mx-auto fit-800 article")}>
        <Only if={content}>{content}</Only>
        <Only if={list.length && !content}><Posts posts={list} /></Only>
        <Only if={!content && !list.length}>Loading...</Only>
      </div>
    )
  }
}
