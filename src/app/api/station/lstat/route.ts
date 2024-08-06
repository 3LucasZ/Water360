import { Adb, AdbServerClient, AdbSync, AdbTransport } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";
import { WritableStream } from "@yume-chan/stream-extra";
import fsPromises, { lstat } from "node:fs/promises";
import fs from "fs";
import { write } from "node:fs";

export async function POST(request: NextRequest) {
  //get data
  const fileName = (await request.json())["url"];
  //fs lstat
  const res = await lstat(fileName);
  const fileSize = res.size;
  //ret
  return NextResponse.json({ fileSize }, { status: 500 });
}
