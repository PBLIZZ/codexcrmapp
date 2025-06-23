import path from 'node:path';
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@codexcrm/ui',
    '@trpc/client',
    '@trpc/server',
    '@trpc/react-query',
    '@trpc/next',
  ],

  // Moved from experimental.serverComponentsExternalPackages
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

  // Moved from experimental.turbo
  turbopack: {
    resolveAlias: {
      '@codexcrm/auth': path.resolve(__dirname, '../../packages/auth/src'),
      '@codexcrm/config': path.resolve(__dirname, '../../packages/config/src'),
      '@codexcrm/database': path.resolve(__dirname, '../../packages/database/src'),
      '@codexcrm/lib': path.resolve(__dirname, '../../packages/lib/src'),
      '@codexcrm/server': path.resolve(__dirname, '../../packages/server/src'),
      '@codexcrm/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@/*': path.resolve(__dirname, './'),
    },
  },

  experimental: {
    // Remove deprecated settings - they've been moved above
    typedRoutes: true,
  },

  // Ensure API routes work properly with TRPC
  async rewrites() {
    return [
      {
        source: '/api/trpc/:path*',
        destination: '/api/trpc/:path*',
      },
    ];
  },

  // Configure webpack for better compatibility
  webpack: (config, { isServer }) => {
    // Handle externals for server-side
    if (isServer) {
      config.externals.push('@prisma/client');
    }

    return config;
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
