// apps/web/next.config.ts
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  
  serverExternalPackages: ['@whatwg-node/fetch', '@prisma/client', 'bcryptjs'],

  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'fuyhpdtmbiqihisltfqt.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'ppzaajcutzyluffvbnrg.supabase.co',
      },
    ],
  },
};

const sentryConfig = {
  silent: true,
  org: 'codex-solutions-inc',
  project: 'codexcrm-web-app',

  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Automatically tree-shake Sentry logger statements
  disableLogger: true,
};

export default withSentryConfig(nextConfig, sentryConfig);
