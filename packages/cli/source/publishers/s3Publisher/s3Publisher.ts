const AWS = require("aws-sdk")
import { IConfig } from "../../definitions"
import { compile, IUploadEntity, readFile } from "../../helpers"


export async function s3Publisher(cwd: string, config: IConfig) {
  if (!config.s3) throw new Error("Incorrect configuration")

  const { isNewContent, checkBucketContents, upload } = new S3(config)

  console.log("Uploading blog to S3...")

  const files = await compile(cwd, config)
  await checkBucketContents() // Check for pre-existing files
  await Promise.all(files.filter(isNewContent).map(upload))

  console.log("DONE uploading to S3!!!")
}

/**
 * Wrapper for S3, using blog config.
 */
class S3 {
  private readonly config: IConfig
  private readonly instance: any
  private existing: string[]

  constructor(config: IConfig) {
    this.instance = new AWS.S3()
    this.config = config
    this.updateCreds()
  }

  public isNewContent = ({ path }: IUploadEntity): boolean => {
    const key = path.replace(/^\//, "")
    return this.existing.indexOf(key) >= 0
  }

  public checkBucketContents = (): Promise<string[]> => {
    return new Promise(resolve => {
      if (!this.config.s3) throw new Error("s3 is not set up")

      this.instance.listObjects({
        Bucket: this.config.s3.bucket,
        Prefix: "images",
      }, (error: any, meta: any) => {
        if (error) throw new Error(error)
        this.existing = meta.Contents.map(({ Key }: any) => Key)
        resolve(this.existing)
      })
    })
  }

  public upload = ({ content, path }: IUploadEntity) => {
    const key = path.replace(/^\//, "")

    return new Promise(resolve => {
      if (!this.config.s3) throw new Error("s3 is not set up")
      return this.instance.putObject({
        ACL: "public-read",
        Body: content,
        Bucket: this.config.s3.bucket,
        Key: key,
      }, (error: any, meta: any) => {
        if (error) console.error(error)
        else resolve(meta)
      })
    })
  }

  private readonly updateCreds = async () => {
    if (!this.config.s3) return

    const csv = await readFile(this.config.s3.creds, "utf-8")
    const [ AWSAccessKeyId, AWSSecretKey ] = csv.split("\n")

    AWS.config.update({
      accessKeyId: AWSAccessKeyId.split("=")[1].trim(),
      secretAccessKey: AWSSecretKey.split("=")[1].trim(),
    })
  }
}
