import { NextRequest, NextResponse } from "next/server";
import commandExists from "command-exists";

export async function POST(request: NextRequest) {
  //---Status---
  const adbInstalled = commandExists.sync("adb");
  return NextResponse.json({ adbInstalled }, { status: 200 });
}
