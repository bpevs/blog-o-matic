import { clone, checkout, reset, hasRepo, destroy } from "app/utilities/gitConnect";
import transformer from "app/utilities/transformer";
import path from "path";
import fs from "fs";

export default function Blog(remote, options = {}) {
  if(!remote) {
    throw new Error("Blog needs a remote repo address");
  }

  this.posts = null;
  this.remote = remote;
  this.name = remote.match(/[^/]+$/)[0];
  this.branch = options.branch || "master";
  this.assetsUrl = options.assetsUrl || "/blog/assets";
  this.baseDir = options.baseDir || path.resolve(__dirname, "../public/repos");
  this.repoDir = options.repoDir || path.resolve(this.baseDir, this.name);
  this.postsDir = options.postsDir || path.resolve(this.repoDir, "posts");
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
      this.posts = posts;
      console.log("UPDATED", this.name);
      return posts;
    });
};

Blog.prototype.get = function(alias) {
  if(alias) {
    return this.posts[alias];
  } else {
    return this.posts;
  }
};

Blog.prototype.destroy = function() {
  return destroy(this.name, { cwd: this.baseDir })
    .then(function() {
      console.log(`The Blog: "${this.name}" was deleted.`);
      return this.name;
    });
};
