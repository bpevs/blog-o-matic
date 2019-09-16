jest.mock("../fsWrappers/fsWrappers")
import { traverse } from "./traverse"
import { isFile, readdir } from "../fsWrappers/fsWrappers"


const sourcePath = "blog/"
const targetPath = "/"
let uploadFile = jest.fn()


test("Should upload file", async () => {
  await traverse(sourcePath, targetPath, uploadFile)

  expect(uploadFile).toBeCalledTimes(1)
})

test("Should upload nested dir", async () => {
  readdir.mockResolvedValueOnce([ "item1", "item2", "item3" ])
  isFile
    .mockResolvedValueOnce(false)
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(false)


  await traverse(sourcePath, targetPath, uploadFile)

  expect(uploadFile).toBeCalledTimes(5)
  const [ file1, file2, file3, file4, file5 ] = uploadFile.mock.calls
  expect(file1[ 0 ]).toBe("blog/item3")
  expect(file2[ 0 ]).toBe("blog/item1")
  expect(file3[ 0 ]).toBe("blog/item2/file1")
  expect(file4[ 0 ]).toBe("blog/item2/file2")
  expect(file5[ 0 ]).toBe("blog/item2/file3")
})
