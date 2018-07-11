import * as fs from "fs";
import * as path from "path";
import { writeJSON } from "../utilities/fsWrappers";
import { isImage } from "../utilities/validators";
import * as log from "./log";


export function writeMetaFiles(
  input: string,
  output: string,
  files: string[],
) {
  const data: any = {
    authors: new Set(),
    metadata: [],
    series: new Set(),
    tags: new Set(),
  };

  files.forEach(itemPath => {
    const localPath = path.join(input, itemPath);
    try {
      writeMetaJSON(
        path.join(input, itemPath),
        path.join(output, itemPath),
        JSON.parse(fs.readFileSync(localPath, "utf8")),
      );
    } catch (error) { console.log(error); }

    const metadata = formatMeta(input, itemPath);

    if (metadata) {
      log.progress(`- ${metadata.title}`);
      data.metadata.push(metadata);
      if (metadata.tags) {
        metadata.tags.forEach(tag => data.tags.add(tag));
      }

      if (metadata.author) {
        data.authors.add(metadata.author);
      }

      if (metadata.series) {
        data.series.add(metadata.series);
      }
    }
  });

  const content = JSON.stringify({
    authors: Array.from(data.authors),
    metadata: data.metadata,
    series: Array.from(data.series),
    tags: Array.from(data.tags),
  }, null, 2);

  writeJSON(
    path.join(output, "content.json"),
    content,
  );
}

function writeMetaJSON(inputPath, outputPath, metadata) {
  if (metadata.contentType !== "gallery") {
    writeJSON(outputPath, JSON.stringify(metadata, null, 2));
  } else {
    fs.readdir(
      path.join(inputPath, "../images"),
      (error, images) => {
        if (!error && images) {
          metadata.content = images.filter(isImage);
        }

        writeJSON(outputPath, JSON.stringify(metadata, null, 2));
      },
    );
  }
}



function formatMeta(contentRoot, metaPath) {
  const localPath = path.join(contentRoot, metaPath);
  const data = JSON.parse(fs.readFileSync(localPath, "utf8"));

  if (data.draft) { return null; }

  return {
    author: data.author,
    contentRoot: path.join("/content", metaPath, ".."),
    contentType: data.contentType,
    createdDate: data.createdDate,
    id: data.id,
    series: data.series,
    tags: data.tags,
    title: data.title,
  };
}
