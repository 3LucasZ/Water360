import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  console.log(params.slug);
  const imagePath = path.join(global.downloadsDir, params.slug);
  console.log(imagePath);
  const imageBuffer = fs.readFileSync(imagePath);
  const res = new NextResponse(imageBuffer);
  const fileSuffix = params.slug.split(".").pop();
  if (fileSuffix == "jpg") {
    res.headers.set("Content-Type", "image/jpg");
  } else {
    res.headers.set("Content-Type", "video/mp4");
  }
  console.log(res.headers);
  return res;
}
