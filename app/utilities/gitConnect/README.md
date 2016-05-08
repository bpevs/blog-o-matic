GitConnect
-----------

GitConnect is how we interact with Git from our javascript.

### Usage
#### Options
All methods accept an options object, and passes them straight into `exec`. It is always the last argument in a method.  This is especially used for `cwd` option, which changes where our git processes are taking place.
```js
const options
clone("https://github.com/blanket-warriors/bloginator", options);
```

#### Methods
##### clone(origin [, options])
Pretty straightforward.  This clones down a repository.
```js
import { clone } from "app/utilities/gitConnect";
clone("https://github.com/blanket-warriors/bloginator");
```

##### pull(localBranch, remoteBranch [, options])
Again, this one is pretty straightforward.  It automatically calls origin, since we don't expect to be adding new remotes in our project. We don't currently use this, instead opting for `reset`. This is to avoid dealing with any sort of merge conflicts due to force-pushing, etc.
```js
import { pull } from "app/utilities/gitConnect";
pull("master", "master");
pull("master", "development");
```

##### checkout(localBranch [, options])
Checks out into the branch passed in
```js
import { checkout } from "app/utilities/gitConnect";
checkout("master");
```

##### reset(remoteBranch [, options])
Does a hard reset to the specified remote branch. This automatically resets from `origin`, since we don't expect to be adding remotes.
```js
import { reset } from "app/utilities/gitConnect";
reset("master");
```

##### destroy(repositoryName [, options])
Destroys the specified repository by name
```js
import { destroy } from "app/utilities/gitConnect";
destroy("bloginator");
```

##### hasRepo(repositoryName [, options])
Determines whether a repo exists within the specified folder, by name.
```js
import { hasRepo } from "app/utilities/gitConnect";
hasRepo("bloginator");
```

