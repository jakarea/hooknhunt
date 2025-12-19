import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "192.168.0.166",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "192.168.0.166",
        port: "8008",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "192.168.0.229",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://192.168.0.166:8000/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
