import * as cli from "./index"


test("Should export public API", () => {
  expect(typeof cli.blogGenerator).toBe("function")
  expect(typeof cli.postGenerator).toBe("function")
  expect(typeof cli.preview).toBe("function")
  expect(typeof cli.fsPublisher).toBe("function")
})
