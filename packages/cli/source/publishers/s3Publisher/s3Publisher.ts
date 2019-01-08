const AWS = require("aws-sdk")
import { join, relative } from "path"
import { IConfig } from "../../definitions"
import { createImageOutput, createMarkdownOutput, ignore, readFile, recursivelyUpload } from "../../helpers"


export async function s3Publisher(sourceRootPath: string, config: IConfig) {
  const targetPath = config.out || "/"
  if (!sourceRootPath || !config.s3) throw new Error("Incorrect configuration")

  AWS.config.update(credsFromCSV(await readFile(config.s3.creds, "utf-8")))

  const s3 = new AWS.S3()
  const test = ignore(await readFile(join(sourceRootPath, ".blogignore"), "utf-8"))

  console.log("Uploading blog...")
  await recursivelyUpload(sourceRootPath, targetPath, writeFiles)
  console.log("DONE!!!")

  async function writeFiles(sourcePath: string, targetPath: string) {
    const writePath = targetPath.substring(0, targetPath.lastIndexOf("/"))
    const extension = sourcePath.substring(sourcePath.lastIndexOf(".") + 1, sourcePath.length)
    const name = sourcePath.substring(sourcePath.lastIndexOf("/") + 1, sourcePath.lastIndexOf("."))

    if (!test(relative(sourceRootPath, sourcePath))) return

    switch (extension) {
      case "md":
        const unparsedText = await readFile(sourcePath, "utf-8")
        const [ frontmatter, md, html ] = await createMarkdownOutput(unparsedText)

        return Promise.all([
          uploadToS3(join(writePath, name, "index.json"), JSON.stringify(frontmatter)),
          uploadToS3(join(writePath, name, "index.md"), md),
          uploadToS3(join(writePath, name, "index.html"), html),
        ])

      case "jpeg":
      case "jpg":
      case "png":
        const [ large, medium, small, tiny ] = await createImageOutput(sourcePath)
        const basePath = join(writePath, `${name}.`)
        return Promise.all([
          large.toBuffer().then((c: any) => uploadToS3(basePath + "large." + extension, c)),
          medium.toBuffer().then((c: any) => uploadToS3(basePath + "medium." + extension, c)),
          small.toBuffer().then((c: any) => uploadToS3(basePath + "small." + extension, c)),
          tiny.toBuffer().then((c: any) => uploadToS3(basePath + "tiny." + extension, c)),
        ])

      default:
        const text = await readFile(sourcePath, "utf-8")
        return uploadToS3(join(writePath, `${name}.${extension}`), text)
    }
  }

  function uploadToS3(targetPath: string, content: string) {
    return new Promise(resolve => {
      if (!config.s3) throw new Error("s3 is not set up")

      return s3.putObject({
        ACL: "public-read",
        Body: content,
        Bucket: config.s3.bucket,
        Key: targetPath.replace(/^\//, ""),
      }, (error: any, meta: any) => {
        if (error) console.error(error)
        else resolve(meta)
      })
    })
  }
}


function credsFromCSV(csv: string) {
  const [ AWSAccessKeyId, AWSSecretKey ] = csv.split("\n")

  return {
    accessKeyId: AWSAccessKeyId.split("=")[1].trim(),
    secretAccessKey: AWSSecretKey.split("=")[1].trim(),
  }
}
