import { Adb, AdbServerClient, AdbTransport, decodeUtf8 } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";
import { TextDecoderStream, WritableStream } from "@yume-chan/stream-extra";
import commandExists from "command-exists";

export async function POST(request: NextRequest) {
  //---Status---
  const adbInstalled = commandExists.sync("adb");
  return NextResponse.json({ adbInstalled }, { status: 200 });
}
