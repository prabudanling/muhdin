import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Ramah shared hosting: tanpa header "X-Powered-By", respons di-gzip.
  poweredByHeader: false,
  compress: true,
  // Wajib untuk shared hosting: pastikan seluruh Query Engine Prisma
  // (multi-platform: debian + rhel/CloudLinux) ikut ter-bundle ke dalam
  // build standalone, sehingga folder node_modules tidak perlu di-upload.
  outputFileTracingIncludes: {
    "/**": ["./node_modules/.prisma/**"],
  },
};

export default nextConfig;
