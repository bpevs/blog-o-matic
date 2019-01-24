import { isNumber } from "@civility/utilities"
import * as React from "react"


export function Posts({ posts = {}, search = "" }: any) {
  console.log(posts)
  const searchResults = posts
    .filter((post: any) => post && shouldShowPost(search, post))
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
          <span className="h3 link-post-title align-middle">{post.permalink} </span>
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
  if (!post || post.draft) return false

  return !search
    || includes(post.title, search)
    || includes(post.series, search)
    || includes(post.author, search)
    || (post.tags || []).some((tag: string) => includes(tag, search))
}

