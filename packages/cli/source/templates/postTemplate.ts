export const postTemplate = ({
  author = "",
  location = "",
  title = "",
  created = "",
  updated = "",
}: any) => `---
title: ${title}
author: ${author}
created: ${created}
updated: ${updated}
location: ${location}
---
# ${title}

`
