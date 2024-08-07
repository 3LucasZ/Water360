import { isValidIP } from "@/services/mini_helper";
import { Adb, AdbServerClient, AdbTransport } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import { promisify } from "util";
import { wake } from "wake_on_lan";
import { TextDecoderStream, WritableStream } from "@yume-chan/stream-extra";
import { under360 } from "@/services/api_helper";

//Perform full connect sequence (can take up to 1 minute)
//TODO: Not implemented yet unless requested.
export async function POST(request: NextRequest) {
  var IP = global.IP;
  if (!isValidIP(IP)) {
    return NextResponse.json({ msg: "invalid IP" }, { status: 500 });
  }
  if (isValidIP(IP, true)) {
    IP = '"[' + IP + ']"';
  }
  //---WOL---
  wake(global.MAC, async function (error) {
    if (error) {
      // handle error
      return NextResponse.json({ msg: "wakeonlan failed" }, { status: 500 });
    } else {
      // done sending packets
      const connector: AdbServerNodeTcpConnector =
        new AdbServerNodeTcpConnector({
          host: "localhost",
          port: 5037,
        });
      const client: AdbServerClient = new AdbServerClient(connector);
      var devices: AdbServerClient.Device[] = await client.getDevices();
      devices = devices.filter((device) => device.model == "VIM4");
      if (devices.length == 0) {
        //---Connect---
        const command = promisify(exec);
        const { stdout, stderr } = await command("adb connect " + IP + ":5555");
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
        devices = await client.getDevices();
      } else if (devices.length > 1) {
        return NextResponse.json(
          { msg: "too many adb devices connected" },
          { status: 500 }
        );
      }
      devices = devices.filter((device) => device.model == "VIM4");
      if (devices.length != 1) {
        return NextResponse.json(
          { msg: "adb unable to connect to khadas" },
          { status: 500 }
        );
      }
      const selector: AdbServerClient.DeviceSelector = undefined;
      const transport: AdbTransport = await client.createTransport(selector);
      const adb: Adb = new Adb(transport);
      //---Start activity---
      const process = await adb.subprocess.spawn(
        'am start -n "com.example.kotlininsta360demo/com.example.kotlininsta360demo.activity.MainActivity" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER'
      );
      await process.stdout.pipeThrough(new TextDecoderStream("UTF8")).pipeTo(
        new WritableStream({
          write(chunk) {
            // console.log(chunk);
          },
        })
      );
      await process.kill();
      //---Connect camera---
      await under360("/command/connect");
      return NextResponse.json({ msg: "ok" }, { status: 200 });
    }
  });
}
