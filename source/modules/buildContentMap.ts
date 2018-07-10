/**
 * Build Content Maps
 * - Find each metadata.json. Add its location to ./content.json
 * - Find each root file of metadata.json:
 *  - gallery: look in /raw and get the name of each file to find its name
 *  - article: ignore; site will look for README.md
 *  - site: ignore; site will look for index.html
 */
import { readdir, readFileSync, writeFile, writeFileSync } from "fs";
import { join } from "path";

import { createContentJSON } from "../utilities/createContentJSON";
import { findAll } from "../utilities/findAll";
import * as log from "../utilities/log";

const root = join(__dirname, "../");
const contentRoot = join(root, "content");
const isImage = itemPath => itemPath.match(/.*(jpg|jpeg|png)$/);
const isMetadata = itemPath => {
  if (itemPath.indexOf("metadata.json") === -1) {
    return false;
  }

  const fullPath = join(contentRoot, itemPath);
  const data = JSON.parse(readFileSync(fullPath, "utf8"));

  if (data.contentType === "gallery") {
    const imageDir = join(fullPath, "../raw");
    readdir(imageDir, (error, images) => {
      if (error || !images) {
        return;
      }

      data.content = images.filter(isImage);
      writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
    });
  }

  return true;
};

log.start("START CONTENT MAP");

findAll(contentRoot, isMetadata)
  .then(content => new Promise(resolve => writeFile(
    "content.json",
    createContentJSON(contentRoot, content),
    "utf8",
    resolve,
  )))
  .then(() => log.done("DONE CONTENT MAP"));
