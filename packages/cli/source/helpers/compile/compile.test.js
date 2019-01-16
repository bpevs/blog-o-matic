jest.mock("remarkable")
jest.mock("../createImageOutput/createImageOutput")
jest.mock("../createMarkdownOutput/createMarkdownOutput")
jest.mock("../fsWrappers/fsWrappers")
jest.mock("../ignore/ignore")
jest.mock("../traverse/traverse")

import { compile } from "./compile"

test.skip("Should return a list of upload entities", () => {})
test.skip("Should transform blog md files", () => {})
test.skip("Should transform image files", () => {})
test.skip("Should relay other files", () => {})
test.skip("Should handle mixed files", () => {})
test.skip("Should skip ignored files", () => {})
