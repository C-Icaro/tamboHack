import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/showcase", destination: "/tambo-poc", permanent: false },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Stub optional peer deps from @standard-community/standard-json
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      effect: false,
      sury: false,
      "@valibot/to-json-schema": false,
    };
    return config;
  },
};

export default nextConfig;
