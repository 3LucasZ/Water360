/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  transpilePackages: ["three"],
};

export default nextConfig;
