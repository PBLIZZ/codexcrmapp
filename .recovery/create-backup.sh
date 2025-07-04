#!/bin/bash
# Configuration Backup Script
# Created for CodexCRM Task 101
# Purpose: Document and backup all working configuration files before refactoring

# Set up variables
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RECOVERY_FILE=".recovery/WORKING_CONFIGS_${TIMESTAMP}.md"

# Start with header (if file doesn't exist yet)
if [ ! -f "$RECOVERY_FILE" ]; then
  cat > "$RECOVERY_FILE" << 'EOF'
# Working Configuration Recovery File
Created: $(date)
Purpose: Preserve all working configs before refactor

## Critical Config Files to Preserve

### Root Level Configs
EOF
fi

# 3. Copy and document root configs
for file in .prettierrc* tsconfig*.json next.config.* tailwind.config.* postcss.config.* \
  turbo.json pnpm-workspace.yaml .npmrc package.json eslint.config.js components.json; do
  if [ -f "$file" ]; then
    echo "Backing up: $file"
    echo "### $file" >> "$RECOVERY_FILE"
    echo '```' >> "$RECOVERY_FILE"
    cat "$file" >> "$RECOVERY_FILE"
    echo '```' >> "$RECOVERY_FILE"
    echo "" >> "$RECOVERY_FILE"
    cp "$file" ".recovery/configs/${file}.backup"
  fi
done

# 4. Document app configs
echo "## App Configurations" >> "$RECOVERY_FILE"
for app in apps/*; do
  if [ -d "$app" ]; then
    echo "### $app" >> "$RECOVERY_FILE"
    for config in $app/{package.json,tsconfig*.json,next.config.*,components.json,.eslintrc*,tailwind.config.*}; do
      if [ -f "$config" ]; then
        echo "Backing up: $config"
        echo "#### $config" >> "$RECOVERY_FILE"
        echo '```' >> "$RECOVERY_FILE"
        cat "$config" >> "$RECOVERY_FILE"
        echo '```' >> "$RECOVERY_FILE"
        echo "" >> "$RECOVERY_FILE"
        mkdir -p ".recovery/configs/$(dirname $config)"
        cp "$config" ".recovery/configs/${config}.backup"
      fi
    done
  fi
done

# 5. Document package configs
echo "## Package Configurations" >> "$RECOVERY_FILE"
for pkg in packages/*; do
  if [ -d "$pkg" ]; then
    echo "### $pkg" >> "$RECOVERY_FILE"
    for config in $pkg/{package.json,tsconfig*.json,tsup.config.*,components.json}; do
      if [ -f "$config" ]; then
        echo "Backing up: $config"
        echo "#### $config" >> "$RECOVERY_FILE"
        echo '```' >> "$RECOVERY_FILE"
        cat "$config" >> "$RECOVERY_FILE"
        echo '```' >> "$RECOVERY_FILE"
        echo "" >> "$RECOVERY_FILE"
        mkdir -p ".recovery/configs/$(dirname $config)"
        cp "$config" ".recovery/configs/${config}.backup"
      fi
    done
  fi
done

# 6. Document MCP configs
echo "## MCP Configurations" >> "$RECOVERY_FILE"
find . -name "mcp*.json" -type f | while read mcp; do
  echo "Backing up: $mcp"
  echo "### $mcp" >> "$RECOVERY_FILE"
  echo '```' >> "$RECOVERY_FILE"
  cat "$mcp" >> "$RECOVERY_FILE"
  echo '```' >> "$RECOVERY_FILE"
  echo "" >> "$RECOVERY_FILE"
  mkdir -p ".recovery/configs/$(dirname $mcp)"
  cp "$mcp" ".recovery/configs/${mcp}.backup"
done

# Check file size to ensure we've captured all configs
FILESIZE=$(stat -f%z "$RECOVERY_FILE")
echo "Configuration backup complete."
echo "Recovery file created at $RECOVERY_FILE (size: $FILESIZE bytes)"

if [ "$FILESIZE" -lt 10240 ]; then
  echo "WARNING: Recovery file is smaller than expected (< 10KB). Some configs may be missing."
else
  echo "SUCCESS: Recovery file size check passed (> 10KB)."
fi