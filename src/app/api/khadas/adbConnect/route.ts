import { isValidIP } from "@/services/mini_helper";
import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import { promisify } from "util";
import { getAdbPath } from "@/services/mini_helper";

export async function POST(req: NextRequest) {
  //get IP
  var IP = global.IP;
  if (!isValidIP(IP)) {
    return NextResponse.json({ msg: "invalid IP" }, { status: 500 });
  }
  if (isValidIP(IP, true)) {
    IP = '"[' + IP + ']"';
  }
  //adb connect <IP>
  const command = promisify(exec);
  // on development, use the local homebrew adb command.
  // I don't want to cause problems or messy conflicts.
  const adbPath =
    process.env.NODE_ENV == "development" ? "adb" : getAdbPath(__dirname);
  const { stdout, stderr } = await command(
    adbPath + " connect " + IP + ":5555",
    {
      timeout: 4000,
    }
  );
  console.log("stdout:", stdout);
  console.log("stderr:", stderr);
  //return
  if (stderr) {
    return NextResponse.json({ err: stderr }, { status: 500 });
  }
  return NextResponse.json({ stdout, stderr }, { status: 200 });
}
