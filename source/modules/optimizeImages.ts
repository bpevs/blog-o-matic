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

 import * as path from "path";
 import * as sharp from "sharp";
 sharp.concurrency(2);

 import { findAll } from "../utilities/findAll";
 import { createDir } from "../utilities/fsWrappers";
 import * as log from "../utilities/log";
 import { isRawImage } from "../utilities/validators";


 interface ContentOptions {
  input: string;
  output: string;
}


 export async function optimizeImages({ input, output }: ContentOptions) {
  log.start("START IMAGE OPTIMIZATION");

  const images: any[] = await findAll(input, isRawImage);
  const imagePromises = images.map((imagePath, index) => {
    const imageName = imagePath.split("/").reverse()[0];
    const readPath = path.join(input, imagePath);
    const writePath = path.join(output, imagePath);

    const writeLargePath = path.join(writePath, "../../large");
    const writeMediumPath = path.join(writePath, "../../medium");
    const writeSmallPath = path.join(writePath, "../../small");
    const writeTinyPath = path.join(writePath, "../../tiny");

    const writePaths = [ writeLargePath, writeMediumPath, writeSmallPath, writeTinyPath ]
    const createDirPromises = Promise.all(writePaths.map(createDir));

    return createDirPromises
      .then(() => Promise.all([
        sharp(readPath).resize(1000, 1000).min().toFile(path.join(writeLargePath, imageName)),
        sharp(readPath).resize(600, 600).min().toFile(path.join(writeMediumPath, imageName)),
        sharp(readPath).resize(200, 200).min().toFile(path.join(writeSmallPath, imageName)),
        sharp(readPath).resize(30).toFile(path.join(writeTinyPath, imageName)),
      ]))
      .then(() => log.progress(index + 1, images.length));
  });

  const imageResults = await Promise.all(imagePromises);
  log.done("DONE IMAGE OPTIMIZATION");
  return imageResults;
}
