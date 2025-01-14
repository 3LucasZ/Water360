/** @type {import('next').NextConfig} */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const json = require("./package.json");

const nextConfig = {
  env: { version: json.version },
  output: "standalone",
  images: {
    unoptimized: true,
  },
  transpilePackages: ["three"],
};

export default nextConfig;
