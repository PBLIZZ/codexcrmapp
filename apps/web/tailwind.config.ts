import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@codexcrm/config/tailwind';

const config: Config = {
  presets: [tailwindPreset],

content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};