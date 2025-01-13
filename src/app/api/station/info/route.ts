import { NextRequest, NextResponse } from "next/server";
import commandExists from "command-exists";
import { ipcRenderer } from "electron";
import { getAdbPath } from "@/services/mini_helper";

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
