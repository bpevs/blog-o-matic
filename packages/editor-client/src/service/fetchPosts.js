import post from "./__mocks__/post.mock"
import posts from "./__mocks__/posts.mock"
const isDev = process.env.NODE_ENV === "development"

export async function fetchPosts() {
  return isDev
    ? posts
    : (await fetch("/posts")).json()
}

export async function fetchPost(name) {
  return isDev
    ? post[name]
    : (await fetch(`/blog${name}.md`)).text()
}
