import { argv } from "yargs"
import { blogGenerator, postGenerator } from "./generators"


const [ command ] = argv._

if (command === "init") blogGenerator()
if (command === "post") postGenerator()
