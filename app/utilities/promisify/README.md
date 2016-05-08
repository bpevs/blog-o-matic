Promisify
-----------
This module is simply to let us use Node.js methods in the style of an ES2015 Promise.

### Usage
```js
import fs from "fs";
const readdir$ = promisify(fs.readdir);

// We can now use our readdir$ method as a promise.
readdir$("mydirectory")
  .then(function(data) {
    return Promise.resolve(data);
  }, function(error) {
    return Promise.reject(error);
  }).then(function(data) {
    console.log(data);
  }).catch(function(error) {
    console.log(error);
  });
```
