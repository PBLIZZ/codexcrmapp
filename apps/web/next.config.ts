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

module.exports = nextConfig;
