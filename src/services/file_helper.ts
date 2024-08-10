export function getFileName(filePath: string) {
  return filePath.substring(filePath.lastIndexOf("/") + 1);
}
export function getFilePrefix(filePath: string) {
  return getFileName(filePath).substring(0, 3);
}
export function getFileSuffix(filePath: string) {
  return filePath.split(".").pop();
}
export function getFileStamp(filePath: string) {
  return getFileName(filePath).substring(3);
}
