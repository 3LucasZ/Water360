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
    var queryParamsRaw = await request.json();
    if (queryParamsRaw) {
      proxyRoute += "?" + new URLSearchParams(queryParamsRaw).toString();
    }
    console.log(queryParamsRaw);
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
  //set cacheStrategy and timeout
  const cacheStrategy = proxyRoute.includes("inspect")
    ? "force-cache"
    : "default";
  const timeout = proxyRoute.includes("inspect") ? 20000 : 5000;
  //perform proxy request
  try {
    const res = await fetch(call, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // cache: cacheStrategy,
      signal: AbortSignal.timeout(timeout),
    });
    //return
    const ret = await res.json();
    if (queryParamsRaw["log"]) {
      global.stdout = JSON.stringify(ret, null, 2);
      global.stderr = "";
    }
    return NextResponse.json(ret, { status: res.status });
  } catch (e) {
    //catch timeout error
    if (queryParamsRaw["log"]) {
      global.stdout = "Request timeout";
      global.stderr = "";
    }
    return NextResponse.json({ err: "Request timeout" }, { status: 504 });
  }
}
