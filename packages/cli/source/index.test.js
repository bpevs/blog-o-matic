jest.mock("fs")
jest.mock("js-yaml", () => ({ load: jest.fn(() => ({ publisher: "fs" })) }))
jest.mock("path")
jest.mock("./generators")
jest.mock("./preview")
jest.mock("./publishers")


import * as cli from "./index"
import { blogGenerator, postGenerator } from "./generators"
import { preview } from "./preview"
import { fsPublisher, scpPublisher } from "./publishers"


beforeAll(() => { console.log = jest.fn() })
beforeEach(() => jest.clearAllMocks())


test("Should export public API", () => {
  expect(typeof cli.blogGenerator).toBe("function")
  expect(typeof cli.postGenerator).toBe("function")
  expect(typeof cli.preview).toBe("function")
  expect(typeof cli.fsPublisher).toBe("function")
  expect(typeof cli.scpPublisher).toBe("function")
  expect(typeof cli.start).toBe("function")
})


test("Should log help text on no argument", () => {
  cli.start()
  expect(blogGenerator).toBeCalledTimes(0)
  expect(postGenerator).toBeCalledTimes(0)
  expect(preview).toBeCalledTimes(0)
  expect(fsPublisher).toBeCalledTimes(0)
  expect(scpPublisher).toBeCalledTimes(0)

  expect(console.log).toBeCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchSnapshot()
})

test("Should only run one command at a time", () => {
  cli.start("init")
  cli.start("post")
  cli.start("publish")
  expect(preview).toBeCalledTimes(0)
})

test("Should run blog generator on `blog init`", () => {
  cli.start("init")
  expect(blogGenerator).toBeCalledTimes(1)
})

test("Should run post generator on `blog post`", () => {
  cli.start("post")
  expect(postGenerator).toBeCalledTimes(1)
})

test("Should run preview on `blog preview`", () => {
  cli.start("preview")
  expect(preview).toBeCalledTimes(1)
})

test("Should run fs publisher on `blog publish`", () => {
  cli.start("publish")
  expect(fsPublisher).toBeCalledTimes(1)
})
