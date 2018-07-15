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

const sharp = require("sharp")
import * as path from "path"
sharp.concurrency(2)

import { findAll } from "../utilities/findAll"
import { createDir } from "../utilities/fsWrappers"
import * as log from "../utilities/log"
import { isRawImage } from "../utilities/validators"


interface ImageMeta {
  height?: number
  width?: number
}

const imageSizes: { [key: string]: ImageMeta } = {
  images: { height: 1000, width: 1000 },
  large: { height: 1000, width: 1000 },
  medium: { height: 600, width: 600 },
  small: { height: 200, width: 200 },
  tiny: { height: 30 },
}


interface ContentOptions {
  input: string
  output: string
}

export async function optimizeImages({ input, output }: ContentOptions) {
  log.start("START IMAGE OPTIMIZATION")

  const images: any[] = await findAll(input, isRawImage)

  const imageResults = await Promise.all(images.map(async (imagePath, index) => {
    const imageName = imagePath.split("/").reverse()[0]
    const readPath = path.join(input, imagePath)
    const writePath = path.join(output, imagePath)

    const resizeImages = await Promise.all(Object.keys(imageSizes)
      .map(async function resizeImage(sizeName: string) {
        const { height, width } = imageSizes[sizeName]

        const imageDirPath = path.join(writePath, `../../${sizeName}`)
        const imagePath = path.join(imageDirPath, imageName)

        await createDir(imageDirPath)

        return sharp(readPath)
          .resize(width, height)
          .min()
          .toFile(imagePath)
      }))

    log.progress(index + 1, images.length)

    return resizeImages
  }))

  log.done("DONE IMAGE OPTIMIZATION")
  return imageResults
}
