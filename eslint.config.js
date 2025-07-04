// /eslint.config.js (at the monorepo root)
import baseConfig from '@codexcrm/config/eslint'; // <-- CORRECT PATH
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Apply the base preset to everything
  ...baseConfig,
  
  // Apply the Next.js specific rules ONLY to the web app
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    ...baseConfig.nextjsConfig,
    settings: {
        next: {
            rootDir: 'apps/web/'
        }
    }
  }
);
