#!/bin/bash

# tRPC Validation Hook
# Ensures tRPC router and procedure patterns are followed

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
content=$(echo "$input" | jq -r '.tool_input.content // empty')

# Check for tRPC router files
if [[ "$file_path" =~ (router|trpc).*\.(ts|tsx)$ ]]; then
    echo "🔍 Validating tRPC patterns..." >&2
    
    # Check for proper tRPC imports
    if [[ "$content" =~ import.*@trpc/server ]]; then
        echo "✅ tRPC server imports found" >&2
    else
        echo "⚠️  Consider importing from @trpc/server for router definitions" >&2
    fi
    
    # Check for proper procedure definitions
    if [[ "$content" =~ \.(query|mutation|subscription)\( ]]; then
        echo "✅ tRPC procedures properly defined" >&2
    fi
    
    # Validate input/output schemas
    if [[ "$content" =~ \.input\(.*z\. ]]; then
        echo "✅ Input validation with Zod found" >&2
    elif [[ "$content" =~ \.(query|mutation)\( ]]; then
        echo "⚠️  Consider adding input validation with Zod schemas" >&2
    fi
fi

exit 0
