# ESLint Cleanup Guide for CodexCRM

This guide outlines a systematic approach to fixing ESLint issues in the CodexCRM codebase. By following these steps, you'll efficiently clean up the codebase while ensuring that no new issues are introduced.

## Quick Start

I've created an interactive script to help you implement this strategy:

```bash
node scripts/eslint-cleanup.js
```

This script will guide you through each step of the process, providing recommendations and automating where possible.

## The Systematic Approach

### 1. Take Stock

First, get a clear picture of all ESLint issues in the codebase:

```bash
npx eslint . --ext .ts,.tsx -f table | sort
```

This will reveal that most failures fall into a few categories (typically `@typescript-eslint/no-unused-vars`, `@typescript-eslint/no-explicit-any`, and `no-console`).

### 2. Batch-fix the "Easy" Rules

#### a. Unused Imports / Variables (`no-unused-vars`)

Automatically fix truly unused imports and variables:

```bash
npx eslint . --ext .ts,.tsx --rule '{"@typescript-eslint/no-unused-vars": ["error", {"vars":"all","args":"after-used"}]}' --fix
```

For variables that will be used soon or are intentional placeholders, prefix them with an underscore:

```typescript
// Before
import { TRPCClientError } from "@trpc/client";

// After
import { TRPCClientError as _TRPCClientError } from "@trpc/client";
```

#### b. Missing Return Types (`explicit-function-return-type`)

Run the codemod supplied by typescript-eslint:

```bash
npx tsx node_modules/@typescript-eslint/utils/dist/ast-utils/explicitReturnType.js
```

This will insert return types like `: void`, `: Promise<...>`, etc. where they're obvious.

### 3. Tackle the "no-explicit-any" Problem

You have two good options for handling `any` types:

#### Option 1: Replace `any` with a Real Type

- **Effort**: Medium
- **Upside**: 100% type-safety
- **How**: Define proper interfaces (e.g., `GroupSettings`) and refactor.

#### Option 2: Use `unknown` + Narrowing

- **Effort**: Low
- **Upside**: Keeps rule green, still type-safe
- **How**: Change `any` → `unknown` and narrow when reading: `if ("color" in settings) ...`

**Important**: Do not add `// eslint-disable-next-line ...` unless the code is truly untypable (rare).

### 4. Add a Temporary CI Guardrail

While the cleanup is in progress, fail CI only on new problems:

1. Create a `legacy-linted` directory
2. Move existing files there
3. Update your ESLint config to ignore the `legacy-linted` directory:

```javascript
// In eslint.config.js
export default [
  // ... existing config
  {
    ignores: [
      // ... existing ignores
      'legacy-linted/**',
    ],
  },
];
```

4. Create a new `src` directory
5. Move fixed files back to `src` as they're cleaned up

### 5. Automate Fixes on Each Commit

```bash
pnpm add -D lint-staged husky
```

Add to your package.json:

```json
{
  "husky": { 
    "hooks": { 
      "pre-commit": "lint-staged" 
    } 
  },
  "lint-staged": {
    "*.{ts,tsx}": "eslint --max-warnings 0 --fix"
  }
}
```

This ensures no new ESLint issues are introduced.

### 6. Future-proof with Strict TypeScript Settings

Once the baseline is zero, consider turning on these compiler flags for extra safety:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

Expect a small second wave of ESLint/TS errors; they're worth fixing.

## Recap

1. Autofix low-hanging fruit (no-unused-vars, missing return types)
2. Replace/refactor any lingering `any`s
3. Move clean files into a "green" folder so CI only fails on new issues
4. Enforce pre-commit linting so the problem never balloons again
5. Gradually tighten TS compiler flags once the slate is clean

By following this systematic approach, you'll efficiently clean up your codebase while ensuring that no new issues are introduced.
