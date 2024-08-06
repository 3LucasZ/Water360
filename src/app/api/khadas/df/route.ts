import { Adb, AdbServerClient, AdbTransport, decodeUtf8 } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";
import { TextDecoderStream, WritableStream } from "@yume-chan/stream-extra";

export async function POST(request: NextRequest) {
  //adb df
  const connector: AdbServerNodeTcpConnector = new AdbServerNodeTcpConnector({
    host: "localhost",
    port: 5037,
  });
  const client: AdbServerClient = new AdbServerClient(connector);
  const selector: AdbServerClient.DeviceSelector = undefined;
  const transport: AdbTransport = await client.createTransport(selector);
  const adb: Adb = new Adb(transport);
  const process = await adb.subprocess.spawn("df /storage/emulated");
  var msg = "";
  await process.stdout.pipeThrough(new TextDecoderStream("UTF8")).pipeTo(
    new WritableStream({
      write(chunk) {
        msg += chunk;
      },
    })
  );
  await process.kill();
  //parse stdout
  const spit = msg.split(" ").filter((bit) => bit != "");
  const freeSpace = Number(spit[9]) * 1024;
  const totalSpace = Number(spit[7]) * 1024;
  //return
  return NextResponse.json({ freeSpace, totalSpace }, { status: 200 });
}
