Index
----------

The root of blog-o-matic.  This holds the entire application.

Usage
----------

Blog Class
-----------

### Properties

#### remote
This is the repository that blog-o-matic pulls blog posts from. This should be a string, something like the form of: `"https://github.com/Blanket-Warriors/Blog"`

#### name
This is the string name of our repository. We grab it from our remote url. For instance, in the case of `"https://github.com/Blanket-Warriors/Blog"`, our repository's name would be `"Blog"`.

#### branch
This is a string representing the name of the branch that we are pulling from. Something like `"master"` or `"development"`

#### assetsUrl
This is the url that we want to prepend to url's in our posts. For example, if we use `/blog-assets/`, then this will find all of our images that use a `./` path, and replace this with `/blog-assets/[name]`. This lets us continue referencing images with local urls on Github, but serve them correctly from our server.

#### baseDir
This is a string that represents where our repositories are being cloned and contained. This defaults to `public/repos`.

#### repoDir
This is a string representing the repository where our blog is being contained (rather than all of our repositories). This is done by appending our blog's name to our `baseDir`.

#### postsDir
This is where our blog posts are being contained (within our repository). The default is in `[repoDir]/posts`.

### Methods

#### update
This method updates our repository by either cloning or hard resetting. We choose to hard-reset to the origin instead of pulling in order to avoid issues with forced-updates. We then return our new posts object as our state.

#### get
This method returns the current state of our blog in the form of an object.

#### destroy
This runs `rm -rf` on the current blog, completely deleting it from the filesystem.
