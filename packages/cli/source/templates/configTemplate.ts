import { IBlog } from "../definitions"

export const configTemplate = ({
  author,
  dateFormat,
  publisher,
  title,
}: IBlog): string => `version: 4.0.0
blog:
  title: ${title}
  author: ${author}
  dateformat: ${dateFormat}
  publisher: ${publisher}

`
