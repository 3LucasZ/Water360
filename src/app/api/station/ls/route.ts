import { NextRequest, NextResponse } from "next/server";
import { readdir } from "node:fs/promises";

export async function POST(request: NextRequest) {
  //readdir
  const filePaths = (
    await readdir(global.downloadsDir, { withFileTypes: true })
  )
    .filter((file) => file.isFile())
    .map((file) => global.downloadsDir + "/" + file.name);
  //ret
  return NextResponse.json({ filePaths }, { status: 200 });
}
