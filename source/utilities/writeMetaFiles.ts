import * as fs from "fs"
import * as path from "path"
import { Options } from "../definitions"
import { writeJSON } from "../utilities/fsWrappers"
import { isImage } from "../utilities/validators"
import * as log from "./log"


export function writeMetaFiles(
  { input, output, pretty }: Options,
  files: string[],
) {
  const data: any = {
    authors: new Set(),
    metadata: [],
    series: new Set(),
    tags: new Set(),
  }
  const logPretty = pretty === true ? 2 : (pretty || 0)

  files.forEach(itemPath => {
    const inputPath = path.join(input, itemPath)
    const outputPath = path.join(output, itemPath)
    const metadata = JSON.parse(fs.readFileSync(inputPath, "utf8"))

    writeMetaJSON(inputPath, outputPath, metadata, logPretty)
    const listedMeta = formatMeta(itemPath, metadata)

    if (listedMeta) {
      log.progress(`- ${listedMeta.title}`)
      data.metadata.push(listedMeta)

      if (listedMeta.tags) {
        listedMeta.tags.forEach(tag => data.tags.add(tag))
      }

      if (listedMeta.author) {
        data.authors.add(listedMeta.author)
      }

      if (listedMeta.series) {
        data.series.add(listedMeta.series)
      }
    }
  })

  const content = JSON.stringify({
    authors: Array.from(data.authors),
    metadata: data.metadata,
    series: Array.from(data.series),
    tags: Array.from(data.tags),
  }, null, logPretty)

  writeJSON(
    path.join(output, "content.json"),
    content,
  )
}

function writeMetaJSON(inputPath, outputPath, metadata, logPretty) {
  if (metadata.contentType !== "gallery") {
    return writeJSON(outputPath, JSON.stringify(metadata, null, logPretty))
  }

  fs.readdir(
    path.join(inputPath, "../images"),
    (error, images) => {
      if (!error && images) metadata.content = images.filter(isImage)
      writeJSON(outputPath, JSON.stringify(metadata, null, logPretty))
    },
  )
}



function formatMeta(inputPath, data) {
  return {
    author: data.author,
    contentRoot: inputPath,
    contentType: data.contentType,
    createdDate: data.createdDate,
    id: data.id,
    series: data.series,
    tags: data.tags,
    title: data.title,
  }
}
