/* @file /packages/config/tsup.config.js */
import { serverPackageConfig } from './tsup/index.ts';

export default serverPackageConfig({
  entry: ['src/index.ts'],
  tsconfig: 'tsconfig.json',
});