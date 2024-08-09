import { Adb, AdbServerClient, AdbSync, AdbTransport } from "@yume-chan/adb";
import { AdbServerNodeTcpConnector } from "@yume-chan/adb-server-node-tcp";
import { NextRequest, NextResponse } from "next/server";
import { WritableStream } from "@yume-chan/stream-extra";
import fsPromises from "node:fs/promises";
import fs from "fs";
import { write } from "node:fs";

export async function POST(request: NextRequest) {
  try {
    //get data
    const fileName = (await request.json())["url"];
    const filePath = "/storage/emulated/0/Pictures/SDK_DEMO_EXPORT/" + fileName;
    //adb setup
    const connector: AdbServerNodeTcpConnector = new AdbServerNodeTcpConnector({
      host: "localhost",
      port: 5037,
    });
    const client: AdbServerClient = new AdbServerClient(connector);
    const selector: AdbServerClient.DeviceSelector = undefined;
    const transport: AdbTransport = await client.createTransport(selector);
    const adb: Adb = new Adb(transport);
    const sync: AdbSync = await adb.sync();
    //export setup
    var writeStream = fs.createWriteStream(
      global.downloadsDir + "/" + fileName,
      { flags: "w" }
    );
    global.exporting = true;
    global.exportSoFar = 0;
    global.exportTotal = Number((await sync.lstat(filePath)).size);
    //pull file asynchronously
    const content = sync.read(filePath);
    content
      .pipeTo(
        new WritableStream({
          write(chunk) {
            //pull content
            writeStream.write(chunk);
            global.exportSoFar += chunk.length;
          },
        })
      )
      .catch(() => {
        //clean up on error
        writeStream.close();
        global.exporting = false;
      })
      .finally(() => {
        //clean up on end
        writeStream.close();
        global.exporting = false;
      });
    //ret
    return NextResponse.json({ msg: "ok" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 });
  }
}
