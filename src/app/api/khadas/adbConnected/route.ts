import { AdbServerClient } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    var connector: AdbServerNodeTcpConnector = new AdbServerNodeTcpConnector({
      host: "localhost",
      port: 5037,
    });
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 });
  }
  const client: AdbServerClient = new AdbServerClient(connector);
  var devices: AdbServerClient.Device[] = await client.getDevices();
  devices = devices.filter((device) => device.model == "VIM4");
  const adbConnected = devices.length == 1;
  return NextResponse.json({ adbConnected }, { status: 200 });
}
