jest.mock("remarkable")
jest.mock("../createImageOutput/createImageOutput")
jest.mock("../createMarkdownOutput/createMarkdownOutput")
jest.mock("../fsWrappers/fsWrappers")
jest.mock("../ignore/ignore")
jest.mock("../traverse/traverse")

import { compile } from "./compile"

beforeAll(() => console.log = jest.fn())


test("Should return a list of upload entities", async () => {
  expect(Array.isArray(await compile("./", {}))).toBe(true)
  expect(console.log).toBeCalledWith("Collecting files to upload...")
  expect(console.log).toBeCalledWith("Done Collecting Files")
})


test.skip("Should transform blog md files", () => {})
test.skip("Should transform image files", () => {})
test.skip("Should relay other files", () => {})
test.skip("Should handle mixed files", () => {})
test.skip("Should skip ignored files", () => {})
