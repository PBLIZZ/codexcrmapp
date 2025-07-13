/** @type {import('tailwindcss').Config} */
import { tailwindPreset } from '@codexcrm/config-tailwind';

export default {
  presets: [tailwindPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}',
    // Include shared UI package content
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  // All theme, colors, and plugins are now inherited from the shared preset
};
