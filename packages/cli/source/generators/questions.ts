export const blogAuthor = {
  message: "What is your name?",
  name: "author",
  type: "input",
}

export const blogTitle = {
  default: "my-blog",
  message: "What is the title of this blog?",
  name: "title",
  type: "input",
}

export const blogOut = {
  default: "./build",
  message: "Where would you like build files to be?",
  name: "out",
  type: "input",
}

export const blogPublisher = {
  choices: [ "fs", "s3", "scp" ],
  message: "How would you like to publish your blog?",
  name: "publisher",
  type: "list",
}

export const host = {
  default: "127.0.0.1",
  message: "What is the remote server's hostname?",
  name: "host",
  type: "input",
}

export const path = {
  default: "~/documents/my-blog",
  message: "Where is the location on the remote server?",
  name: "path",
  type: "input",
}

export const port = {
  message: "What is the remote server's port? (optional)",
  name: "port",
  type: "input",
}

export const postTitle = {
  default: new Date().toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  message: "title:",
  name: "title",
  type: "input",
}

export const postAuthor = {
  message: "Who wrote this post?",
  name: "author",
  type: "input",
}

export const s3Bucket = {
  message: "What is the name of your bucket?",
  name: "bucket",
  type: "input",
}

export const s3Creds = {
  default: "~/documents/rootkey.csv",
  message: "Where is your credentials file?",
  name: "creds",
  type: "input",
}

export const user = {
  message: "What is the remote server's user? (optional)",
  name: "path",
  type: "input",
}
