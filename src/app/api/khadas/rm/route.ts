import { Adb, AdbServerClient, AdbSync, AdbTransport } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //get data
  const filePath = (await request.json())["url"];
  //setup adb
  try {
    var connector: AdbServerNodeTcpConnector = new AdbServerNodeTcpConnector({
      host: "localhost",
      port: 5037,
    });
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 });
  }
  const client: AdbServerClient = new AdbServerClient(connector);
  const selector: AdbServerClient.DeviceSelector = undefined;
  const transport: AdbTransport = await client.createTransport(selector);
  const adb: Adb = new Adb(transport);
  // remove file
  await adb.rm(filePath);
  return NextResponse.json({ message: "ok" }, { status: 200 });
}
