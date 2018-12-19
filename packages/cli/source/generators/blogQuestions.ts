export const basicQs = [
  {
    message: "What is your name?",
    name: "author",
    type: "input",
  },
  {
    default: "my-blog",
    message: "What is the title of this blog?",
    name: "title",
    type: "input",
  },
  {
    default: "YYYY/MM/DD HH:MM",
    message: "How do you like to write your dates?",
    name: "dateFormat",
    type: "input",
  },
  {
    choices: [ "scp", "fs" ],
    message: "How would you like to publish your blog?",
    name: "publisher",
    type: "list",
  },
]

export const scpQs = [
  {
    default: "example.com",
    message: "Host: ",
    name: "host",
    type: "input",
  },
  {
    default: "",
    message: "Port: ",
    name: "port",
    type: "input",
  },
  {
    default: "",
    message: "User: ",
    name: "user",
    type: "input",
  },
  {
    default: "~/documents/my-blog",
    message: "Path on server:",
    name: "path",
    type: "input",
  },
  {
    default: true,
    message: "Will you be using an ssh key for access?",
    name: "ssh",
    type: "confirm",
  },
]

export const sshQs = [
  {
    default: "~/.ssh/id_rsa",
    message: "Where is your private key located?",
    name: "ssh",
    type: "input",
  },
]

