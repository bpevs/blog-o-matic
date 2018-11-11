import { prompt } from "inquirer"

const questions = [
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
    choices: [ "AWS", "SSH", "Manually" ],
    message: "How would you like to publish your blog?",
    name: "SERVICE",
    type: "list",
  },
]

const askQuestions = () => {
  return prompt(questions)
}

askQuestions().then(answers => {
  console.log(answers)
})
