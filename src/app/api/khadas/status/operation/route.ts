import { Adb, AdbServerClient, AdbSync, AdbTransport } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";
import { WritableStream } from "@yume-chan/stream-extra";
import fsPromises from "node:fs/promises";
import fs from "fs";
import { write } from "node:fs";

export async function POST(request: NextRequest) {
  try {
    //ret
    return NextResponse.json(
      {
        exporting: global.exporting,
        exportSoFar: global.exportSoFar,
        exportTotal: global.exportTotal,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 });
  }
}
