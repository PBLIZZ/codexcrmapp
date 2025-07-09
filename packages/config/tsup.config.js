/* @file /packages/config/tsup.config.js */
import { serverPackageConfig } from '@codexcrm/config-tsup';

export default serverPackageConfig({
  entry: ['src/index.ts'],
  tsconfig: 'tsconfig.json',
});