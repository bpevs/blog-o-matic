export const isFile = jest.fn(() => Promise.resolve(true))
export const readdir = jest.fn(() => Promise.resolve([ "file1", "file2", "file3" ]))
export const stat = jest.fn()
export const writeFile = jest.fn()
