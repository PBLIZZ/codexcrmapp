/** @type {import('tailwindcss').Config} */
module.exports = {
  // highlight-start
  // This tells the web app's Tailwind to inherit ALL settings (theme, plugins, etc.)
  // from the UI package's config.
  presets: [require('@codexcrm/ui/tailwind.config')],
  // highlight-end

  // This tells the web app's Tailwind to scan ITS OWN files for class usage,
  // PLUS the files from the UI package. This is critical for the JIT compiler.
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}', // <-- The path to your shared UI components
  ],
  theme: {
    extend: {
      // You can add app-specific overrides or extensions here if needed
    },
  },
  plugins: [
    // You can add app-specific plugins here if needed
  ],
};
