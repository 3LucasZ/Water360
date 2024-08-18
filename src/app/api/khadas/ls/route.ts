import { Adb, AdbServerClient, AdbSync, AdbTransport } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const connector: AdbServerNodeTcpConnector = new AdbServerNodeTcpConnector({
    host: "localhost",
    port: 5037,
  });
  const client: AdbServerClient = new AdbServerClient(connector);
  const selector: AdbServerClient.DeviceSelector = undefined;
  const transport: AdbTransport = await client.createTransport(selector);
  const adb: Adb = new Adb(transport);
  const dir = "/storage/emulated/0/Pictures/SDK_DEMO_EXPORT";
  const sync: AdbSync = await adb.sync();
  const files = await sync.readdir(dir);
  // const fileNames = files.map((file) => file.name);
  // return NextResponse.json({ data: fileNames }, { status: 200 });
  const filePaths = files.map((file) => dir + "/" + file.name);
  return NextResponse.json({ data: filePaths }, { status: 200 });
}
