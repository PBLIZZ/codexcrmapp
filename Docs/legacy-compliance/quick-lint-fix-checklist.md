# Quick Lint Fix Checklist

**Use this for rapid lint error resolution**

## 🚀 Quick Start Commands

```bash
# 1. Identify errors
npx eslint path/to/file.tsx --no-fix

# 2. After fixes, verify
npx eslint path/to/file.tsx --no-fix

# 3. Success = no output
```

## 🔧 Common Fixes (Copy & Paste Ready)

### Nullish Coalescing
```typescript
// Find: ||
// Replace: ??
value || ''  →  value ?? ''
```

### Floating Promises  
```typescript
// Find: promiseFunction();
// Replace: void promiseFunction();
utils.invalidate();  →  void utils.invalidate();
```

### Event Handler Promises
```typescript
// Find: onSubmit={asyncFunction}
// Replace: onSubmit={(e) => void asyncFunction(e)}
```

### API Response Destructuring
```typescript
// ❌ Replace this pattern:
const { data, error } = api.query.useQuery();

// ✅ With this pattern:
const queryResult = api.query.useQuery();
const data = queryResult.data as Type[] | undefined;
const error = queryResult.error;
```

### Escaped Entities
```typescript
"Don't"  →  "Don&apos;t"
```

## ⚡ Speed Run Process

1. **Run lint** → Identify file + error types
2. **Fix patterns** → Use find/replace for common issues  
3. **Handle any types** → Add proper type assertions
4. **Verify** → Run lint again (should be silent)
5. **Update tracking** → Mark as ✅ in compliance doc

## 🎯 Error Type Quick Reference

| Error | Fix |
|-------|-----|
| `prefer-nullish-coalescing` | Replace `\|\|` with `??` |
| `no-floating-promises` | Add `void` before Promise calls |
| `no-misused-promises` | Wrap async in `(e) => void asyncFn(e)` |
| `no-unsafe-assignment` | Use type assertions `as Type` |
| `no-unsafe-argument` | Type the parameter properly |
| `no-unsafe-member-access` | Cast object first: `(obj as Type).prop` |
| `react/no-unescaped-entities` | Use HTML entities: `&apos;` |
| `no-shadow` | Rename inner variable |

## 📋 Completion Checklist

- [ ] ESLint errors = 0
- [ ] File marked ✅ in compliance tracking
- [ ] No new TypeScript errors introduced

---
**Time target: 5-10 minutes per file for common errors**