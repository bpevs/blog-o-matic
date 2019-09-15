import { DateTime, Only } from "@civility/react"
import { isNumber } from "@civility/utilities"
import * as React from "react"


export function Posts({ posts = {}, search = "" }: any) {
  const searchResults = posts
    .filter((post: any) => post && shouldShowPost(search, post))
    .sort((a: any, b: any) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .reduce((all: any, post: any, currIndex: any, arr: any) => {
      const thisYear = new Date(post.created).getFullYear()
      if (!all.length) return [thisYear, post]

      const lastPost = arr[currIndex - 1]
      if (isNumber(lastPost)) return all.concat(post)

      const lastYear = new Date(lastPost.created).getFullYear()
      return all.concat(lastYear !== thisYear ? [thisYear, post] : [post])
    }, [])
    .map((post: any, index: any) => isNumber(post)
      ? <h2 key={index}>{post}</h2>
      : <Post key={index} post={post} />,
    )

  return <ul className="list-reset">{searchResults}</ul>
}

export function Post({ post }: any) {
  return (
    <li className="p0 m0 link-post">
      <a className="text-decoration-none" href={"/" + post.permalink}>
        <div key={post.permalink} className="p0 m0">
          <Only if={post.created}>
            <DateTime
              className="h4 align-middle o5 p1"
              timestamp={new Date(post.created).getTime()}
              options={{
                day: "numeric",
                month: "numeric",
                weekday: undefined,
                year: undefined,
              }}
            />
          </Only>
          <span className="h3 link-post-title align-middle">{post.title} </span>
        </div>
      </a>
    </li>
  )
}

// Case-insensitive includes
export function includes(parent: string = "", subString: string = ""): boolean {
  return parent.toLowerCase().includes(subString.toLowerCase())
}


// Determines whether a string matches any part of a post
export function shouldShowPost(search: string = "", post: any = {}): boolean {
  if (
    !post ||
    post.draft === true ||
    post.private === true ||
    post.unlisted === true ||
    post.published === false
  ) return false
  if (!post.created) return false

  return !search
    || includes(post.title, search)
    || includes(post.series, search)
    || includes(post.author, search)
    || (post.tags || []).some((tag: string) => includes(tag, search))
}

