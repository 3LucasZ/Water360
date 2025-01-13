import { NextRequest, NextResponse } from "next/server";
import { wake } from "wake_on_lan";

export async function POST(request: NextRequest) {
  console.log("wol:", global.MAC);
  wake(MAC, function (error) {
    if (error) {
      // handle error
      return NextResponse.json({ msg: "" + error }, { status: 500 });
    } else {
      // done sending packets
    }
  });
  return NextResponse.json({ msg: "ok" }, { status: 200 });
}
