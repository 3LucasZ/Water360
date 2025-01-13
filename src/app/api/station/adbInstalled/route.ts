import { NextRequest, NextResponse } from "next/server";
import commandExists from "command-exists";
import path from "path";
import { getAdbPath } from "@/services/mini_helper";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  //---Status---
  const adbPath = getAdbPath(__dirname);
  const adbInstalled = existsSync(adbPath);
  return NextResponse.json({ adbInstalled }, { status: 200 });
}
