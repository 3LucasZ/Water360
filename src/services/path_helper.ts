import path from "path";

export function getScrcpyPath(dirPath: string) {
  var ret = getAppPath(dirPath);
  if (
    path.basename(ret) == "water360" // windows production
  ) {
    return path.join(ret, "extra", "scrcpy", "scrcpy.exe");
  } else {
    return path.join(ret, "extra", "scrcpy", "scrcpy");
  }
}
export function getAdbPath(dirPath: string) {
  var ret = getAppPath(dirPath);
  if (
    path.basename(ret) == "water360" // windows production
  ) {
    return path.join(ret, "extra", "platform-tools", "adb.exe");
  } else {
    return path.join(ret, "extra", "platform-tools", "adb");
  }
}
function getAppPath(dirPath: string) {
  var ret = dirPath;
  // prevent infinite looping
  for (let i = 0; i < 100; i++) {
    if (
      path.basename(ret) == "Water360" || // development
      path.basename(ret) == "Contents" || // mac production
      path.basename(ret) == "water360" // windows production
    )
      break;
    ret = path.dirname(ret);
  }
  return ret;
}
