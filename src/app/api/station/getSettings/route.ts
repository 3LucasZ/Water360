import { NextRequest, NextResponse } from "next/server";
import { getItem, init, setItem } from "node-persist";
import { settingsDir } from "@/services/constants";

export async function POST(request: NextRequest) {
  //get settings
  await init({
    dir: settingsDir,
  });
  var IP = await getItem("IP");
  if (IP == null) {
    IP = "";
    await setItem("IP", IP);
  }
  var MAC = await getItem("MAC");
  if (MAC == null) {
    MAC = "c8:63:14:74:1f:96";
    await setItem("MAC", MAC);
  }
  var downloadsDir = await getItem("downloadsDir");
  if (downloadsDir == null) {
    downloadsDir = "";
    await setItem("downloadsDir", downloadsDir);
  }
  var RTMP = await getItem("RTMP");
  if (RTMP == null) {
    RTMP = "fake-RTMP-keyT-oRep-lace";
    await setItem("RTMP", RTMP);
  }
  //return
  return NextResponse.json({ IP, MAC, downloadsDir, RTMP }, { status: 200 });
}
