import { Adb, AdbServerClient, AdbSync, AdbTransport } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";
import { WritableStream } from "@yume-chan/stream-extra";
import fsPromises, { lstat, readdir } from "node:fs/promises";
import fs from "fs";
import { write } from "node:fs";
import { getItem, init } from "node-persist";
import { settingsDir } from "@/services/constants";

export async function POST(request: NextRequest) {
  //get data
  await init({
    dir: settingsDir,
  });
  const downloadsDir = await getItem("downloadsDir");
  //readdir
  const urls = (await readdir(downloadsDir)).map(
    (fileName) => downloadsDir + "/" + fileName
  );
  //ret
  return NextResponse.json({ urls }, { status: 500 });
}
