import { NextRequest, NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  //readdir
  const filePaths = (
    await readdir(global.downloadsDir, { withFileTypes: true })
  )
    .filter((file) => file.isFile())
    .map((file) => path.join(global.downloadsDir, file.name));
  //ret
  return NextResponse.json({ filePaths }, { status: 200 });
}
