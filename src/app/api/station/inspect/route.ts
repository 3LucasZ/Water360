import { NextRequest, NextResponse } from "next/server";
import { lstat } from "node:fs/promises";
import path from "node:path";

export async function POST(request: NextRequest) {
  //get data
  const fileName = (await request.json())["fileName"];
  //fs lstat
  const res = await lstat(path.join(global.downloadsDir, fileName));
  const fileSize = res.size;
  //ret
  return NextResponse.json({ fileSize }, { status: 200 });
}
