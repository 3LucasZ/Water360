import { settingsDir } from "@/services/constants";
import { isIPv6 } from "net";
import { NextRequest, NextResponse } from "next/server";
import { init, getItem } from "node-persist";
import { promise } from "ping";

export async function POST(request: NextRequest) {
  //get IP
  await init({
    dir: settingsDir,
  });
  let IP = await getItem("IP");
  //try ping
  var cfg = {
    timeout: false,
    v6: isIPv6(IP),
  };
  var pingable = false;
  pingable = (await promise.probe(IP, cfg)).alive;
  console.log("pingable", pingable);
  //return
  return NextResponse.json({ pingable }, { status: 200 });
}
