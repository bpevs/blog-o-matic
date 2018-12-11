export const basicQs = [
  {
    default: "my-blog",
    message: "What is the name of this blog?",
    name: "NAME",
    type: "input",
  },
  {
    default: "YYYY/MM/DD HH:MM",
    message: "How do you like to write your dates?",
    name: "DATE_FORMAT",
    type: "input",
  },
  {
    choices: [ "SCP", "Copy&Paste" ],
    message: "How would you like to publish your blog?",
    name: "SERVICE",
    type: "list",
  },
]

export const scpQs = [
  {
    default: "username@example.com",
    message: "Where is your server located?",
    name: "SERVER_LOCATION",
    type: "input",
  },
  {
    default: "8080",
    message: "What port should we connect to?",
    name: "PORT",
    type: "input",
  },
  {
    default: "~/documents/my-blog",
    message: "Where is your blog located on the server?",
    name: "FILESYSTEM_LOCATION",
    type: "input",
  },
  {
    default: true,
    message: "Will you be using an ssh key for access?",
    name: "USE_SSH",
    type: "confirm",
  },
]

export const sshQs = [
  {
    default: "~/.ssh/id_rsa",
    message: "Where is your private key located?",
    name: "SSH_LOCATION",
    type: "input",
  },
]

