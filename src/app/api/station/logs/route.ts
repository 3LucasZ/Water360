import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { stdout: global.stdout, stderr: global.stderr },
    { status: 200 }
  );
}
