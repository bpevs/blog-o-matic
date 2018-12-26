const path = require("path")
const fs = require("fs")

module.exports = {
  middleware: function middleware(req, res) {
    const public = path.join(__dirname, "public", req.url)
    const build = path.join(__dirname, "build", req.url)
    const index = path.join(__dirname, "build", "index.html")

    if (req.url === "/") res.sendFile(index)
    else if (fs.existsSync(public)) res.sendFile(public)
    else if (fs.existsSync(build)) res.sendFile(build)
    else res.sendFile(index)
  },
}
