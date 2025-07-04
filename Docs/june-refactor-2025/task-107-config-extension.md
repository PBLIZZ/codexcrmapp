# Task 107: Update All TSConfigs to Use New Source of Truth

**Priority**: CRITICAL  
**Dependencies**: [104]  
**Duration**: 20 minutes  
**Description**: Update all tsconfig files to extend from packages/config

## Implementation Steps:

### 1. Update Root tsconfig.base.json
```bash
# First, ensure packages/config is in your workspace
cd packages/config && pnpm install && cd ../..

# Update the root tsconfig.base.json
cat > tsconfig.base.json << 'EOF'
{
  "extends": "@codexcrm/config/typescript/base",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@codexcrm/api": ["./packages/api/src"],
      "@codexcrm/api/*": ["./packages/api/src/*"],
      "@codexcrm/auth": ["./packages/auth/src"],
      "@codexcrm/auth/*": ["./packages/auth/src/*"],
      "@codexcrm/database": ["./packages/database/src"],
      "@codexcrm/database/*": ["./packages/database/src/*"],
      "@codexcrm/ui": ["./packages/ui/src"],
      "@codexcrm/ui/*": ["./packages/ui/src/*"],
      "@codexcrm/background-jobs": ["./packages/background-jobs/src"],
      "@codexcrm/background-jobs/*": ["./packages/background-jobs/src/*"],
      "@codexcrm/config": ["./packages/config"],
      "@codexcrm/config/*": ["./packages/config/*"]
    }
  }
}
EOF
```

### 2. Update apps/web/tsconfig.json
```bash
# Update Next.js app to use the Next.js config
cat > apps/web/tsconfig.json << 'EOF'
{
  "extends": "@codexcrm/config/typescript/nextjs",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
EOF
```

### 3. Update Package TSConfigs
```bash
# Create a script to update all package tsconfigs
cat > scripts/update-package-tsconfigs.js << 'EOF'
const fs = require('fs');
const path = require('path');

const packages = [
  'api',
  'auth', 
  'database',
  'ui',
  'background-jobs'
];

packages.forEach(pkg => {
  const tsconfigPath = path.join('packages', pkg, 'tsconfig.json');
  
  if (fs.existsSync(tsconfigPath)) {
    const config = {
      extends: pkg === 'ui' 
        ? "@codexcrm/config/typescript/react-library"
        : "@codexcrm/config/typescript/base",
      compilerOptions: {
        baseUrl: ".",
        paths: {
          [`@codexcrm/${pkg}`]: ["./src"],
          [`@codexcrm/${pkg}/*`]: ["./src/*"]
        }
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"]
    };
    
    // Add specific options for UI package
    if (pkg === 'ui') {
      config.compilerOptions.declaration = true;
      config.compilerOptions.declarationMap = true;
      config.compilerOptions.outDir = "./dist";
    }
    
    fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
    console.log(`Updated: ${tsconfigPath}`);
  }
});
EOF

# Run the update script
node scripts/update-package-tsconfigs.js
```

### 4. Verify Config Chain
```bash
# Create verification script
cat > scripts/verify-tsconfig-chain.js << 'EOF'
const fs = require('fs');
const path = require('path');

function checkTsConfig(filePath, indent = 0) {
  if (!fs.existsSync(filePath)) {
    console.log(' '.repeat(indent) + `❌ Missing: ${filePath}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(content);
    
    console.log(' '.repeat(indent) + `📄 ${filePath}`);
    
    if (config.extends) {
      console.log(' '.repeat(indent + 2) + `└─ extends: ${config.extends}`);
      
      // Try to resolve the extended config
      if (config.extends.startsWith('@codexcrm/config/')) {
        const configPath = config.extends.replace('@codexcrm/config/', 'packages/config/');
        checkTsConfig(configPath + '.json', indent + 4);
      }
    }
  } catch (e) {
    console.log(' '.repeat(indent) + `❌ Error reading: ${filePath}`);
  }
}

console.log('TypeScript Config Chain:\n');
checkTsConfig('tsconfig.base.json');
console.log('\nApp configs:');
checkTsConfig('apps/web/tsconfig.json');
console.log('\nPackage configs:');
['api', 'auth', 'database', 'ui', 'background-jobs'].forEach(pkg => {
  checkTsConfig(`packages/${pkg}/tsconfig.json`);
});
EOF

# Run verification
node scripts/verify-tsconfig-chain.js
```

### 5. Test Build
```bash
# Ensure all TypeScript still compiles
pnpm tsc --noEmit

# Document the hierarchy
cat > CONFIG_HIERARCHY.md << 'EOF'
# Configuration Hierarchy

## TypeScript Configuration Chain

1. **Source of Truth**: `packages/config/typescript/base.json`
   - Core TypeScript settings
   - Strict mode, module resolution, etc.

2. **Root Extension**: `tsconfig.base.json`
   - Extends: `@codexcrm/config/typescript/base`
   - Adds: Monorepo path mappings

3. **App Configs**:
   - `apps/web/tsconfig.json`
     - Extends: `@codexcrm/config/typescript/nextjs`
     - Adds: App-specific paths (@/components, etc.)

4. **Package Configs**:
   - `packages/*/tsconfig.json`
     - Extends: `@codexcrm/config/typescript/base` (or react-library for UI)
     - Adds: Package-specific paths

## Benefits
- Single source of truth for compiler options
- Consistent settings across all packages
- Easy to update TypeScript settings globally
- Each package can still customize as needed
EOF
```

## Validation:
- [ ] Root tsconfig extends from packages/config
- [ ] All package tsconfigs updated
- [ ] TypeScript compiles without errors
- [ ] Config hierarchy documented
- [ ] No circular dependencies

## Common Issues & Fixes:

1. **Module not found errors**:
   ```bash
   # Ensure packages/config is in node_modules
   pnpm install
   ```

2. **Path resolution issues**:
   - Keep paths in root tsconfig.base.json
   - Don't duplicate paths in child configs

3. **Build errors**:
   - Check that extends paths are correct
   - Verify @codexcrm/config is properly linked