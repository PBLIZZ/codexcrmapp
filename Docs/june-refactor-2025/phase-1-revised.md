# Phase 1 REVISED: Document & Stabilize Existing Monorepo

**Timeline**: Day 1 (3-4 hours)  
**Date**: 2025-06-23
**Focus**: Document working configs, analyze structure, prepare for safe refactor  
**Critical**: You already have a monorepo! We need to preserve what works.

---

## Task 101: Create Configuration Recovery File

**Priority**: CRITICAL  
**Dependencies**: Phase 0 complete  
**Duration**: 45 minutes  
**Description**: Document ALL working configuration files before any changes

### Implementation Steps:

````bash
# 1. Create config recovery directory
mkdir -p .recovery/configs
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 2. Create master recovery script
cat > .recovery/WORKING_CONFIGS_${TIMESTAMP}.md << 'EOF'
# Working Configuration Recovery File
Created: $(date)
Purpose: Preserve all working configs before refactor

## Critical Config Files to Preserve

### Root Level Configs
EOF

# 3. Copy and document root configs
for file in .prettierrc* tsconfig*.json next.config.* tailwind.config.* postcss.config.* turbo.json pnpm-workspace.yaml .npmrc package.json; do
  if [ -f "$file" ]; then
    echo "### $file" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
    echo '```' >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
    cat "$file" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
    echo '```' >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
    echo "" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
    cp "$file" ".recovery/configs/${file}.backup"
  fi
done

# 4. Document app configs
echo "## App Configurations" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
for app in apps/*; do
  if [ -d "$app" ]; then
    echo "### $app" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
    for config in $app/{package.json,tsconfig*.json,next.config.*,components.json,.eslintrc*,tailwind.config.*}; do
      if [ -f "$config" ]; then
        echo "#### $config" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
        echo '```' >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
        cat "$config" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
        echo '```' >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
      fi
    done
  fi
done

# 5. Document package configs
echo "## Package Configurations" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
for pkg in packages/*; do
  if [ -d "$pkg" ]; then
    echo "### $pkg" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
    for config in $pkg/{package.json,tsconfig*.json,tsup.config.*,components.json}; do
      if [ -f "$config" ]; then
        echo "#### $config" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
        echo '```' >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
        cat "$config" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
        echo '```' >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
      fi
    done
  fi
done

# 6. Document MCP configs
echo "## MCP Configurations" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
find . -name "mcp*.json" -type f | while read mcp; do
  echo "### $mcp" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
  echo '```' >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
  cat "$mcp" >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
  echo '```' >> .recovery/WORKING_CONFIGS_${TIMESTAMP}.md
done

# 7. Create quick recovery script
cat > .recovery/restore-configs.sh << 'EOF'
#!/bin/bash
# Emergency config restoration
echo "Restoring configs from .recovery/configs/"
for file in .recovery/configs/*.backup; do
  original="${file%.backup}"
  original="${original##*/}"
  cp "$file" "$original"
  echo "Restored: $original"
done
EOF
chmod +x .recovery/restore-configs.sh
````

### Validation:

- [ ] Recovery file created with all configs
- [ ] Backup copies in .recovery/configs/
- [ ] Restore script executable
- [ ] No configs missed (check file size > 10KB)

---

## Task 102: Analyze Current Package Structure

**Priority**: HIGH  
**Dependencies**: [101]  
**Duration**: 30 minutes  
**Description**: Map existing packages and their dependencies

### Implementation Steps:

````bash
# 1. Create structure analysis
cat > MONOREPO_ANALYSIS.md << 'EOF'
# Current Monorepo Structure Analysis
Date: $(date)

## Package Inventory
EOF

