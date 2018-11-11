Blog-o-Matic Server
===
Serve the blog content from an express server with middleware. Bounce and cache fetch calls to a static file server. Also exports server utils for interacting with local Blog-o-Matic content. Probably not useful unless you want to make a sister editor to Blog-o-Matic. Possibly will move editor specific files to `@blog-o-matic/editor`, depending on architecture


Usage
---
```js
const blog = require("@blog-o-matic/server")

// Not sure what utilities I will export from here,
// but it will be useable via something like this.
router.use("/blog", blog.serve)

// Will also export utilities for @blog-o-matic/editor
// Usually, you will NOT want to put these in their site.
// This assumes the blog is served locally, and will make file edits.
router.use("/", blog.editor)
```
