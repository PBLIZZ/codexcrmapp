// @ts-check
import { baseConfig, nextjsConfig } from '@codexcrm/config-eslint';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/prisma/generated/**',
      '**/supabase/setup-storage.js', // Temporarily exclude Node.js utility script
      '**/packages/ui/src/lib/**', // Temporarily exclude lib files with type issues
    ],
  },
  ...baseConfig,
  ...nextjsConfig,
];
