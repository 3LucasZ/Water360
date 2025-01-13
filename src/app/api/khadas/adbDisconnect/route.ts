import { isValidIP } from "@/services/mini_helper";
import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import { promisify } from "util";
import { getAdbPath } from "../../station/info/route";

export async function POST(req: NextRequest) {
  //adb disconnect
  const command = promisify(exec);
  const adbPath =
    process.env.NODE_ENV == "development" ? "adb" : getAdbPath(__dirname);
  const { stdout, stderr } = await command(adbPath + " disconnect", {
    timeout: 4000,
  });
  console.log("stdout:", stdout);
  console.log("stderr:", stderr);
  //return
  if (stderr) {
    return NextResponse.json({ err: stderr }, { status: 500 });
  }
  return NextResponse.json({ stdout, stderr }, { status: 200 });
}
