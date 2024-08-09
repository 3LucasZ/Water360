import { NextRequest, NextResponse } from "next/server";
import { lstat } from "node:fs/promises";

export async function POST(request: NextRequest) {
  //get data
  const fileName = (await request.json())["url"];
  //fs lstat
  const res = await lstat(fileName);
  const fileSize = res.size;
  //ret
  return NextResponse.json({ fileSize }, { status: 200 });
}
