import { NextRequest, NextResponse } from "next/server";
import commandExists from "command-exists";
import path from "path";
import { getAdbPath, getScrcpyPath } from "@/services/path_helper";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  //---Status---
  const adbPath = getAdbPath(__dirname);
  const adbInstalled = existsSync(adbPath);
  const scrcpyPath = getScrcpyPath(__dirname);
  const scrcpyInstalled = existsSync(scrcpyPath);
  return NextResponse.json({ adbInstalled, scrcpyInstalled }, { status: 200 });
}
