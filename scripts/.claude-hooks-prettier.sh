#!/bin/bash

# Prettier Hook - Formats files after edits
# Supports all common file types in the tech stack

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Only run on Edit, Write, or MultiEdit tools
if [[ "$tool_name" != "Edit" && "$tool_name" != "Write" && "$tool_name" != "MultiEdit" ]]; then
    exit 0
fi

# Check if file should be formatted
if [[ "$file_path" =~ \.(ts|tsx|js|jsx|json|css|scss|md|yaml|yml|html)$ ]]; then
    echo "💅 Running Prettier on: $file_path" >&2
    
    if command -v npx &> /dev/null; then
        npx prettier --write "$file_path" 2>&1
        prettier_exit_code=$?
        
        if [ $prettier_exit_code -eq 0 ]; then
            echo "✅ Prettier formatting completed for $file_path" >&2
        else
            echo "⚠️  Prettier formatting failed for $file_path" >&2
        fi
    else
        echo "⚠️  Prettier not found. Install with: npm install -g prettier" >&2
    fi
fi

exit 0
