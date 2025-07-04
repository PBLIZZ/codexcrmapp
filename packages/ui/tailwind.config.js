// packages/ui/tailwind.config.js
import { themeConfig } from './src/lib/theme'; // Import your JS theme object

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./src/**/*.{ts,tsx}'], // Scan this package's files
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Spread your theme config here
      colors: themeConfig.colors,
      borderRadius: themeConfig.borderRadius,
      keyframes: {
        // ... any keyframes you need
      },
      animation: {
        // ... any animations you need
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
