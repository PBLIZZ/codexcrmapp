# ESLint Fixes Guide for CodexCRM

This guide provides a systematic approach to fix the remaining ESLint issues in the CodexCRM project. We've already set up the ESLint flat configuration and fixed many issues, but some still remain.

## Overview of Remaining Issues

The remaining issues fall into these categories:

1. **Unused Variables** (prefix with underscore `_` or remove)
2. **Console Statements** (replace `console.log` with `console.warn` or `console.error`)
3. **Import Order** (fix the order of imports according to the rules)
4. **Any Types** (replace with proper TypeScript types)
5. **Unreachable Code** (remove or fix code that can't be reached)

## Fixing Strategies

### 1. Unused Variables

For any unused variables, either:
- Prefix them with an underscore (`_`) to indicate they're intentionally unused
- Remove them if they're not needed

Example:
```typescript
// Before
function example(unusedParam) {
  const unusedVar = 'test';
  return 'result';
}

// After
function example(_unusedParam) {
  // Remove the unused variable
  return 'result';
}
```

### 2. Console Statements

Replace all `console.log` statements with either:
- `console.warn` for warnings and informational messages
- `console.error` for error messages

Example:
```typescript
// Before
console.log('User logged in');

// After
console.warn('User logged in');
```

### 3. Import Order

The import order rule requires imports to be grouped and ordered as follows:
1. Built-in Node.js modules
2. External modules (npm packages)
3. Internal modules (using path aliases like `@codexcrm/*`)
4. Local modules (relative imports)

Each group should be separated by an empty line.

### 4. Any Types

Replace `any` types with more specific TypeScript types:
- Use `unknown` if you truly don't know the type
- Use `Record<string, unknown>` for objects with unknown properties
- Create interfaces or type aliases for complex objects

Example:
```typescript
// Before
function processData(data: any) {
  return data.value;
}

// After
function processData(data: { value: string }) {
  return data.value;
}
```

### 5. Unreachable Code

Remove or fix code that can't be reached:
```typescript
// Before
function example() {
  return 'result';
  console.log('This will never run');
}

// After
function example() {
  return 'result';
}
```

## Files That Need Attention

### High Priority (Errors)

1. `/Users/peterjamesblizzard/projects/app_codexcrmapp/next.config.js`
   - Fix require() style import

2. `/Users/peterjamesblizzard/projects/app_codexcrmapp/pages/api/sentry-example-api.js`
   - Fix unreachable code

### Medium Priority (Warnings in Core Code)

1. `/Users/peterjamesblizzard/projects/app_codexcrmapp/apps/web/lib/supabase/server.ts`
   - Fix unused 'error' variables

2. `/Users/peterjamesblizzard/projects/app_codexcrmapp/apps/web/middleware.ts`
   - Fix unused 'session' variable
   - Fix console statements

3. `/Users/peterjamesblizzard/projects/app_codexcrmapp/packages/server/src/context.ts`
   - Fix remaining console statement

4. `/Users/peterjamesblizzard/projects/app_codexcrmapp/packages/server/src/routers/client.ts` and `contact.ts`
   - Fix unused 'supabaseAdmin' import
   - Fix remaining console statements

### Low Priority (Warnings in Utility Scripts)

1. Fix ESLint issues in the ESLint fix scripts themselves
   - `/Users/peterjamesblizzard/projects/app_codexcrmapp/scripts/eslint-fix-all.js`
   - `/Users/peterjamesblizzard/projects/app_codexcrmapp/scripts/fix-eslint-staged.js`
   - `/Users/peterjamesblizzard/projects/app_codexcrmapp/scripts/fix-eslint.js`

## Automated Approach

You can use the following command to fix a specific file:

```bash
pnpm eslint --fix path/to/file.ts
```

For example:
```bash
pnpm eslint --fix apps/web/lib/supabase/server.ts
```

## Tracking Progress

After fixing issues in a file, run:

```bash
pnpm eslint --max-warnings=0 path/to/file.ts
```

This will ensure the file has no remaining ESLint issues.

## Final Verification

Once you've fixed all the issues, run:

```bash
pnpm eslint --max-warnings=0 .
```

This will verify that all ESLint issues have been resolved across the entire codebase.
