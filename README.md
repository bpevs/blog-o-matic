[![npm](https://img.shields.io/npm/v/blog-o-matic.svg?maxAge=2592000)](https://www.npmjs.com/package/blog-o-matic)
[![Dependency Status](https://david-dm.org/ivebencrazy/blog-o-matic.svg?style=flat)](https://david-dm.org/ivebencrazy/blog-o-matic)
[![devDependency Status](https://david-dm.org/ivebencrazy/blog-o-matic/dev-status.svg)](https://david-dm.org/ivebencrazy/blog-o-matic#info=devDependencies)


Blog-o-Matic 😳😳🤖😳
============
> Somehow, I'm doing that thing again where I want to make something simple, and end up making a whole infrastructure...

Blog-o-Matic takes blog content and processes it for production use. It is meant to connect your Markdown-editing software to your chosen method of distribution with as little friction as possible.

Essentially, I made this so that I can have a process like this:
1. Write blog post with [Byword](https://www.bywordapp.com/)
2. Have that blog post sync between my devices via [Dropbox](https://www.dropbox.com)
3. Have a 1-step publish process from my computer to [my blog](https://bpev.me)

Blog-o-Matic fills the 3rd step of that process. After I have written my blog post, it takes that as source, optimizes images into multiple sizes for speed and progressive loading, parses markdown into various formats, minifies and compresses where useful, etc.

Blog-o-Matic also has a preview server and editor, so that you can preview it in the form of a website, or consume it locally by however you are using the blog source.

We are also in the process of making `@blog-o-matic/react`, which is a React component library that can make assumptions about content, based on the fact that you're using Blog-o-Matic.


Getting Started
---
- [Blog-o-Matic CLI](./packages/cli)
- [Blog-o-Matic + Github Pages](https://github.com/ivebencrazy/blog-o-matic-fs-example)
- [Blog-o-Matic + S3](./docs/s3.md)


Development
-------
We use [Yarn](https://yarnpkg.com/en/) to handle dependencies:
```sh
npm install -g yarn
yarn install
yarn start
```

Blog-o-Matic should now be linked as a global npm binary:
```sh
blog init
```

Blog-o-Matic is a monorepo, managed via [Lerna](https://lernajs.io/). The main `blog-o-matic` CLI tool export is essentially just an alias of: [@blog-o-matic/cli](./packages/cli). So most work is done in that cli package.

I'm mostly focusing on the cli tool at the moment, but if you want to contribute, let me know what piece of Blog-o-Matic you're interested in, and I can start making issues that are a little more organized that you can tackle.
