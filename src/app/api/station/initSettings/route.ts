import { NextRequest, NextResponse } from "next/server";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

export async function POST(request: NextRequest) {
  if (!global.init) {
    console.log("initializing global variables...");
    //directories
    const appDir = path.join(homedir(), "Water360");
    const downloadsDir = appDir;
    const settingsDir = path.join(appDir, "user_settings");
    global.downloadsDir = downloadsDir;
    global.settingsDir = settingsDir;
    //settings
    if (!existsSync(settingsDir)) {
      mkdirSync(settingsDir, { recursive: true });
    }
    try {
      global.IP = readFileSync(path.join(settingsDir, "/IP.txt")).toString();
    } catch {
      global.IP = "0.0.0.0";
      writeFileSync(path.join(settingsDir, "IP.txt"), global.IP);
    }
    try {
      global.MAC = readFileSync(path.join(settingsDir, "MAC.txt")).toString();
    } catch {
      global.MAC = "c8:63:14:74:1f:96";
      writeFileSync(path.join(settingsDir, "MAC.txt"), global.MAC);
    }
    try {
      global.RTMP = readFileSync(path.join(settingsDir, "RTMP.txt")).toString();
    } catch {
      global.RTMP = "Fake-RTMP-KeyT-oRep-lace";
      writeFileSync(path.join(settingsDir, "RTMP.txt"), global.RTMP);
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
