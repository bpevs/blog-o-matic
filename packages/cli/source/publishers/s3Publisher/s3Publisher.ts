const AWS = require("aws-sdk")
import { join, relative } from "path"
import { IConfig, IPost } from "../../definitions"
import { createImageOutput, createMarkdownOutput, ignore, readFile, recursivelyUpload } from "../../helpers"


export async function s3Publisher(cwd: string, config: IConfig) {
  const sourceRootPath = join(cwd, config.in || "")
  const targetPath = config.out || "/"
  if (!sourceRootPath || !config.s3) throw new Error("Incorrect configuration")

  AWS.config.update(credsFromCSV(await readFile(config.s3.creds, "utf-8")))

  const s3 = new AWS.S3()
  const indexList: IPost[] = []
  const test = ignore(await readFile(join(sourceRootPath, ".blogignore"), "utf-8"))
  const existing: string[] = await listExistingS3Entities()

  console.log("Uploading blog to S3...")
  await recursivelyUpload(sourceRootPath, targetPath, writeFiles)
  await uploadToS3(join(targetPath, "index.json"), JSON.stringify(indexList))
  console.log("DONE uploading to S3!!!")

  async function writeFiles(sourcePath: string, targetPath: string) {
    const writePath = targetPath.substring(0, targetPath.lastIndexOf("/"))
    const extension = sourcePath.substring(sourcePath.lastIndexOf(".") + 1, sourcePath.length)
    const name = sourcePath.substring(sourcePath.lastIndexOf("/") + 1, sourcePath.lastIndexOf("."))

    if (!test(relative(sourceRootPath, sourcePath))) return

    switch (extension) {
      case "md":
        const unparsedText = await readFile(sourcePath, "utf-8")
        const [ frontmatter, md, html ] = await createMarkdownOutput(unparsedText)

        if (!frontmatter) return uploadToS3(join(writePath, `${name}.md`), md)

        if (frontmatter.published && !frontmatter.private) indexList.push(frontmatter)

        return Promise.all([
          uploadToS3(join(writePath, frontmatter.permalink, "index.json"), JSON.stringify(frontmatter)),
          uploadToS3(join(writePath, frontmatter.permalink, "index.md"), md),
          uploadToS3(join(writePath, frontmatter.permalink, "index.html"), html),
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

  function listExistingS3Entities(): Promise<string[]> {
    return new Promise(resolve => {
      if (!config.s3) throw new Error("s3 is not set up")

      s3.listObjects({
        Bucket: config.s3.bucket,
        Prefix: "images",
      }, (error: any, meta: any) => {
        if (error) throw new Error(error)
        resolve(meta.Contents.map(({ Key }: any) => Key))
      })
    })
  }

  function uploadToS3(targetPath: string, content: string) {
    const key = targetPath.replace(/^\//, "")

    if (existing.indexOf(key) === -1) {
      return new Promise(resolve => {
        if (!config.s3) throw new Error("s3 is not set up")
        return s3.putObject({
          ACL: "public-read",
          Body: content,
          Bucket: config.s3.bucket,
          Key: key,
        }, (error: any, meta: any) => {
          if (error) console.error(error)
          else resolve(meta)
        })
      })
    }

    return Promise.resolve({})
  }
}


function credsFromCSV(csv: string) {
  const [ AWSAccessKeyId, AWSSecretKey ] = csv.split("\n")

  return {
    accessKeyId: AWSAccessKeyId.split("=")[1].trim(),
    secretAccessKey: AWSSecretKey.split("=")[1].trim(),
  }
}
