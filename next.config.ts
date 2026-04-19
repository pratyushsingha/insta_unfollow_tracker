import type { NextConfig } from "next";

const nextConfig:NextConfig = {
  serverExternalPackages: ["mongoose", "bullmq", "ioredis", "apify-client"],
};

export default nextConfig;
