// packages/ui/postcss.config.mjs 
// This is a basic postcss config file.
// It's used by the `postcss-cli` in your build:css script.
// Import the new plugin
import autoprefixer from 'autoprefixer';
import postcss from '@tailwindcss/postcss';

export default {
  plugins: {
    autoprefixer,
    postcss,
  },
};