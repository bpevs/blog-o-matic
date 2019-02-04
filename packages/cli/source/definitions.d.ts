export interface IS3Publisher {
  creds: string // Location of aws creds
  bucket: string
}

export interface IConfig {
  author?: string
  created: string
  defaults: IPost
  in: string
  out: string
  publisher?: string
  s3?: IS3Publisher
  title: string
  updated: string
  version: string
}

export interface IPost {
  title: string
  id: string
  permalink: string
  author?: string
  created?: string
  updated?: string
  tags?: string[]
  [ key: string ]: any
}
