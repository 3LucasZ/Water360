import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //return
  const IP = global.IP;
  const MAC = global.MAC;
  const downloadsDir = global.downloadsDir;
  const RTMP = global.RTMP;
  return NextResponse.json({ IP, MAC, downloadsDir, RTMP }, { status: 200 });
}
