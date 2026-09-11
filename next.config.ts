import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep framework chrome out of product visual reviews. Runtime and compile
  // errors still surface in development when the route indicator is hidden.
  devIndicators: false,
};

export default nextConfig;
