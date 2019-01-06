jest.mock("../fsWrappers/fsWrappers")
import { recursivelyUpload } from "./recursivelyUpload"
import { isFile, readdir } from "../fsWrappers/fsWrappers"


const sourcePath = "blog/"
const targetPath = "/"
let uploadDir = jest.fn()
let uploadFile = jest.fn()


beforeEach(() => jest.clearAllMocks())


test("Should upload file", async () => {
  await recursivelyUpload(sourcePath, targetPath, uploadFile, uploadDir)

  expect(uploadDir).toBeCalledTimes(0)
  expect(uploadFile).toBeCalledTimes(1)
})

test("Should upload dir of files", async () => {
  isFile.mockResolvedValueOnce(false)

  await recursivelyUpload(sourcePath, targetPath, uploadFile, uploadDir)

  expect(uploadDir).toBeCalledTimes(1)
  expect(uploadDir.mock.calls[0][0]).toBe(sourcePath)
  expect(uploadDir.mock.calls[0][1]).toBe(targetPath)

  expect(uploadFile).toBeCalledTimes(3)
  expect(uploadFile.mock.calls[0][0]).toBe("blog/file1")
  expect(uploadFile.mock.calls[1][0]).toBe("blog/file2")
  expect(uploadFile.mock.calls[2][0]).toBe("blog/file3")
})

test("Should upload nested dir", async () => {
  readdir.mockResolvedValueOnce([ "item1", "item2", "item3" ])
  isFile
    .mockResolvedValueOnce(false)
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(false)


  await recursivelyUpload(sourcePath, targetPath, uploadFile, uploadDir)

  expect(uploadDir).toBeCalledTimes(2)
  const [ dir1, dir2 ] = uploadDir.mock.calls
  expect(dir1[0]).toBe(sourcePath)
  expect(dir1[1]).toBe(targetPath)
  expect(dir2[0]).toBe(sourcePath + "item2")
  expect(dir2[1]).toBe(targetPath + "item2")

  expect(uploadFile).toBeCalledTimes(5)
  const [ file1, file2, file3, file4, file5 ] = uploadFile.mock.calls
  expect(file1[0]).toBe("blog/item1")
  expect(file2[0]).toBe("blog/item3")
  expect(file3[0]).toBe("blog/item2/file1")
  expect(file4[0]).toBe("blog/item2/file2")
  expect(file5[0]).toBe("blog/item2/file3")
})
