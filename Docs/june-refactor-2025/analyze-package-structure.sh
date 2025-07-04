#!/bin/bash
# CodexCRM Monorepo Analysis Script
# Created for Task 102: Analyze Current Package Structure
# Description: Maps existing packages and their dependencies

# 1. Create structure analysis in ./Docs/june-refactor-2025
cat > ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md << 'EOF'
# Current Monorepo Structure Analysis
Date: $(date)

## Package Inventory
EOF

# 2. Analyze each package
for pkg in packages/*; do
  if [ -f "$pkg/package.json" ]; then
    pkgname=$(jq -r .name "$pkg/package.json")
    echo "### $pkgname" >> ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md
    echo "Path: $pkg" >> ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md
    echo "Dependencies:" >> ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md
    jq -r '.dependencies // {} | keys[]' "$pkg/package.json" | grep "@codexcrm" | sed 's/^/  - /' >> ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md
    echo "" >> ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md
  fi
done

# 3. Create dependency graph
cat >> ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md << 'EOF'

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
```

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
echo "## Relative Import Audit" >> ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md
echo '```' >> ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md
grep -r "from ['\"]\.\./" apps packages --include="*.ts" --include="*.tsx" | head -20 >> ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md
echo '```' >> ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md

echo "Package structure analysis complete - see ./Docs/june-refactor-2025/MONOREPO_ANALYSIS.md"