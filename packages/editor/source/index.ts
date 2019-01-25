/**
 * Dev Server
 * This serves and reacts to the dev build of the blog.
 * It's not really meant for use in production, which is
 * why it's in the editor, rather than express.
 */

import { middleware } from "@blog-o-matic/editor-client"
import { promisify } from "@civility/utilities"
import * as express from "express"
import * as fs from "fs"
import { load } from "js-yaml"
import { resolve } from "path"

const opn = require("opn")
const readdir = promisify(fs.readdir)
export const readFile = promisify(fs.readFile)
export const stat = promisify(fs.stat)


export function startServer(previewDir: string) {
  const PORT = 3000
  const server = express()

  server.get("/index.json", async (req, res) => {
    const body = await readdir(resolve(previewDir, "posts"))
    res.charset = "utf-8"
    res.set("Content-Type", "application/json")
    res.send(JSON.stringify(body.map((loc: string) => ({
      permalink: loc.substring(0, loc.length - 3),
    }))))
  })

  server.get("/posts/:name/index.json", async (req, res) => {
    if (!req.params.name) {
      res.statusCode = 404
      return res.send("404: Page not Found")
    }

    const [ metadata ] = await parse(previewDir, req.params.name + ".md")
    res.charset = "utf-8"
    res.set("Content-Type", "application/json")
    res.send(JSON.stringify(metadata))
  })

  server.get("/posts/:name/index.md", async (req, res) => {
    if (!req.params.name) {
      res.statusCode = 404
      return res.send("404: Page not Found")
    }

    const post = await parse(previewDir, req.params.name + ".md")
    res.charset = "utf-8"
    res.set("Content-Type", "text/md")
    res.send(post[1])
  })

  server.use("/blog", express.static(resolve(previewDir, "posts")))
  server.use(express.static(resolve(previewDir)))
  server.get("*", middleware)

  server.listen(PORT, () => {
    console.log("listening on port:", PORT)
    opn(`http://localhost:${PORT}`)
  })
}

async function parse(previewDir: string, name: string) {
  const unparsed = await readFile(resolve(previewDir, "posts", name))
  const parsed = /(?:^---\n)([\s\S]*)(?:---\n)(([\s\S])*)/gm.exec(unparsed) || []
  const hasFrontmatter = parsed.length
  const text = (hasFrontmatter ? parsed[2] : unparsed)
  const metadata = load(parsed[1])
  return [ metadata, text ]
}
