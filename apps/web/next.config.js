/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript errors during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
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
      process.env.NEXT_PUBLIC_SUPABASE_URL
        ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
        : '',
      'lh3.googleusercontent.com', // For Google profile pictures
      'graph.facebook.com', // For Facebook profile pictures
      'media.licdn.com', // For LinkedIn profile pictures
      // Apple
      's.gravatar.com',
      'secure.gravatar.com',
      '*.apple.com',
      '*.mzstatic.com',
      // Instagram
      'scontent.cdninstagram.com',
      // TikTok
      'p16-sign-va.tiktokcdn.com',
      // X (Twitter)
      'pbs.twimg.com',
      // YouTube (Google)
      'yt3.ggpht.com',
      'i.ytimg.com',
      // Microsoft
      'profile.microsoft.com',
      'img-prod-cms-rt-microsoft-com.akamaized.net',
      // Add other domains as needed
    ].filter(Boolean), // Remove empty strings
  },
};

module.exports = nextConfig;
