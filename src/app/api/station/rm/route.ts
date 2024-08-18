import { NextRequest, NextResponse } from "next/server";
import { rmSync, unlink, unlinkSync } from "node:fs";

export async function POST(request: NextRequest) {
  //get data
  const filePath = (await request.json())["filePath"];
  //fs rm
  unlinkSync(filePath);
  //ret
  return NextResponse.json({ msg: "ok" }, { status: 200 });
}
