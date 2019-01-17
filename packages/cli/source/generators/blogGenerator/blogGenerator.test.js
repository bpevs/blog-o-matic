jest.mock("fs")
jest.mock("inquirer")

import { mkdir, writeFile } from "fs"
import { blogGenerator } from "./blogGenerator"
import { load } from "js-yaml"


beforeAll(() => { console.log = jest.fn() })

test("Should call writeFile", async () => {
  await blogGenerator()
  const [ mkdir1, mkdir2, mkdir3 ] = mkdir.mock.calls
  const [ writeFile1, writeFile2 ] = writeFile.mock.calls


  expect(mkdir1[0]).toBe("my-blog-title")
  expect(mkdir2[0]).toBe("my-blog-title/images")
  expect(mkdir3[0]).toBe("my-blog-title/posts")
  expect(writeFile1[0]).toBe("my-blog-title/blog.config.yml")
  expect(load(writeFile1[1])).toEqual({
    author: "my-author",
    host: "127.0.0.1",
    out: "my-out",
    path: "my-path",
    port: 8080,
    publisher: "my-publisher",
    title: "my-blog-title",
    version: "4.0.0",
  })
  expect(writeFile2[0]).toBe("my-blog-title/.blogignore")
  expect(writeFile2[1]).toBe("build/\n.DS_Store\n.Spotlight-V100\n.Trashes\n._*\n\n")

  expect(console.log).toBeCalledTimes(2)
  const [ welcomeText, finishedText ] = console.log.mock.calls
  expect(welcomeText[0]).toMatchSnapshot()
  expect(finishedText[0]).toMatchSnapshot()
})
