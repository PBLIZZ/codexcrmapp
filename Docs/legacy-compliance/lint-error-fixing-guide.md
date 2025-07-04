# TypeScript Lint Error Fixing Guide

**Version**: 1.0  
**Created**: June 19, 2025  
**Last Updated**: June 19, 2025

## Overview

This guide provides a systematic approach to fixing TypeScript ESLint errors in the CodexCRM application. Follow this process to ensure consistent, high-quality code that passes all lint checks.

## Prerequisites

- ESLint configured with TypeScript rules
- Access to the project's lint compliance tracking document
- Understanding of TypeScript type safety principles

## Step-by-Step Process

### 1. Identify Files with Lint Errors

```bash
# Run ESLint on specific files to identify errors
npx eslint path/to/file.tsx --no-fix

# Or run on multiple files
npx eslint apps/web/app/contacts/*.tsx --no-fix
```

**Expected Output**: List of files with specific error types and line numbers.

### 2. Create Task Tracking

Create a todo list to track your progress:

```markdown
1. Fix lint errors in [FileName.tsx] ([error types])
2. Fix lint errors in [FileName2.tsx] ([error types])  
3. Run ESLint verification on fixed files
4. Update compliance tracking document
```

### 3. Fix Common Error Types

#### A. Nullish Coalescing (`@typescript-eslint/prefer-nullish-coalescing`)

**Problem**: Using `||` instead of `??`
```typescript
// ❌ Incorrect
const value = formData.field || '';
const url = process.env.URL || 'default';

// ✅ Correct  
const value = formData.field ?? '';
const url = process.env.URL ?? 'default';
```

**Fix Strategy**: Replace all `||` with `??` for safer null/undefined handling.

#### B. Floating Promises (`@typescript-eslint/no-floating-promises`)

**Problem**: Promise-returning functions not properly handled
```typescript
// ❌ Incorrect
utils.contacts.list.invalidate();
checkConnectivity();

// ✅ Correct
void utils.contacts.list.invalidate();
void checkConnectivity();
```

**Fix Strategy**: Wrap with `void` when you intentionally ignore the Promise result.

#### C. Promise in Event Handlers (`@typescript-eslint/no-misused-promises`)

**Problem**: Async functions in event handlers
```typescript
// ❌ Incorrect
<form onSubmit={handleSubmit}>

// ✅ Correct
<form onSubmit={(e) => void handleSubmit(e)}>
```

**Fix Strategy**: Wrap async calls with `void` in event handlers.

#### D. Unsafe Any Usage (`@typescript-eslint/no-unsafe-*`)

**Problem**: Using `any` types or destructuring API responses with `any`
```typescript
// ❌ Incorrect - Destructuring with any
const { data: items, error } = api.items.list.useQuery();

// ✅ Correct - Separate query and type assertion
const itemsQuery = api.items.list.useQuery();
const items = itemsQuery.data as Item[] | undefined;
const error = itemsQuery.error;
```

**Fix Strategy**: 
- Avoid destructuring API responses directly
- Use type assertions (`as Type`) instead of `any`
- Create proper interfaces for expected data shapes

#### E. Escaped Entities (`react/no-unescaped-entities`)

**Problem**: Unescaped apostrophes in JSX
```typescript
// ❌ Incorrect
Don't have an account?

// ✅ Correct
Don&apos;t have an account?
```

#### F. Variable Shadowing (`@typescript-eslint/no-shadow`)

**Problem**: Reusing variable names in nested scopes
```typescript
// ❌ Incorrect
const error = 'outer';
try {
  // ...
} catch (error) { // shadows outer error
  console.log(error);
}

// ✅ Correct
const error = 'outer';
try {
  // ...
} catch (catchError) {
  console.log(catchError);
}
```

#### G. Unsafe Function Calls (`@typescript-eslint/no-unsafe-call`)

**Problem**: Calling functions that TypeScript detects might have error types
```typescript
// ❌ Incorrect - TypeScript sees requireAuth as potentially error-typed
await requireAuth();

// ✅ Correct - Type assertion to handle error-typed functions safely
await (requireAuth as () => Promise<unknown>)();
```

**Fix Strategy**: 
- Use type assertion to cast error-typed functions to `Promise<unknown>`
- Add clear comments explaining the function's purpose
- This is common with auth functions that handle redirects internally

### 4. File-Specific Patterns

