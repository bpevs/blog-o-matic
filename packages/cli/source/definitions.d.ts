export interface IAwsPublisher {
  bucketName: string
  path: string
}

export interface IScpPublisher {
  host: string
  path: string
  port?: string
  user?: string
}

export interface IConfig {
  author?: string
  created: string
  defaults: IPost
  out: string
  publisher?: string
  publishers: {
    aws?: IAwsPublisher
    scp?: IScpPublisher
  }
  title: string
  updated: string
  version: string
}

export interface IPost {
  author?: string
  created?: string
  permalink?: string
  updated?: string
  tags?: string[]
  title?: string
  [ key: string ]: any
}
