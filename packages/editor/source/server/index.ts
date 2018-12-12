/**
 * Dev Server
 * This serves and reacts to the dev build of the blog.
 * It's not really meant for use in production, which is
 * why it's in the editor, rather than express.
 */

import * as express from "express"
import { resolve } from "path"

export function startServer() {
  const PORT = 3000
  const server = express()

  server.use(express.static(resolve(__dirname, "../source/client/build")))
  server.listen(PORT, () => console.log("listening on port", PORT))
}
