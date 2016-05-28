import { clone, checkout, reset, hasRepo, destroy } from "app/utilities/gitConnect";
import transformer from "app/utilities/transformer";
import path from "path";
import fs from "fs";

function Blog(remote, rootDirectory, options = {}) {
  if(!remote) {
    throw new Error("Blog-O-Matic needs a remote repository address so we know where to find the blog");
  }
  if(!rootDirectory) {
    throw new Error("Blog-O-Matic needs a root directory to store all of our repos");
  }

  this.remote = remote;
  this.rootDirectory = rootDirectory;
  this.name = remote.match(/[^/]+$/)[0];
  this.branch = options.branch || "master";
  this.assetsUrl = options.assetsUrl || "/blog/assets";
  this.repoDirectory = options.repoDirectory || path.resolve(this.rootDirectory, this.name);
  this.postsDirectory = options.postsDirectory || path.resolve(this.repoDirectory, "posts");
  this._posts = null;
  this._updating = false;
  return this;
}

Blog.prototype.update = function() {
  if(this._updating) { return; }
  this._updating = true;

  return hasRepo(this.name, { cwd: this.rootDirectory })
    .then(repo => !repo ? clone(this.remote, { cwd: this.rootDirectory }) : Promise.resolve())
    .then(() => checkout(this.branch, { cwd: this.repoDirectory }))
    .then(() => reset(this.branch, { cwd: this.repoDirectory }))
    .then(() => transformer(this.repoDirectory, this.assetsUrl))
    .then(posts => {
      this._updating = false;
      this._posts = posts;
      return Promise.resolve(posts);
    });
};

Blog.prototype.getPost = function(alias) {
  return this._posts[alias];
};

Blog.prototype.get = function() {
  return this._posts;
};

Blog.prototype.destroy = function() {
  return destroy(this.name, { cwd: this.rootDirectory })
    .then(function() {
      return this.name;
    });
};

export default Blog;
