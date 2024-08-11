import { NextRequest, NextResponse } from "next/server";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";

export async function POST(request: NextRequest) {
  if (!global.init) {
    console.log("initializing global variables...");
    //directories
    const appDir = homedir() + "/Water360";
    const downloadsDir = appDir;
    const settingsDir = appDir + "/user_settings";
    global.downloadsDir = downloadsDir;
    global.settingsDir = settingsDir;
    //settings
    if (!existsSync(settingsDir)) {
      mkdirSync(settingsDir, { recursive: true });
    }
    try {
      global.IP = readFileSync(settingsDir + "/IP.txt").toString();
    } catch {
      global.IP = "0.0.0.0";
      writeFileSync(settingsDir + "/IP.txt", global.IP);
    }
    try {
      global.MAC = readFileSync(settingsDir + "/MAC.txt").toString();
    } catch {
      global.MAC = "c8:63:14:74:1f:96";
      writeFileSync(settingsDir + "/MAC.txt", global.MAC);
    }
    try {
      global.RTMP = readFileSync(settingsDir + "/RTMP.txt").toString();
    } catch {
      global.RTMP = "Fake-RTMP-KeyT-oRep-lace";
      writeFileSync(settingsDir + "/RTMP.txt", global.RTMP);
    }
    //rest
    global.init = true;
    return NextResponse.json(
      { msg: "global variables initialized successfully" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { msg: "global variables already initialized before" },
    { status: 200 }
  );
}
