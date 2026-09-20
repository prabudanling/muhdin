import type { NextConfig } from "next";

/**
 * DUAL-MODE BUILD:
 * - Mode normal (dev & standalone)  : output "standalone" + API routes Node.
 * - Mode shared hosting tanpa Node  : BUILD_STATIC=1 → output "export" murni
 *   (HTML/JS/CSS statis). API digantikan backend PHP (lihat shared-hosting/),
 *   dipaketkan oleh scripts/build-shared-hosting.mjs.
 */
const isStatic = process.env.BUILD_STATIC === "1";

const nextConfig: NextConfig = {
  ...(isStatic ? { output: "export" as const, images: { unoptimized: true } } : { output: "standalone" as const }),
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
  outputFileTracingIncludes: isStatic ? undefined : {
    "/**": ["./node_modules/.prisma/**"],
  },
};

export default nextConfig;
