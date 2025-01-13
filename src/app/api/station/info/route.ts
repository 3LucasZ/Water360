import { NextRequest, NextResponse } from "next/server";
import commandExists from "command-exists";
import { ipcRenderer } from "electron";
import path from "path";

export function getAdbPath(dirPath: string) {
  var adbPath = dirPath;
  for (let i = 0; i < 100; i++) {
    if (
      path.basename(adbPath) == "Contents" ||
      path.basename(adbPath) == "Water360"
    )
      break;
    adbPath = path.dirname(adbPath);
  }
  adbPath = path.join(adbPath, "platform-tools", "adb");
  return adbPath;
}
export async function POST(request: NextRequest) {
  const processPath = process.cwd();
  const dirPath = __dirname;
  // var appPath = "empty";
  // const appPath = ipcRenderer.send("appPath");
  var adbPath = getAdbPath(dirPath);
  var env = process.env.NODE_ENV;
  return NextResponse.json(
    { processPath, dirPath, adbPath, env },
    { status: 200 }
  );
}
