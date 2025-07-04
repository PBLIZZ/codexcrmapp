/**
 * @SERVER-COMPONENT
 * Next.js Configuration
 */

import path from 'node:path';
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: [
    '@codexcrm/ui',
    '@trpc/client',
    '@trpc/server',
    '@trpc/react-query',
    '@trpc/next',
  ],

  serverExternalPackages: ['@whatwg-node/fetch', '@prisma/client', 'bcryptjs'],

  images: {
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

  widenClientFileUpload: true,

  disableLogger: true,
};

export { nextConfig, sentryConfig };

export default withSentryConfig(nextConfig, sentryConfig);
