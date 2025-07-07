/** @file /packages/ui/tsup.config.js */
import { uiPackageConfig } from '@codexcrm/config-tsup';

export default uiPackageConfig({
  entry: ['src/index.ts'],
  tsconfig: 'tsconfig.json',
});