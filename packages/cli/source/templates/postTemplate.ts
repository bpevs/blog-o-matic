export const postTemplate = ({
  AUTHOR = "",
  LOCATION = "",
  TITLE = "",
  CREATED = "",
  UPDATED = "",
}: any) => `---
title: ${TITLE}
author: ${AUTHOR}
created: ${CREATED}
updated: ${UPDATED}
location: ${LOCATION}
---
# My Blog Post

`
