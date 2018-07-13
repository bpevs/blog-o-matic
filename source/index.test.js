const path = require("path")
const fs = require("fs")


test("Should create content.json", () => {
  return require("./index").buildBlog.then(outputPath => {
    const output = path.join(outputPath, "./content.json")
    const contentJSON = JSON.parse(fs.readFileSync(output, "utf8"))
    expect(contentJSON).toBeTruthy()
  })
})


test("Should create metadata.json", () => {
  return require("./index").buildBlog.then(outputPath => {
    const output = path.join(outputPath, "./posts/coffee/flywheel/metadata.json")
    const contentJSON = JSON.parse(fs.readFileSync(output, "utf8"))
    expect(contentJSON).toMatchSnapshot()
  })
})


test("Should create photos", () => {
  return require("./index").buildBlog.then(outputPath => {
    [
      "large/IMG_0371.jpg",
      "medium/IMG_0371.jpg",
      "small/IMG_0371.jpg",
      "tiny/IMG_0371.jpg"
    ].forEach(image => {
      expect(fs.existsSync(path.join(outputPath, "./galleries/sausilito", image)))
    })
  })
})
