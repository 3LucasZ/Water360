import { Adb, AdbServerClient, AdbSync, AdbTransport } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";
import { WritableStream } from "@yume-chan/stream-extra";
import fsPromises, { lstat, readdir } from "node:fs/promises";
import fs from "fs";
import { write } from "node:fs";

export async function POST(request: NextRequest) {
  //readdir
  const urls = (await readdir(global.downloadsDir)).map(
    (fileName) => global.downloadsDir + "/" + fileName
  );
  //ret
  return NextResponse.json({ urls }, { status: 500 });
}
