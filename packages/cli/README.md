Blog-o-Matic CLI
================
The Blog-o-Matic CLI tool is for syncing your blog to your computer's filesystem

## API
| Command | Description |
|---|---|
| `blog init` | Generate a blog |
| `blog post` | Generate a blog post |
| `blog preview` | Open a server for blog content |
| `blog publish` | Build blog, and push, depending on blog.config.yml settings |

## Unimplemented
We should have publish settings:
```sh
blog publish ./resources/my-image-1.jpg   # Re-upload a file.
blog publish ./posts/my-post-1.md --force # Upload files related to a post
blog publish --force                      # Re-upload all files
blog publish --fs --s3                    # Publish both via fs and s3
```

We should be able to specify more in args:
```sh
blog init ./my-blog
blog post ./my-post
```

We should be able to convert a non-post markdown file into a post:
```sh
blog post ./myPost.md
```


