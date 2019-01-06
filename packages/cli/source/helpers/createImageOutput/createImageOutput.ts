const sharp = require("sharp")
sharp.concurrency(2)


const sizes: { [key: string]: { height: number, width: number} } = {
  large: { height: 1000, width: 1000 },
  medium: { height: 600, width: 600 },
  small: { height: 200, width: 200 },
  tiny: { height: 30, width: 30 },
}


/**
 * Create Image Output takes an image path, and returns an array of processed images
 * - large: full optimized image
 * - medium: Suitable for showing as article or gallery image
 * - small: Suitable for thumbnail, icon, etc
 * - tiny: Suitable only for progressive image loader
 * - svg-prog (SOONtm): SVG progressive image loader
 *  - https://jmperezperez.com/svg-placeholders/
 *  - https://github.com/fogleman/primitive
 *  - https://medium.com/front-end-hacking/progressive-image-loading-and-intersectionobserver-d0359b5d90cd
 */
export async function createImageOutput(sourcePath: string): Promise<any> {
  return Promise.all(Object.keys(sizes)
    .map(async (i: string) => sharp(sourcePath)
      .resize(sizes[i].width, sizes[i].height)
      .resize({ fit: "outside" })),
  )
}
