import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

// Import webpack config as a module
import webpackConfig from './webpack.config.mjs';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  "core": {
    "disableTelemetry": true
  },
  "typescript": {
    "reactDocgen": "react-docgen-typescript",
    "reactDocgenTypescriptOptions": {
      "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        "esModuleInterop": true
      }
    }
  },
  "webpackFinal": async (config) => {
    // Use the custom webpack configuration
    return webpackConfig({ config });
  },
  "staticDirs": ['../public', '../src/assets'],
};
export default config;