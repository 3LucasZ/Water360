import { isValidIP } from "@/services/mini_helper";
import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import { promisify } from "util";
import { getAdbPath } from "@/services/path_helper";

export async function POST(req: NextRequest) {
  // -- get IP --
  var IP = global.IP;
  if (!isValidIP(IP)) {
    return NextResponse.json({ msg: "invalid IP" }, { status: 500 });
  }
  if (isValidIP(IP, true)) {
    IP = '"[' + IP + ']"';
  }
  // ------------
  const suffix = "connect " + IP + ":5555";
  const t = 10000;
  // -- NOT template due to custom timeout connect features --
  const command = promisify(exec);
  const adbPath = getAdbPath(__dirname);
  console.log(adbPath + " " + suffix);
  try {
    const { stdout, stderr } = await command(adbPath + " " + suffix, {
      timeout: t,
    });
    global.stdout = stdout;
    global.stderr = stderr;
  } catch (e) {
    global.stdout = "";
    global.stderr = "Timeout exceeded: " + t + "ms. " + e;
  }

  if (stderr) {
    return NextResponse.json({ stdout, stderr, err: stderr }, { status: 500 });
  }
  return NextResponse.json({ stdout, stderr }, { status: 200 });
  // ---------------
}
