import { clone, checkout, reset, hasRepo, destroy } from "app/utilities/gitConnect";
import transformer from "app/utilities/transformer";
import path from "path";
import fs from "fs";

function Blog(remote, options = {}) {
  if(!remote) {
    throw new Error("Blog needs a remote repo address");
  }

  this.remote = remote;
  this.name = remote.match(/[^/]+$/)[0];
  this.branch = options.branch || "master";
  this.assetsUrl = options.assetsUrl || "/blog/assets";
  this.baseDir = options.baseDir || path.resolve(__dirname, "../public/repos");
  this.repoDir = options.repoDir || path.resolve(this.baseDir, this.name);
  this.postsDir = options.postsDir || path.resolve(this.repoDir, "posts");
  this._posts = null;
  this._updating = false;
  return this;
}

Blog.prototype.update = function() {
  if(this._updating) { return; }
  this._updating = true;

  return hasRepo(this.name, { cwd: this.baseDir })
    .then(repo => !repo ? clone(this.remote, { cwd: this.baseDir }) : Promise.resolve())
    .then(() => checkout(this.branch, { cwd: this.repoDir }))
    .then(() => reset(this.branch, { cwd: this.repoDir }))
    .then(() => transformer(this.repoDir, this.assetsUrl))
    .then(posts => {
      this._updating = false;
      this._posts = posts;
      return posts;
    });
};

Blog.prototype.get = function(alias) {
  if(alias) {
    return this._posts[alias];
  } else {
    return this._posts;
  }
};

Blog.prototype.destroy = function() {
  return destroy(this.name, { cwd: this.baseDir })
    .then(function() {
      return this.name;
    });
};

module.exports = Blog;
