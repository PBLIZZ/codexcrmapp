/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript errors during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Configure image domains for profile photos
  images: {
    domains: [
      // Only allow images from your Supabase project domain
      process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : '',
      // Temporary: Allow external demo photo sources
      'randomuser.me',
      'images.unsplash.com',
    ].filter(Boolean),  // Remove empty strings
  },
};

module.exports = nextConfig;
