export interface IBlog {
  author?: string
  dateFormat?: string
  out?: string
  publisher?: string
  title: string
}

export interface IConfig {
  version: string
  blog: IBlog
}

export interface IPost {
  author?: string
  location?: string
  title?: string
}

export interface IPrivateConfig {
  scp?: {
    host: string
    path: string
    port?: string
    user?: string
    ssh?: boolean | string,
  }
}
