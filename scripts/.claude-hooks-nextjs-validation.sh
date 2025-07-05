#!/bin/bash

# Next.js Validation Hook
# Validates Next.js specific patterns and route structures

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Check for Next.js app directory structure
if [[ "$file_path" =~ /app/.* ]]; then
    echo "🔍 Validating Next.js App Router structure..." >&2
    
    # Check for valid Next.js file naming
    if [[ "$file_path" =~ \.(page|layout|loading|error|not-found|route|middleware)\.(ts|tsx|js|jsx)$ ]]; then
        echo "✅ Valid Next.js App Router file: $file_path" >&2
    elif [[ "$file_path" =~ /app/.*\.(ts|tsx|js|jsx)$ ]]; then
        echo "⚠️  Warning: File in app directory doesn't follow Next.js naming conventions" >&2
        echo "Consider using page.tsx, layout.tsx, loading.tsx, error.tsx, or route.tsx" >&2
    fi
fi

# Run Next.js linting if available
if [[ "$file_path" =~ \.(ts|tsx|js|jsx)$ ]] && command -v npx &> /dev/null; then
    if [ -f "next.config.js" ] || [ -f "next.config.mjs" ]; then
        npx next lint --file "$file_path" 2>&1
        next_lint_exit_code=$?
        
        if [ $next_lint_exit_code -eq 0 ]; then
            echo "✅ Next.js linting passed" >&2
        else
            echo "⚠️  Next.js linting issues found" >&2
        fi
    fi
fi

exit 0
