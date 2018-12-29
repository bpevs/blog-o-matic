jest.mock("fs")
jest.mock("inquirer")


import { advanceTo } from "jest-date-mock"
import { postGenerator } from "./postGenerator"
import { writeFile } from "fs"


test("Should call writeFile", async () => {
  advanceTo(new Date(2018, 5, 27, 0, 0, 0))
  await postGenerator()
  const [ writeFile1 ] = writeFile.mock.calls


  expect(writeFile1[0]).toBe("posts/my-blog-title.md")
  expect(writeFile1[1]).toMatchSnapshot()
})
