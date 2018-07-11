[![npm](https://img.shields.io/npm/v/blog-o-matic.svg?maxAge=2592000)](https://www.npmjs.com/package/blog-o-matic)
[![Build Status](https://travis-ci.org/ivebencrazy/blog-o-matic.svg?branch=master)](https://travis-ci.org/ivebencrazy/blog-o-matic)
[![Dependency Status](https://david-dm.org/ivebencrazy/blog-o-matic.svg?style=flat)](https://david-dm.org/ivebencrazy/blog-o-matic)
[![devDependency Status](https://david-dm.org/ivebencrazy/blog-o-matic/dev-status.svg)](https://david-dm.org/ivebencrazy/blog-o-matic#info=devDependencies)


Blog-o-Matic
============
Manage your blog content so you can serve the static content with a file server


Usage
-----
Expects a particular format for posts; documentation in the near future, but for now, just check out our [example directory](./content).

package.json
```json
{
  ...
  "scripts": {
    "build": "blog-o-matic --in=./my-blog --out=./public/blog"
  }
  ...
}
```
