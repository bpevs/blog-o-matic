import { readFileSync } from "fs";
import { join } from "path";
import * as log from "../utilities/log";


export function createContentJSON(contentRoot, results) {
  const data: any = {
    authors: new Set(),
    metadata: [],
    series: new Set(),
    tags: new Set(),
  };

  results.forEach(itemPath => {
    const metadata = formatMeta(contentRoot, itemPath);

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

  return JSON.stringify({
    authors: [ ...data.authors ],
    metadata: data.metadata,
    series: [ ...data.series ],
    tags: [ ...data.tags ],
  }, null, 2);
}

function formatMeta(contentRoot, metaPath) {
  const localPath = join(contentRoot, metaPath);
  const data = JSON.parse(readFileSync(localPath, "utf8"));

  if (data.draft) { return null; }

  return {
    author: data.author,
    contentRoot: join("/content", metaPath, ".."),
    contentType: data.contentType,
    createdDate: data.createdDate,
    id: data.id,
    series: data.series,
    tags: data.tags,
    title: data.title,
  };
}
