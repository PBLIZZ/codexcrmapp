// /eslint.config.js (at the monorepo root)
import { codexCrmPreset, nextjsConfig } from '@codexcrm/config-eslint';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Apply the base preset to everything
  ...codexCrmPreset,
  
  // Apply the Next.js specific rules ONLY to the web app
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    ...nextjsConfig,
    settings: {
        next: {
            rootDir: 'apps/web/'
        }
    }
  }
);
