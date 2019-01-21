import { Only } from "@civility/react"
import { classNames as cx } from "@civility/utilities"
import { highlight } from "highlight.js"
import marksy from "marksy"
import * as React from "react"
import { List } from "../List/List"
import { Media } from "../Media/Media"


// Map markdown entities to React Components
const compile = marksy({
  createElement: React.createElement,
  elements: {
    img: Media,
    ul: List,
  },

  highlight(language: any, code: any) {
    return highlight(language, code).value
  },
})


export interface IBlogProps {
  className?: string
  id?: string
  root: string
  style?: any
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
    const { id, root }: IBlogProps = this.props

    if (id) {
      const postURL = `${root}posts/${id}/`
      const [ metadata, text ] = await Promise.all([
        (await fetch(`${postURL}index.json`)).json(),
        (await fetch(`${postURL}index.md`)).text(),
      ])

      this.setState({ post: { ...metadata, text } })
    } else {
      const list: any[] = await (await fetch(`${root}index.json`)).json()
      this.setState({ list })
    }
  }

  public render() {
    const { className, root, style } = this.props
    const { list = [], post } = this.state

    const content = post.text
      ? compile(post.text, null, { root }).tree
      : null

    const listComponents = list.map(({ permalink }: any) => (
        <li key={permalink}>
          <a href={`/${permalink}`}>{permalink}</a>
        </li>
      ))

    return (
      <div style={style} className={cx(className, "mt4 mb4 mx-auto fit-800 article")}>
        <Only if={content}>{content}</Only>
        <Only if={listComponents && !content}><ul>{listComponents}</ul></Only>
        <Only if={!content && !listComponents}>No Blog Post Here!</Only>
      </div>
    )
  }
}
