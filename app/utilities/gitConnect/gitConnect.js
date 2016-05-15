import { exec } from "child_process";
import { readdir } from "fs";
import path from "path";
import promisify from "app/utilities/promisify";

const exec$ = promisify(exec);
const readdir$ = promisify(readdir);

export function clone(remote, options) {
  return exec$(`git clone ${remote}`, options);
}

export function pull(localBranch, remoteBranch, options) {
  return exec$(`git pull origin ${localBranch}:${remoteBranch}`, options);
}

export function checkout(localBranch, options) {
  return exec$(`git checkout ${localBranch}`, options);
}

export function reset(remoteBranch, options) {
  return exec$(`git fetch origin && git reset --hard origin/${remoteBranch}`, options);
}

export function destroy(branchName, options) {
  return exec$(`rm -rf ${branchName}`, options);
}

export function hasRepo(name, options) {
  return readdir$(path.join(options.cwd, name))
    .then( repo => {
      const isGitRepo = repo.indexOf(".git") !== -1;
      return isGitRepo ? Promise.resolve(true) : Promise.resolve(false);
    }, () => Promise.resolve(false))
    .catch(error => {
      throw new Error(error);
    });
}
