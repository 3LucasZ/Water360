export function getFileName(filePath: string) {
  return filePath.substring(filePath.lastIndexOf("/") + 1);
}
export function getFilePrefix(filePath: string) {
  return getFileName(filePath).split("_")[0];
}
export function getFileSuffix(filePath: string) {
  return filePath.split(".").pop();
}
export function getFileStamp(filePath: string) {
  return (
    getFileName(filePath).split("_")[1] +
    getFileName(filePath).split("_")[2] +
    getFileName(filePath).split("_")[3]
  );
}
