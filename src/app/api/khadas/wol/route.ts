import { settingsDir } from "@/services/constants";
import { NextRequest, NextResponse } from "next/server";
import { getItem, init } from "node-persist";
import { wake } from "wake_on_lan";

export async function POST(request: NextRequest) {
  await init({
    dir: settingsDir,
  });
  const MAC = await getItem("MAC");
  console.log("wol:", MAC);
  wake(MAC, function (error) {
    if (error) {
      // handle error
    } else {
      // done sending packets
    }
  });
  return NextResponse.json({ msg: "ok" }, { status: 200 });
}
