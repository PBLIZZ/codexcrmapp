const sharedConfig = require('@codexcrm/config/tailwind');
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use the shared config as a preset
  presets: [sharedConfig],
  // The `content` path is ALWAYS relative to the current project
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // If you have a shared UI package, include it too!
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
}