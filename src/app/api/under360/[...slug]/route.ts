import { isValidIP } from "@/services/mini_helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  //get proxy route
  var proxyRoute = "/" + params.slug.join("/");
  //convert body to params
  try {
    const queryParamsRaw = await request.json();
    if (queryParamsRaw) {
      proxyRoute += "?" + new URLSearchParams(queryParamsRaw).toString();
    }
  } catch (e) {}
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
  const forceCache = proxyRoute.includes("inspect");
  //perform proxy request
  try {
    const res = await fetch(call, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: forceCache ? "force-cache" : "default",
      signal: AbortSignal.timeout(5000),
    });
    //return
    return res;
  } catch (e) {
    //catch timeout error
    return NextResponse.json({ err: "Request timeout" }, { status: 504 });
  }
}
