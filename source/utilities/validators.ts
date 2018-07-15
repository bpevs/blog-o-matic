export function isImage(itemPath: string): boolean {
  return Boolean(itemPath.match(/.*(jpg|jpeg|png)$/))
}


export function isMetadata(itemPath: string): boolean {
  return itemPath.indexOf("metadata.json") !== -1
}

export function isRawImage(itemPath: string): boolean {
  return Boolean(itemPath.match(/\/images\/.*(\.jpg|\.png)$/))
}
