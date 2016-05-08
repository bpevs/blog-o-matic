import { exec } from "child_process";
import { readdir } from "fs";
import path from "path";
import promisify from "app/utilities/promisify";

const exec$ = promisify(exec);
const readdir$ = promisify(readdir);

export function clone(remote, options) {
  console.log("CLONE", remote);
  return exec$(`git clone ${remote}`, options);
}

export function pull(localBranch, remoteBranch, options) {
  return exec$(`git pull origin ${localBranch}:${remoteBranch}`, options);
}

export function checkout(localBranch, options) {
  console.log("CHECKOUT", localBranch);
  return exec$(`git checkout ${localBranch}`, options);
}

export function reset(remoteBranch, options) {
  console.log("RESET", remoteBranch);
  return exec$(`git fetch origin && git reset --hard origin/${remoteBranch}`, options);
}

export function destroy(branchName, options) {
  console.log("DESTROY", branchName);
  return exec$(`rm -rf ${branchName}`, options);
}

export function hasRepo(name, options) {
  return readdir$(path.join(options.cwd, name))
    .then( repo => {
      const isGitRepo = repo.indexOf(".git") !== -1;
      return isGitRepo ? Promise.resolve(true) : Promise.resolve(false);
    }, () => Promise.resolve(false))
    .catch(error => {
      console.log(error);
    });
}
