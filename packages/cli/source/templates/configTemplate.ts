export interface IBlogTemplateProps {
  DATE_FORMAT: string
  NAME: string
  SERVICE: string
}

export const configTemplate = ({
  DATE_FORMAT,
  NAME,
  SERVICE,
}: IBlogTemplateProps): string => `
version: 4.0.0
blog:
  name: ${NAME}
  dateformat: ${DATE_FORMAT}
  service: ${SERVICE}

`
