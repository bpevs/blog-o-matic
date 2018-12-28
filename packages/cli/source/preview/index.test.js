jest.mock("@blog-o-matic/editor")
import { startServer } from "@blog-o-matic/editor"
import { preview } from "./"

test("Should run startServer", () => {
  const path = "~/myPath"
  preview(path)
  expect(startServer).toBeCalledWith(path)
})

