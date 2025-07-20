import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  // Do not ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: false,
  },
  // Do not ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Treat these packages as part of the next app build otherweise
  // they are thrown as errors
  transpilePackages: ['@codexcrm/db', '@prisma/client'],
  // Configure image domains for profile photos
  images: {
    domains: [
      // Only allow images from your Supabase project domain
      process.env.NEXT_PUBLIC_SUPABASE_URL
        ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
        : '',
      // Temporary: Allow external demo photo sources
      'randomuser.me',
      'images.unsplash.com',
    ].filter(Boolean), // Remove empty strings
  },
};

// Sentry webpack plugin options
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  silent: true, // Suppresses all logs
  org: "omnipotency-ai", // Add your Sentry org slug here
  project: "javascript-nextjs", // Add your Sentry project slug here
  
  // Additional options
  widenClientFileUpload: true,
  transpileClientSDK: true,
  hideSourceMaps: true,
  disableLogger: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
