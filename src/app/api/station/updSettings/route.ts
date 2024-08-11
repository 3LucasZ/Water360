import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "node:fs";

export async function POST(request: NextRequest) {
  //get data
  const data = await request.json();
  //save settings
  try {
    writeFileSync(settingsDir + "/IP.txt", data["IP"]);
    global.IP = data["IP"];
    writeFileSync(settingsDir + "/MAC.txt", data["MAC"]);
    global.MAC = data["MAC"];
    writeFileSync(settingsDir + "/RTMP.txt", data["RTMP"]);
    global.RTMP = data["RTMP"];
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 });
  }
  //return
  return NextResponse.json({ msg: "ok" }, { status: 200 });
}
