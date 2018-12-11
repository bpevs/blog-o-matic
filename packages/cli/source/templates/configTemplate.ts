export interface IBlogTemplateProps {
  AUTHOR: string
  DATE_FORMAT: string
  SERVICE: string
  TITLE: string
}

export const configTemplate = ({
  AUTHOR,
  DATE_FORMAT,
  SERVICE,
  TITLE,
}: IBlogTemplateProps): string => `version: 4.0.0
blog:
  title: ${TITLE}
  author: ${AUTHOR}
  dateformat: ${DATE_FORMAT}
  service: ${SERVICE}

`
