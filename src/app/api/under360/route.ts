import { settingsDir } from "@/services/constants";
import { isValidIP } from "@/services/mini_helper";
import { NextRequest, NextResponse } from "next/server";
import { getItem, init } from "node-persist";

export async function POST(request: NextRequest) {
  //get IP
  await init({
    dir: settingsDir,
  });
  var IP = await getItem("IP");
  if (!isValidIP(IP)) {
    return NextResponse.json({ msg: "invalid IP" }, { status: 500 });
  }
  if (isValidIP(IP, true)) {
    IP = "[" + IP + "]";
  }
  //create request
  const protocol = "http";
  const port = 8080;
  const data = await request.json();
  const call = protocol + "://" + IP + ":" + port + data.path;
  console.log("under360:", call);
  //perform request
  const forceCache = data.path.match("inspect");
  const res = forceCache
    ? await fetch(call, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "force-cache",
      })
    : await fetch(call, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  //return
  return res;
}
