// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@codexcrm/config-tailwind';

const config: Config = {
  presets: [tailwindPreset],

content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;
