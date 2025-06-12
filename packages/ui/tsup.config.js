// packages/ui/tsup.config.ts
import { defineConfig } from 'tsup';
export default defineConfig({
    // The entry point is your main index.ts file.
    // tsup will read this file, find all the imports, and build everything.
    entry: ['src/index.ts'],
    // Generate both ESM and CJS modules
    format: ['esm', 'cjs'],
    // Disable d.ts generation here; declarations are handled by `tsc --build` via project references.
    dts: false,
    // Don't bundle the 'react' package with our component library
    external: ['react'],
    // Sourcemaps for easier debugging
    sourcemap: true,
    // Clean the 'dist' folder before each build
    clean: true,
    // Use standard tsconfig for bundling; no need for custom build config
    tsconfig: 'tsconfig.json',
});