#### API Response Handling Pattern

```typescript
// Instead of destructuring with any types
const {
  data: responseData,
  isLoading,
  error
} = api.endpoint.useQuery();

// Use this pattern
const queryResult = api.endpoint.useQuery();
const responseData = queryResult.data as ExpectedType[] | undefined;
const isLoading = queryResult.isLoading;
const error = queryResult.error;
```

#### Context Provider Pattern

```typescript
// Safe context value assignment
<Context.Provider value={{ 
  data: data as Type[] | undefined, 
  isLoading, 
  refetch: () => { void refetch(); } 
}}>
```

### 5. Verification Process

After making fixes, you MUST complete BOTH steps before marking as compliant:

#### Step 1: ESLint Verification
```bash
# Test individual files
npx eslint path/to/fixed-file.tsx --no-fix

# Test multiple files at once
npx eslint apps/web/app/contacts/ContactForm.tsx apps/web/app/contacts/ContactGroupManager.tsx --no-fix

# Expected output: No errors (silent success)
```

#### Step 2: Console Error Check
- Check browser console for any runtime errors related to the file
- If you cannot see console errors, **ASK THE USER** to confirm no console errors exist
- Common console errors include:
  - TypeScript compilation errors
  - React component errors
  - Import/export errors
  - Runtime type errors

**CRITICAL**: A file is NOT compliant unless BOTH ESLint shows silent success AND there are no console errors.

### 6. Update Compliance Tracking

Mark files as complete in `lint-compliance-tracking.md`:

```markdown
- [x] `FileName.tsx` ✅
```

## Common Anti-Patterns to Avoid

### ❌ DON'T:
- Use `any` types anywhere in the codebase
- Leave floating promises unhandled
- Use `||` for null/undefined fallbacks
- Destructure API responses directly
- Ignore type safety warnings
- Call error-typed functions without proper type assertions

### ✅ DO:
- Use proper type assertions (`as Type`)
- Handle all Promises with `void` when appropriate
- Use nullish coalescing (`??`) for safe fallbacks
- Type API responses explicitly
- Cast error-typed functions to `Promise<unknown>` when safe
- Follow the project's TypeScript strict mode rules

## Error Priority Levels

1. **High Priority** (Must fix immediately):
   - `no-unsafe-*` errors (type safety)
   - `no-floating-promises` (async handling)
   - `prefer-nullish-coalescing` (logic safety)
   - `no-unsafe-call` (function call safety)

2. **Medium Priority**:
   - `no-misused-promises` (event handlers)
   - `no-shadow` (variable clarity)

3. **Low Priority**:
   - `react/no-unescaped-entities` (HTML compliance)
   - `no-unnecessary-type-assertion` (code cleanup)

## Troubleshooting

### If ESLint Still Shows Errors After Fixes:

1. **Check for missed instances**: Some errors may occur multiple times
2. **Verify type assertions**: Ensure you're casting to the correct types
3. **Check imports**: Make sure all necessary types are imported
4. **Review context**: Some fixes may require understanding the broader code context

### Complex API Type Issues:

```typescript
// If API returns complex types, create interfaces
interface ApiResponse<T> {
  data: T;
  error: Error | null;
  isLoading: boolean;
}

// Then use with type parameters
const response = query as ApiResponse<Item[]>;
```

## Quality Checklist

Before marking a file as complete:

- [ ] All ESLint errors resolved
- [ ] No new TypeScript compilation errors introduced  
- [ ] Code follows project's style guidelines
- [ ] Proper error handling maintained
- [ ] Type safety preserved throughout
- [ ] File verified with `npx eslint --no-fix` (silent success)
- [ ] **No console errors in browser/runtime** (ask user to confirm if unsure)
- [ ] Compliance tracking document updated

## Integration with CLAUDE.md Rules

This process enforces the rules established in `.claude/CLAUDE.md`:

- **NEVER use `any`** - defeats TypeScript's purpose
- **Proper error handling** - use `instanceof Error` checks
- **Type safety first** - always prefer explicit typing
- **ESLint compliance** - no unsafe operations allowed

## References

- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)
- [Project's CLAUDE.md](../.claude/CLAUDE.md)
- [Lint Compliance Tracking](../apps/web/lint-compliance-tracking.md)

---

**Note**: This guide should be updated as new error patterns emerge or when project linting rules change.