/**
 * Optimize Images
 * - raw: raw image
 * - large: full optimized image
 * - medium: Suitable for showing as article or gallery image
 * - small: Suitable for thumbnail, icon, etc
 * - tiny: Suitable only for progressive image loader
 * - svg-prog: SVG progressive image loader
 *  - https://jmperezperez.com/svg-placeholders/
 *  - https://github.com/fogleman/primitive
 *  - https://medium.com/front-end-hacking/progressive-image-loading-and-intersectionobserver-d0359b5d90cd
 */

import * as fs from "fs";
import * as path from "path";
import * as sharp from "sharp";
sharp.concurrency(2);

import { findAll } from "../utilities/findAll";
import { createDir } from "../utilities/fsWrappers";
import * as log from "../utilities/log";
import { isRawImage } from "../utilities/validators";

const root = path.join(__dirname, "../");
const contentRoot = path.join(root, "content");


log.start("START IMAGE OPTIMIZATION");

findAll(contentRoot, isRawImage).then((images: any[]) => images.forEach((imagePath, index) => {
  const imageName = imagePath.split("/").reverse()[0];
  const readPath = path.join(contentRoot, imagePath);

  const writeLargePath = path.join(readPath, "../../large");
  const writeMediumPath = path.join(readPath, "../../medium");
  const writeSmallPath = path.join(readPath, "../../small");
  const writeTinyPath = path.join(readPath, "../../tiny");

  [ writeLargePath, writeMediumPath, writeSmallPath, writeTinyPath ].forEach(createDir);

  Promise.all([
    sharp(readPath).resize(1000, 1000).min().toFile(path.join(writeLargePath, imageName)),
    sharp(readPath).resize(600, 600).min().toFile(path.join(writeMediumPath, imageName)),
    sharp(readPath).resize(200, 200).min().toFile(path.join(writeSmallPath, imageName)),
    sharp(readPath).resize(30).toFile(path.join(writeTinyPath, imageName)),
  ])
  .then(() => {

    log.progress(index + 1, images.length);

    const isDone = (index + 1) === images.length;
    if (isDone) log.done("DONE IMAGE OPTIMIZATION");
  });
}));
