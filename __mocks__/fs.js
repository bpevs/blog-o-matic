export const mkdir = jest.fn((a, cb) => cb())
export const writeFile = jest.fn((a, b, cb) => cb())
export const existsSync = jest.fn(() => true)
export const readFileSync = jest.fn()
