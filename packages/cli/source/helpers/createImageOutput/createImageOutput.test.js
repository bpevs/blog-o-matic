jest.mock("sharp")
import { createImageOutput } from "./createImageOutput"
const sharp = require("sharp")


beforeEach(() => jest.clearAllMocks())

test("Should create image output for jpg", async () => {
  const processed = await createImageOutput("./myImage.jpg")
  expect(sharp.sharpInstance.resize).toBeCalledTimes(8)
  expect(processed.length).toBe(4)
  expect(processed[0]).toBe(sharp.sharpInstance)
})
