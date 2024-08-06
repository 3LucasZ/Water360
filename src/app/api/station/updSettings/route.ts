import { NextRequest, NextResponse } from "next/server";
import { init, setItem } from "node-persist";
import { settingsDir } from "@/services/constants";

export async function POST(request: NextRequest) {
  //save settings
  const data = await request.json();
  await init({
    dir: settingsDir,
  });
  await setItem("IP", data["IP"]);
  await setItem("MAC", data["MAC"]);
  await setItem("downloadsDir", data["downloadsDir"]);
  await setItem("RTMP", data["RTMP"]);
  //return
  return NextResponse.json({ msg: "ok" }, { status: 200 });
}
