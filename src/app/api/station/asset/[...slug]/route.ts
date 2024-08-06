import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const imagePath = "/" + params.slug.join("/");
  console.log(imagePath);
  const imageBuffer = fs.readFileSync(imagePath);
  const res = new NextResponse(imageBuffer);
  res.headers.set("Content-Type", "image/jpg");
  return res;
}
