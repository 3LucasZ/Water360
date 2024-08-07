import { isIPv6 } from "net";
import { NextRequest, NextResponse } from "next/server";
import { promise } from "ping";

export async function POST(request: NextRequest) {
  //try ping
  var cfg = {
    timeout: false,
    v6: isIPv6(global.IP),
  };
  var pingable = false;
  //@ts-ignore --override incorrect [cfg.timeout] type
  pingable = (await promise.probe(global.IP, cfg)).alive;
  console.log("pingable", pingable);
  //return
  return NextResponse.json({ pingable }, { status: 200 });
}
