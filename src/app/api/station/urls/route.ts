import { NextRequest, NextResponse } from "next/server";
import { readdir } from "node:fs/promises";

export async function POST(request: NextRequest) {
  //readdir
  const urls = (await readdir(global.downloadsDir)).map(
    (fileName) => global.downloadsDir + "/" + fileName
  );
  //ret
  return NextResponse.json({ urls }, { status: 500 });
}
