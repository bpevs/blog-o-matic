export const prompt = jest.fn(() => Promise.resolve({
  author: "my-author",
  host: "127.0.0.1",
  out: "my-out",
  path: "my-path",
  port: 8080,
  publisher: "my-publisher",
  title: "my-blog-title",
}))

export function createPromptModule() {
  return prompt
}
