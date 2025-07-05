// packages/ui/tailwind.config.ts
import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@codexcrm/config/tailwind';

const config: Config = {
  presets: [tailwindPreset],

  content: ['./src/**/*.{ts,tsx}'],
};

export default config;