# 2. Analyze each package
for pkg in packages/*; do
  if [ -f "$pkg/package.json" ]; then
    pkgname=$(jq -r .name "$pkg/package.json")
    echo "### $pkgname" >> MONOREPO_ANALYSIS.md
    echo "Path: $pkg" >> MONOREPO_ANALYSIS.md
    echo "Dependencies:" >> MONOREPO_ANALYSIS.md
    jq -r '.dependencies // {} | keys[]' "$pkg/package.json" | grep "@codexcrm" | sed 's/^/  - /' >> MONOREPO_ANALYSIS.md
    echo "" >> MONOREPO_ANALYSIS.md
  fi
done

# 3. Create dependency graph
cat >> MONOREPO_ANALYSIS.md << 'EOF'

## Dependency Graph
```mermaid
graph TD
  web[apps/web]
  auth[packages/auth]
  config[packages/config]
  db[packages/db]
  server[packages/server]
  ui[packages/ui]

  web --> server
  web --> ui
  web --> auth
  server --> db
  server --> auth
  ui --> config
````

## Issues to Address

1. Relative path imports (../../ patterns)
2. Package naming (db vs database)
3. Shared configs not in config package
4. UI components scattered

## Migration Priorities

1. Consolidate configs into packages/config
2. Standardize package names
3. Fix import paths
4. Extract more UI components
   EOF

# 4. Find all relative imports

echo "## Relative Import Audit" >> MONOREPO_ANALYSIS.md
echo '`' >> MONOREPO_ANALYSIS.md
grep -r "from ['\"]\.\./" apps packages --include="*.ts" --include="*.tsx" | head -20 >> MONOREPO_ANALYSIS.md
echo '`' >> MONOREPO_ANALYSIS.md

````

### Validation:
- [ ] Analysis file created
- [ ] All packages documented
- [ ] Dependency graph accurate
- [ ] Issues list comprehensive

---

## Task 103: Standardize Package Names
**Priority**: MEDIUM
**Dependencies**: [102]
**Duration**: 20 minutes
**Description**: Create mapping for package renames without breaking imports

### Implementation Steps:
```bash
# 1. Create rename mapping
cat > PACKAGE_RENAME_PLAN.md << 'EOF'
# Package Rename Plan

## Proposed Renames
| Current | New | Reason |
|---------|-----|--------|
| packages/db | packages/database | Match PRD naming |
| packages/server | packages/api | Match PRD, clearer purpose |
| packages/auth | (keep) | Already good |
| packages/config | (keep) | Already good |
| packages/ui | (keep) | Already good |
| packages/jobs | packages/background-jobs | More descriptive |

## Import Updates Required
- @codexcrm/db → @codexcrm/database
- @codexcrm/server → @codexcrm/api

## Implementation Order
1. Update package.json names
2. Update all imports
3. Update tsconfig paths
4. Rename directories
EOF

# 2. Find all imports that need updating
echo "## Current Import Usage" >> PACKAGE_RENAME_PLAN.md
echo '```bash' >> PACKAGE_RENAME_PLAN.md
grep -r "@codexcrm/db" apps packages --include="*.ts" --include="*.tsx" | wc -l
echo "imports of @codexcrm/db found" >> PACKAGE_RENAME_PLAN.md
grep -r "@codexcrm/server" apps packages --include="*.ts" --include="*.tsx" | wc -l
echo "imports of @codexcrm/server found" >> PACKAGE_RENAME_PLAN.md
echo '```' >> PACKAGE_RENAME_PLAN.md
````

### Validation:

- [ ] Rename plan created
- [ ] Import counts documented
- [ ] No breaking renames proposed

---

## Task 104: Create Shared Config Structure

**Priority**: HIGH  
**Dependencies**: [101, 102]  
**Duration**: 25 minutes  
**Description**: Consolidate configs into packages/config

### Implementation Steps:

```bash
# 1. Create config subdirectories
mkdir -p packages/config/{typescript,eslint,prettier,tailwind}

# 2. Create TypeScript configs
cat > packages/config/typescript/base.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Base TypeScript Config",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowJs": true,
    "incremental": true
  }
}
EOF

cat > packages/config/typescript/nextjs.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Next.js TypeScript Config",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "jsx": "preserve",
    "plugins": [{"name": "next"}]
  }
}
EOF

cat > packages/config/typescript/react-library.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "React Library TypeScript Config",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["DOM", "ES2022"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true
  }
}
EOF

# 3. Move existing prettier config
if [ -f ".prettierrc" ]; then
  cp .prettierrc packages/config/prettier/index.json
fi

# 4. Create unified export
cat > packages/config/package.json << 'EOF'
{
  "name": "@codexcrm/config",
  "version": "1.0.0",
  "private": true,
  "exports": {
    "./typescript/base": "./typescript/base.json",
    "./typescript/nextjs": "./typescript/nextjs.json",
    "./typescript/react-library": "./typescript/react-library.json",
    "./prettier": "./prettier/index.json",
    "./eslint": "./eslint/index.js",
    "./tailwind": "./tailwind/index.js"
  }
}
EOF
```

### Validation:

- [ ] Config structure created
- [ ] Existing configs preserved
- [ ] Exports properly defined

---

## Task 105: Fix Critical Import Paths

**Priority**: HIGH  
**Dependencies**: [104]  
**Duration**: 30 minutes  
**Description**: Replace relative imports with workspace imports

### Implementation Steps:

```bash
# 1. Create import fix script
cat > scripts/fix-imports.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Map of relative imports to workspace imports
const importMap = {
  '../../../packages/ui': '@codexcrm/ui',
  '../../../packages/db': '@codexcrm/database',
  '../../../packages/auth': '@codexcrm/auth',
  '../../../packages/server': '@codexcrm/api',
  '../../packages/ui': '@codexcrm/ui',
  '../../packages/db': '@codexcrm/database',
  '../../packages/auth': '@codexcrm/auth',
  '../../packages/server': '@codexcrm/api'
};

// Function to fix imports in a file
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [relative, workspace] of Object.entries(importMap)) {
    const regex = new RegExp(`from ['"]${relative.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `from '${workspace}`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports in: ${filePath}`);
  }
}

// Process all TypeScript files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      processDirectory(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fixImports(fullPath);
    }
  });
}

// Run on apps and packages
processDirectory('./apps');
processDirectory('./packages');
EOF

# 2. Create backup before running
cp -r apps apps.backup.imports
cp -r packages packages.backup.imports

# 3. Document changes
echo "## Import Path Fixes" >> REFACTOR_CHANGELOG.md
echo "Backup created: apps.backup.imports, packages.backup.imports" >> REFACTOR_CHANGELOG.md
```

### Validation:

- [ ] Import fix script created
- [ ] Backups created
- [ ] Ready to run (but not executed yet)

---

## Task 106: Create Phase 1 Completion Report

**Priority**: HIGH  
**Dependencies**: [101-105]  
**Duration**: 15 minutes  
**Description**: Verify monorepo is stable and ready for refactor

### Implementation Steps:

````bash
# 1. Run verification checks
cat > PHASE_1_REVISED_COMPLETE.md << 'EOF'
# Phase 1 (Revised) Completion Report
Date: $(date)
Status: Ready for Refactor

## Documentation Complete ✓
- [x] All configs backed up in .recovery/
- [x] Package structure analyzed
- [x] Dependency graph created
- [x] Import issues identified

## Current State
- Packages: auth, config, db, server, ui, jobs
- Apps: web (and any others)
- Known issues documented
- Recovery plan in place

## Ready for Next Phase
### Can now safely:
1. Rename packages (db → database, server → api)
2. Fix import paths
3. Consolidate shared configs
4. Update to latest Supabase SSR patterns

### Still Working:
- [ ] OAuth flow
- [ ] All existing routes
- [ ] Current UI components
- [ ] Database connections

## Recovery Commands
```bash
# If anything breaks:
./recovery/restore-configs.sh
rm -rf apps && mv apps.backup.imports apps
rm -rf packages && mv packages.backup.imports packages
````

EOF

# 2. Test current state

echo "## Current State Test" >> PHASE_1_REVISED_COMPLETE.md
pnpm --filter "@codexcrm/\*" ls --depth 0 >> PHASE_1_REVISED_COMPLETE.md

```

### Validation:
- [ ] All existing functionality still works
- [ ] Recovery plan tested
- [ ] Team ready to proceed
- [ ] No uncommitted changes

---

## Key Differences from Original Phase 1

1. **Preserve Existing Structure**: You already have a monorepo!
2. **Document First**: Capture all working configs before touching anything
3. **Analyze Dependencies**: Understand the current setup
4. **Plan Renames**: Map out changes without breaking things
5. **Fix Imports Safely**: Script to update paths systematically

## Next Steps

With Phase 1 Revised complete, you're ready to:
1. Execute the package renames (Task 103)
2. Run the import fix script (Task 105)
3. Move to Phase 2: Auth Modernization

The key insight is that you need a surgical approach that preserves your working setup while gradually improving it.
```
