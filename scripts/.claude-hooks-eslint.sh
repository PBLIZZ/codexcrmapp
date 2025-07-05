#!/bin/bash

# ESLint Hook - Runs after file edits
# Automatically lints TypeScript/JavaScript files

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Only run on Edit, Write, or MultiEdit tools
if [[ "$tool_name" != "Edit" && "$tool_name" != "Write" && "$tool_name" != "MultiEdit" ]]; then
    exit 0
fi

# Check if file is a TypeScript or JavaScript file
if [[ "$file_path" =~ \.(ts|tsx|js|jsx)$ ]]; then
    echo "🔍 Running ESLint on: $file_path" >&2
    
    # Run ESLint with fix flag
    if command -v npx &> /dev/null; then
        npx eslint --fix "$file_path" 2>&1
        eslint_exit_code=$?
        
        if [ $eslint_exit_code -ne 0 ]; then
            echo "⚠️  ESLint found issues in $file_path" >&2
            echo "Please review and fix the linting errors above." >&2
            # Don't block, just notify
        else
            echo "✅ ESLint passed for $file_path" >&2
        fi
    else
        echo "⚠️  ESLint not found. Install with: npm install -g eslint" >&2
    fi
fi

exit 0
