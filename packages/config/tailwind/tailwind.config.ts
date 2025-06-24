// /packages/ui/tailwind.config.js
const sharedConfig = require('@codexcrm/config/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use the shared config as a preset. It inherits the theme and plugins.
  presets: [sharedConfig],

  // CRITICAL: Only look at files INSIDE this package.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
};