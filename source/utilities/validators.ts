export const isImage = itemPath => itemPath.match(/.*(jpg|jpeg|png)$/);
export const isMetadata = itemPath => itemPath.indexOf("metadata.json") !== -1;
export const isRawImage = itemPath => itemPath.match(/\/raw\/.*(\.jpg|\.png)$/);
