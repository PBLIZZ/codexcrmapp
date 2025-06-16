#!/bin/bash

# Script to remove .js files that have .ts or .tsx counterparts
# Created for CodexCRM project

echo "Starting cleanup of duplicate .js files..."
echo "This will remove .js files that have matching .ts or .tsx versions"
echo ""

# Find all .js files and check if they have .ts or .tsx counterparts
find /Users/peterjamesblizzard/projects/app_codexcrmapp/apps/web -type f -name "*.js" | while read -r js_file; do
  ts_version="${js_file%.js}.ts"
  tsx_version="${js_file%.js}.tsx"
  
  if [ -f "$ts_version" ] || [ -f "$tsx_version" ]; then
    echo "Removing duplicate: $js_file"
    rm "$js_file"
  fi
done

echo ""
echo "Cleanup complete!"
