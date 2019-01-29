export async function fetchPosts(root: string): Promise<any[]> {
  return (await fetch(`${root}index.json`)).json()
}
