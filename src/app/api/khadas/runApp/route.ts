import { Adb, AdbServerClient, AdbTransport, decodeUtf8 } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";
import { TextDecoderStream, WritableStream } from "@yume-chan/stream-extra";

export async function POST(request: NextRequest) {
  //adb activity start
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
  const process = await adb.subprocess.spawn(
    'am start -n "com.example.kotlininsta360demo/com.example.kotlininsta360demo.activity.MainActivity" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER'
  );
  var msg = "";
  await process.stdout.pipeThrough(new TextDecoderStream("UTF8")).pipeTo(
    new WritableStream({
      write(chunk) {
        msg += chunk;
      },
    })
  );
  await process.kill();
  //return
  return NextResponse.json({ msg }, { status: 200 });
}
