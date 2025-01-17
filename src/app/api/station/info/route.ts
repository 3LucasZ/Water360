import { NextRequest, NextResponse } from "next/server";
import commandExists from "command-exists";
import { ipcRenderer } from "electron";
import { getAdbPath } from "@/services/path_helper";

export async function POST(request: NextRequest) {
  const processPath = process.cwd();
  const dirPath = __dirname;
  // var appPath = "empty";
  // const appPath = ipcRenderer.send("appPath");
  var adbPath = getAdbPath(dirPath);
  var env = process.env.NODE_ENV;
  global.stdout = JSON.stringify(
    { processPath, dirPath, adbPath, env, serverPlatform: process.platform },
    null,
    2
  );
  global.stderr = "";
  return NextResponse.json({}, { status: 200 });
}
