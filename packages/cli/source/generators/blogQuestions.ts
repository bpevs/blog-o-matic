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
    default: "username@example.com",
    message: "Where is your server located?",
    name: "remoteLocation",
    type: "input",
  },
  {
    default: "~/documents/my-blog",
    message: "Where is your blog located on the server?",
    name: "remoteFsLocation",
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

