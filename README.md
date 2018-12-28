[![npm](https://img.shields.io/npm/v/blog-o-matic.svg?maxAge=2592000)](https://www.npmjs.com/package/blog-o-matic)
[![Dependency Status](https://david-dm.org/ivebencrazy/blog-o-matic.svg?style=flat)](https://david-dm.org/ivebencrazy/blog-o-matic)
[![devDependency Status](https://david-dm.org/ivebencrazy/blog-o-matic/dev-status.svg)](https://david-dm.org/ivebencrazy/blog-o-matic#info=devDependencies)


Blog-o-Matic 😳😳🤖😳
============
Somehow, I'm doing that thing again where I want to make something simple, and end up making a whole infrastructure... Blog-o-Matic manages your blog content so you can serve your content with a static file server. Blog-o-Matic is made to solve these problems:

1. **Preview generated `*.md` files with any tool**
With Blog-o-Matic-optimized content, you should be able to view and edit this content in something like [Byword](https://www.bywordapp.com/), or your favorite text editor. You should have the ability to sync the input directory over something like iCloud, Google Drive, or Dropbox to make edits, then publish changes on your computer.

2. **Process content into a standard format for consumption**
Should minify images into multiple sizes for responsive design, transform `md => html | react components`, etc.

3. **Should have its own preview editor**
Should have a simple static server for use during the development process. This will serve the built files that Blog-o-Matic deploys to the static file server, so you can preview it in the form of a website.

4. **Should publish static files**
Blog-o-Matic should be able to build and publish any combination of md, html, and minified resources to a static file server. Should keep track of file creation, and have some basic presets for publishing (scp, AWS, export to file, etc)

More detailed example usage is found in each individual package:
- [CLI Tool](./packages/cli)
- [Blog Editor](./packages/editor)
- [Express Middleware](./packages/express)
- [React Components](./packages/react)


Structure of a Blog
--------

When making a blog, Blog-o-Matic uses the following format:
```
blog.config.yml # Configuration details
.blogignore    # Files that shouldn't be published
+ posts        # Markdown files
  - {posts}.md # Any number of markdown files
+ {static}     # Any number of directories containing static files
```


Examples
--------
- [Example of Blog-o-Matic with Github Pages](https://github.com/ivebencrazy/blog-o-matic-fs-example)

Development
-------
We use [Lerna]() to handle our monorepo, and [Yarn]() to handle dependencies. We can start development utilizing these.

```sh
npm install -g yarn
yarn install
yarn start
```

Blog-o-Matic should now be linked as a global

```sh
blog init
```
