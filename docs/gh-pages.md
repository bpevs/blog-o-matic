# Blog-o-Matic + Github Pages
This is a guide to setting up a static Github Pages site, built with Blog-o-Matic.

The easiest way to do this is to just clone the [Blog-o-Matic fs example](https://github.com/ivebencrazy/blog-o-matic-fs-example). This will have all of the necessary files to get a blog up-and-running with Github Pages. We'll dive into a little more of the specifics in this post.

To generate a blog for Github pages from scratch, make sure to choose fs as the publisher! We are publishing to our local filesystem (fs), because instead of uploading our code with Blog-o-Matic, we will be uploading our code with Git!
![Build It!](../screenshots/pages-init.png)

To get on-par with the Blog-o-Matic fs-example, we will initialize as a git repo:
```sh
git init
```

We want to make sure to add our build folder to our .gitignore our
