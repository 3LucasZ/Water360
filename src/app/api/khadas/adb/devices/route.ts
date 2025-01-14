import { isValidIP } from "@/services/mini_helper";
import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import { promisify } from "util";
import { getAdbPath } from "@/services/path_helper";

export async function POST(req: NextRequest) {
  const suffix = "devices";
  // -- template --
  const command = promisify(exec);
  const adbPath = getAdbPath(__dirname);
  console.log(adbPath + " " + suffix);
  const { stdout, stderr } = await command(adbPath + " " + suffix);
  global.stdout = stdout;
  global.stderr = stderr;
  if (stderr) {
    return NextResponse.json({ err: stderr }, { status: 500 });
  }
  return NextResponse.json({}, { status: 200 });
  // ---------------
}
