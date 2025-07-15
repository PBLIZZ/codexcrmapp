import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@codexcrm/config-tailwind';

const config: Config = {
  presets: [tailwindPreset],

  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
