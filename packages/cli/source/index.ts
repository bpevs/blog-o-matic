import { mkdir, writeFile } from "fs"
import { run } from "./prompter"
import { configTemplate, ignoreTemplate } from "./templates"


run().then(({ config }) => {
  console.log("Generating blog!")
  const home = `./${config.NAME}`

  mkdir(home, () => {
    writeFile(`${home}/blog.config.yml`, configTemplate(config), err => {
      if (err) return console.log(err)
    })

    writeFile(`${home}/.blogignore`, ignoreTemplate(), err => {
      if (err) return console.log(err)
    })

    mkdir(`${home}/posts`, () => { return })
    mkdir(`${home}/resources`, () => { return })
  })
})
