import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ui-universe/ui", "@ui-universe/tokens"],
};

export default nextConfig;
