export interface IS3Publisher {
  creds: string // Location of aws creds
  bucket: string
}

export interface IConfig {
  author?: string
  created: string
  defaults: IPost
  out: string
  publisher?: string
  s3?: IS3Publisher
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
