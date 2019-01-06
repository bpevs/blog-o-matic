import { advanceTo } from "jest-date-mock"
import { createMarkdownOutput } from "./createMarkdownOutput"
import mockPost from "./__mocks__/mockPost"


test("Should create markdown output", async () => {
  advanceTo(new Date(2018, 5, 27, 0, 0, 0))

  const [ frontmatter, md, html ] = await createMarkdownOutput(mockPost)

  expect(frontmatter).toMatchSnapshot()
  expect(md).toMatchSnapshot()
  expect(html).toMatchSnapshot()
})
