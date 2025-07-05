#!/bin/bash

# JSON/Config File Protection Hook
# Prevents Claude from modifying critical configuration files

# Read JSON input from stdin
input=$(cat)

# Extract file path from the input
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Define protected files patterns
protected_patterns=(
    "package.json"
    "package-lock.json"
    "yarn.lock"
    "pnpm-lock.yaml"
    "tsconfig.json"
    "tsconfig.*.json"
    "next.config.js"
    "next.config.mjs"
    "tailwind.config.js"
    "tailwind.config.ts"
    ".eslintrc*"
    "eslint.config.*"
    "prettier.config.*"
    ".prettierrc*"
    ".env*"
    "supabase/config.toml"
    "supabase/seed.sql"
    "drizzle.config.ts"
    "vite.config.*"
    "turbo.json"
    "nx.json"
    "jest.config.*"
    "playwright.config.*"
    "docker-compose.yml"
    "Dockerfile"
    ".gitignore"
    ".github/workflows/*"
)

# Check if file matches any protected pattern
for pattern in "${protected_patterns[@]}"; do
    if [[ "$file_path" == *"$pattern"* ]]; then
        echo "🚫 BLOCKED: Cannot modify protected configuration file: $file_path" >&2
        echo "This file contains complex configurations that are working correctly." >&2
        echo "Please make manual changes if modifications are truly needed." >&2
        exit 2  # Exit code 2 blocks the operation and shows feedback to Claude
    fi
done

# Allow operation to proceed
exit 0
