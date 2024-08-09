import { isValidIP } from "@/services/mini_helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  //get proxy route
  const proxyRoute = "/" + params.slug.join("/");
  //get IP
  var IP = global.IP;
  if (!isValidIP(IP)) {
    return NextResponse.json({ msg: "invalid IP" }, { status: 500 });
  }
  if (isValidIP(IP, true)) {
    IP = "[" + IP + "]";
  }
  //create request
  const protocol = "http";
  const port = 8080;
  const call = protocol + "://" + IP + ":" + port + proxyRoute;
  console.log("under360:", call);
  //apply forceCache on certain commands
  const forceCache = proxyRoute.match("inspect");
  //perform proxy request
  try {
    const res = await fetch(call, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: forceCache ? "force-cache" : "default",
      signal: AbortSignal.timeout(2000),
    });
    //return
    return res;
  } catch (e) {
    //catch timeout error
    return NextResponse.json({ err: "Request timeout" }, { status: 504 });
  }
}
