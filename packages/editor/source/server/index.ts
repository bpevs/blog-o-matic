/**
 * Dev Server
 * This serves and reacts to the dev build of the blog.
 * It's not really meant for use in production, which is
 * why it's in the editor, rather than express.
 */

import * as express from "express"
import { resolve } from "path"

export function startServer(previewDir: string) {
  const PORT = 3000
  const server = express()
  server.use("/blog", express.static(resolve(previewDir)))
  server.use(express.static(resolve(__dirname, "../dist/client/build")))
  server.get("*", (req, res) => {
    res.sendFile(resolve(__dirname, "../dist/client/build/index.html"))
  })
  server.listen(PORT, () => console.log("listening on port", PORT))
}
