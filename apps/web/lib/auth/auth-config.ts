export const authConfig = {
  google: {
    clientId: '223208206554-jtsfpf7qgsppn3me9bsqq6avdu8ff020.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: 'https://ppzaajcutzyluffvbnrg.supabase.co/auth/v1/callback',
    scopes: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '',
    redirectTo: `${window.location.origin}/auth/callback`,
  },
};

export const allowedOrigins = [
  'https://codexcrmapp-pblizzs-projects.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost',
];
