import * as express from "express"
import { resolve } from "path"

const PORT = 3000
const server = express()

server.use(express.static(resolve(__dirname, "../source/client/build")))
server.listen(PORT, () => console.log("listening on port", PORT))
