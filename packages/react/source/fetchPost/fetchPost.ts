export async function fetchPost(root: string, id: string) {
  const postURL = `${root}posts/${id}/`
  const [ metadata, text ] = await Promise.all([
    (await fetch(`${postURL}index.json`)).json(),
    (await fetch(`${postURL}index.md`)).text(),
  ])

  return { ...metadata, text }
}
