import glob from "glob";
import path from "path";
import yaml from "js-yaml";
import Remarkable from "remarkable";
import { readdir, readFile } from "fs";
import promisify from "app/utilities/promisify";

const md = new Remarkable({langPrefix: "language-"});
const readdir$ = promisify(readdir);
const readFile$ = promisify(readFile);
const glob$ = promisify(glob);

function markdownToHtml(fileToSearch, urlPath) {
  // Replaces image ./ with the path of the blog post
  const pathRegex = /(?!\!\[.*\]\()\.\/(?=.*\))/g;
  const newText = fileToSearch.replace(pathRegex, urlPath);
  return md.render(newText);
}

function createPostObj(postDir, postUrlPath){
  return readdir$(postDir)
    .then(function(allFilePaths) {
      const pathObj = allFilePaths
        .map(function fileNameToFilePath(fileName) {
          return path.join(postDir, fileName);
        }).reduce(function addMetaAndPostPaths(pathObj, path) {
          const shouldAddMarkdown = !pathObj.post && /^.*\.(md)$/.test(path);
          if(shouldAddMarkdown) {
            pathObj.post = path;
          }
          const shouldAddMetaData = !pathObj.meta && /^.*\.(yaml)$/.test(path);
          if(shouldAddMetaData) {
            pathObj.meta = path;
          }
          return pathObj;
        }, {});
      return pathObj;
    }).then(function pathObjToPromiseObj(parsedPath) {
      if(parsedPath && parsedPath.meta && parsedPath.post) {
        return Promise.all([
          readFile$(parsedPath.meta, "utf-8"),
          readFile$(parsedPath.post, "utf-8")
        ]);
      }
    }).then(function promiseObjToPostObj([meta, post]) {
      return {
        meta: yaml.safeLoad(meta),
        post: markdownToHtml(post, postUrlPath)
      };
    });
}

export default function readPosts(repoDir, urlPath) {
  const options = {
    realpath: true,
    cwd: repoDir
  };

  return readdir$(repoDir)
    .then(function() {
      return glob$("**/*.yaml", options);
    })
    .then(function(metaDataPaths) {
      const blog = metaDataPaths.map(function pathsToPostObjects(metaDataPath){
        const matchBeforeLastSlash = /^(.*[\\\/])/;
        const postDir = metaDataPath.match(matchBeforeLastSlash)[0];
        const postAlias = metaDataPath.split("/").reverse()[1];
        const postUrlPath = path.join(urlPath || "./", postAlias, "/");
        return createPostObj(postDir, postUrlPath);
      });
      return Promise.all(blog);
    })
    .then(function(postArray) {
      const postObj = postArray.reduce(function(allPosts, nextPost){
        allPosts[nextPost.meta.alias] = nextPost;
        return allPosts;
      }, {});
      return postObj;
    });
}
