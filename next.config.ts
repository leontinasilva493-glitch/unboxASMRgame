import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

initOpenNextCloudflareForDev();
