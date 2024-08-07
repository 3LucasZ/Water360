/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  experimental: {
    instrumentationHook: true,
  },
  transpilePackages: ["three"],
};

export default nextConfig;
