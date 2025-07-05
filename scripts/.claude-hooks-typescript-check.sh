#!/bin/bash

# TypeScript Type Checking Hook
# Validates types after TypeScript file modifications

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Only run on TypeScript files
if [[ "$file_path" =~ \.(ts|tsx)$ ]]; then
    echo "🔍 Running TypeScript type check..." >&2
    
    if command -v npx &> /dev/null; then
        # Run TypeScript compiler in no-emit mode
        npx tsc --noEmit --skipLibCheck 2>&1
        tsc_exit_code=$?
        
        if [ $tsc_exit_code -eq 0 ]; then
            echo "✅ TypeScript type check passed" >&2
        else
            echo "❌ TypeScript type errors found" >&2
            # Output JSON to provide feedback to Claude
            cat << EOF
{
  "decision": "block",
  "reason": "TypeScript type errors detected. Please review and fix the type issues shown above before proceeding."
}
EOF
            exit 0
        fi
    else
        echo "⚠️  TypeScript not found. Install with: npm install -g typescript" >&2
    fi
fi

exit 0
