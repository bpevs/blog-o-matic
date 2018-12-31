const S3 = require("aws-sdk/clients/s3")
import { IConfig } from "../../definitions"
import { fsPublisher } from "../fsPublisher/fsPublisher"


const s3 = new S3()


export async function awsPublisher(cwd: string, config: IConfig) {
  if (!config.out || !config.publishers.aws) {
    throw new Error("This blog isn't set up for scp publishing")
  }

  await fsPublisher(cwd, config)

  const { bucketName: Bucket, path: key } = config.publishers.aws
  await new S3().createBucket({ Bucket })
  await new S3().putObject({ Bucket, key })

  try {
    s3.listBuckets((err: any, data: any) => { console.log(err, data) })
  } catch (error) {
    console.log(error)
  }
}
