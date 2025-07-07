/** @file /packages/config/tsup/index.ts */
import { defineConfig, type Options } from 'tsup';

const baseConfig: Options = {
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false, // DTS generation will be handled by tsc
};

export const serverPackageConfig = defineConfig((options) => ({
  ...baseConfig,
  format: ['esm', 'cjs'],
  ...options,
}));

export const uiPackageConfig = defineConfig((options) => ({
  ...baseConfig,
  format: ['esm'],
  banner: {
    js: '"use client";',
  },
  splitting: true,
  external: ['react', 'react-dom'],
  ...options,
}));

export const defaultConfig = defineConfig(baseConfig);