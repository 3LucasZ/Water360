import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "node:fs";
import path from "node:path";

export async function POST(request: NextRequest) {
  //get data
  const data = await request.json();
  //save settings
  try {
    writeFileSync(path.join(settingsDir, "IP.txt"), data["IP"]);
    global.IP = data["IP"];
    writeFileSync(path.join(settingsDir, "MAC.txt"), data["MAC"]);
    global.MAC = data["MAC"];
    writeFileSync(path.join(settingsDir, "RTMP.txt"), data["RTMP"]);
    global.RTMP = data["RTMP"];
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { err: e.message + " " + e.name + " " + e.cause + " " + e.stack },
        { status: 500 }
      );
    } else {
      return NextResponse.json({ err: "Unkown error!" }, { status: 500 });
    }
  }
  //return
  return NextResponse.json({ msg: "ok" }, { status: 200 });
}
