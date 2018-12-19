import { existsSync, readFileSync } from "fs"
import { safeLoad } from "js-yaml"
import { join, resolve } from "path"
import { argv } from "yargs"
import { blogGenerator, postGenerator } from "./generators"
import { preview } from "./preview"
import { fsPublisher, scpPublisher } from "./publishers"
const homedir = require("os").homedir()


export {
  blogGenerator,
  fsPublisher,
  postGenerator,
  preview,
  scpPublisher,
  start,
}

const helpText = `
Here are a few commands you can use...
  - \`blog init\`: Generate a blog in this directory
  - \`blog post\`: Generate a post in this blog
  - \`blog edit\`: Run a preview server of your blog
  - \`blog publish\`: Publish your changes!
`

function start() {
  const command = argv._[0]

  if (command === "init") return blogGenerator()

  const cwd = process.cwd()
  const configPath = resolve(cwd, "blog.config.yml")
  const notBlog = new Error("This is not a blog! Please go to the dir where blog.config.yml exists.")
  if (!existsSync(configPath)) throw notBlog
  const config = safeLoad(readFileSync(configPath, "utf8")) || {}
  const publisher = config.blog.publisher

  if (command === "post") return postGenerator()
  if (command === "edit") return preview(cwd)
  if (command === "publish" && publisher === "fs") return fsPublisher(cwd, config)

  const privateConfigPath = join(homedir, ".blog-o-matic", `${config.blog.title}.yml`)
  const privateConfig = safeLoad(readFileSync(privateConfigPath, "utf8")) || {}

  if (command === "publish" && publisher === "scp") return scpPublisher(cwd, config, privateConfig)

  console.log("Looks like you could use a little help!")
  console.log(helpText)
}
