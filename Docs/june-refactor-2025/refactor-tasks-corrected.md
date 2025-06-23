# CodexCRM Refactor Tasks - Corrected Implementation Plan

## Phase 0: Pre-Flight & Backup (Critical - Day 0)

### Task 001: Complete Backup and Validation

**Priority**: CRITICAL  
**Dependencies**: None  
**Description**: Create timestamped backup of current working app with rollback verification  
**Details**:

```bash
# Execute these commands in order
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="apps/_web_backup_${TIMESTAMP}"
cp -r apps/web $BACKUP_DIR

# Create backup manifest
cat > ${BACKUP_DIR}/BACKUP_MANIFEST.md << EOF
Backup Created: ${TIMESTAMP}
OAuth Status: WORKING
Supabase Connection: VERIFIED
Last Commit: $(git rev-parse HEAD)
EOF

# Tag current working state
git add -A && git commit -m "pre-refactor: working state before monorepo migration"
git tag -a "pre-refactor-${TIMESTAMP}" -m "Working OAuth and Supabase setup"
```

**Test Strategy**:

- Verify backup directory exists with all files
- Test OAuth flow one final time before proceeding
- Confirm rollback procedure: `rm -rf apps/web && cp -r ${BACKUP_DIR} apps/web`

### Task 002: Initialize Refactor Tracking System

**Priority**: CRITICAL  
**Dependencies**: [001]  
**Description**: Set up comprehensive change tracking system for AI implementation  
**Details**:

```markdown
# Create REFACTOR_CHANGELOG.md with this template

# CodexCRM Refactor Changelog

Started: [DATE]
Backup Location: [BACKUP_DIR]
Current Phase: 0 - Pre-Flight

## Change Tracking Format

| Status | Action | Source | Destination | AI Tool | Issues | Resolution |
| ------ | ------ | ------ | ----------- | ------- | ------ | ---------- |

## Dependency Map

| Component | Old Pattern | New Pattern | Breaking Change | Migration |
| --------- | ----------- | ----------- | --------------- | --------- |

## AI Instruction Log

| Task | Instruction Given | Expected Output | Actual Output | Corrections |
| ---- | ----------------- | --------------- | ------------- | ----------- |
```

**Test Strategy**: Verify tracking file created and git tracked

### Task 003: Audit Current Dependencies

**Priority**: HIGH  
**Dependencies**: [001]  
**Description**: Map all current dependencies and identify migration requirements  
**Details**:

- Extract current package.json dependencies
- Compare against PRD v2.0 requirements
- Identify version mismatches (especially React 19, Next.js 15)
- Document any packages that need removal/replacement
- Create dependency migration matrix
  **Test Strategy**: Run `pnpm outdated` and document all major version differences

## Phase 1: Monorepo Foundation (Day 1)

### Task 101: Initialize True Monorepo Structure

**Priority**: CRITICAL  
**Dependencies**: [001, 002, 003]  
**Description**: Set up pnpm workspace with correct structure (NOT what task-master suggested)  
**Details**:

```bash
# Root level initialization
pnpm init

# Create monorepo structure
mkdir -p packages/{ui,database,api,config}
mkdir -p apps/web

# Create pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Install turborepo at root
pnpm add -D turbo -w
```

**AI Instructions**:

```
Create pnpm-workspace.yaml with exact content:
packages:
  - 'apps/*'
  - 'packages/*'

DO NOT add any other configuration. This must be exact.
```

**Test Strategy**:

- Run `pnpm install` - should create single node_modules at root
- Run `pnpm ls -r` - should show workspace structure

### Task 102: Configure Shared TypeScript Config

**Priority**: HIGH  
**Dependencies**: [101]  
**Description**: Create base TypeScript configuration with React 19 support  
**Details**:

```json
// packages/config/typescript/base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "jsx": "preserve",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "moduleResolution": "bundler",
    "allowJs": true,
    "incremental": true
  }
}
```

**AI Instructions**: "Create base TypeScript config for React 19 and Next.js 15. Must include 'moduleResolution': 'bundler' for Next.js 15."
**Test Strategy**: Verify extends work in app tsconfig

### Task 103: Move Existing Web App (Preserve Structure)

**Priority**: HIGH  
**Dependencies**: [101, 102]  
**Description**: Move existing app to monorepo structure WITHOUT modifying  
**Details**:

```bash
# Move existing app preserving all files
mv apps/web apps/_temp_web
mkdir -p apps/web
mv apps/_temp_web/* apps/web/
mv apps/_temp_web/.* apps/web/ 2>/dev/null || true
rmdir apps/_temp_web

# Update package.json name
# In apps/web/package.json, change name to "@codexcrm/web"
```

**Test Strategy**:

- Original app should still run with `pnpm --filter web dev`
- OAuth should still work

## Phase 2: Authentication Layer Modernization (Day 2)

### Task 201: Create Supabase SSR Utilities

**Priority**: CRITICAL  
**Dependencies**: [103]  
**Description**: Implement latest Supabase SSR patterns with proper server/client separation  
**Details**:
Create these files with EXACT patterns from Supabase docs:

```typescript
// apps/web/lib/supabase/server.ts
// @SERVER-COMPONENT - Next.js 15 App Router
// @NO-USE-CLIENT - This file must NOT have 'use client'
```

**AI Instructions**:

```
Implement apps/web/lib/supabase/server.ts following this EXACT pattern:
1. Import createServerClient from '@supabase/ssr'
2. Import cookies from 'next/headers'
3. Use await cookies() for Next.js 15
4. Return createServerClient with cookie handling
5. CRITICAL: This is for Next.js 15 - use the latest pattern from Supabase docs
```

**Test Strategy**:

- Import in a server component
- Call await createClient() and verify no errors
- Test getUser() returns current user

### Task 202: Update Middleware for Session Management

**Priority**: CRITICAL  
**Dependencies**: [201]  
**Description**: Replace any existing middleware with Supabase session refresh  
**Details**:

- Move existing middleware.ts to middleware.backup.ts
- Implement new middleware with updateSession pattern
- Add security headers
- Configure matcher correctly
  **AI Instructions**: "Create middleware.ts at apps/web root. Must use updateSession from Supabase SSR. Add X-Frame-Options and X-Content-Type-Options headers."
  **Test Strategy**:
- Check browser DevTools for set-cookie headers
- Verify security headers present
- Session should persist across page navigation

### Task 203: Migrate Auth Check Pattern

**Priority**: HIGH  
**Dependencies**: [201, 202]  
**Description**: Update all auth checks from getSession to getUser  
**Details**:

```typescript
// Find all instances of:
const {
  data: { session },
} = await supabase.auth.getSession();

// Replace with:
const {
  data: { user },
  error,
} = await supabase.auth.getUser();
```

**Test Strategy**: Search codebase for "getSession" - should return 0 results

## Phase 3: Database Package Setup (Day 3)

### Task 301: Create Database Package

**Priority**: HIGH  
**Dependencies**: [201]  
**Description**: Set up shared database package with Supabase types  
**Details**:

```bash
cd packages/database
pnpm init
pnpm add @supabase/supabase-js @supabase/ssr
```

**AI Instructions**:

```
Create packages/database with:
1. src/types.ts - Will hold generated types later
2. src/client.ts - Browser-safe client with @BROWSER-SAFE header
3. src/server.ts - Server-only client with @SERVER-ONLY header
4. index.ts - Export all

Use these headers:
// @BROWSER-SAFE - Can be used in client components
// @SERVER-ONLY - Cannot be imported in client components
```

### Task 302: Generate Supabase Types

**Priority**: HIGH  
**Dependencies**: [301]  
**Description**: Generate TypeScript types from existing Supabase schema  
**Details**:

```bash
cd apps/web
pnpm supabase gen types typescript --local > ../../packages/database/src/types.ts
```

**Test Strategy**: Verify types match existing schema, especially contacts table

### Task 303: Update Imports to Use Database Package

**Priority**: MEDIUM  
**Dependencies**: [302]  
**Description**: Replace all direct Supabase imports with database package  
**Details**:

- Find: `import { createClient } from '@/lib/supabase/client'`
- Replace: `import { createClient } from '@codexcrm/database/client'`
  **Test Strategy**: No TypeScript errors, app still functions

## Phase 4: Component Migration Strategy (Day 4)

### Task 401: Analyze Component Dependencies

**Priority**: HIGH  
**Dependencies**: [303]  
**Description**: Map which components can be moved to packages/ui  
**Details**:
Create analysis document:

```markdown
## Component Migration Analysis

### Safe to Move (No app dependencies):

- [ ] Button
- [ ] Card
- [ ] Dialog

### Needs Refactoring (Has app imports):

- [ ] ContactsSidebar (imports from app context)
- [ ] MainLayout (imports auth utils)

### Keep in App (Too specific):

- [ ] ContactsTable (tightly coupled to tRPC)
```

### Task 402: Extract UI Primitives

**Priority**: MEDIUM  
**Dependencies**: [401]  
**Description**: Move shadcn/ui components to packages/ui  
**Details**:

- Create packages/ui structure
- Move components one at a time
- Update imports after each move
- Test after each component
  **AI Instructions**: "Move Button component to packages/ui. Add @CLIENT-COMPONENT header. Export from packages/ui/src/index.ts"

## Phase 5: Table Implementation (Day 5-6)

### Task 501: Install TanStack Table v8

**Priority**: HIGH  
**Dependencies**: [402]  
**Description**: Add TanStack Table with correct version  
**Details**:

```bash
cd apps/web
pnpm add @tanstack/react-table@^8.20.0
```

**Test Strategy**: Check version is v8, not v7

### Task 502: Create Contact Table Columns

**Priority**: HIGH  
**Dependencies**: [501]  
**Description**: Define column definitions with all features from PRD  
**Details**:
Must include:

- Row selection with checkbox
- Sorting indicators
- Contact details with avatar
- Tags with overflow
- AI enrichment status
- Notes button
  **AI Instructions**: "Create table-columns.tsx following the EXACT pattern from PRD section 4.4. Include all columns: select, name, contact, role, tags, ai_status, updated_at, actions."

### Task 503: Implement Server/Client Data Bridge

**Priority**: CRITICAL  
**Dependencies**: [502]  
**Description**: Create pattern for SSR initial data with client-side updates  
**Details**:
Server component fetches initial data → passes to client component → client uses tRPC with initialData
**Test Strategy**: No loading flash on first render, subsequent updates via tRPC

## Phase 6: Testing & Validation (Day 7)

### Task 601: Auth Flow End-to-End Test

**Priority**: CRITICAL  
**Dependencies**: [All previous]  
**Description**: Manual test of complete auth flow  
**Test Steps**:

1. Logout completely
2. Try accessing /contacts (should redirect to /login)
3. Login with OAuth
4. Verify redirect to /contacts
5. Refresh page (session should persist)
6. Check cookies in DevTools
7. Logout and verify redirect

### Task 602: Table Functionality Test

**Priority**: HIGH  
**Dependencies**: [503]  
**Description**: Test all table features work correctly  
**Test Steps**:

1. Load contacts page
2. Verify instant render (SSR)
3. Test sorting each column
4. Test search/filter
5. Test pagination
6. Test row selection
7. Test bulk actions
8. Verify no hydration errors

### Task 603: Performance Validation

**Priority**: MEDIUM  
**Dependencies**: [602]  
**Description**: Measure and optimize performance  
**Metrics**:

- First Contentful Paint < 1.5s
- No hydration errors
- Bundle size < 150KB initial JS
- No memory leaks in table

## Phase 7: Cleanup & Documentation (Day 8)

### Task 701: Remove Old Code

**Priority**: LOW  
**Dependencies**: [603]  
**Description**: Clean up migrated/replaced code  
**Details**:

- Remove old auth utilities
- Remove replaced components
- Clean up unused dependencies
- Update all imports

### Task 702: Update Documentation

**Priority**: LOW  
**Dependencies**: [701]  
**Description**: Document new patterns and architecture  
**Details**:

- Update README with monorepo structure
- Document auth patterns
- Create component usage guide
- Add troubleshooting guide

## Critical Success Factors

### 1. Order Matters

Tasks must be completed in sequence. Jumping ahead will cause cascading failures.

### 2. Test Continuously

After EVERY task, verify the app still works. If something breaks, stop and fix before proceeding.

### 3. AI Instruction Precision

When using AI tools, provide the EXACT instructions from this document. Don't paraphrase.

### 4. Rollback Points

After each successful phase, commit and tag:

```bash
git add -A && git commit -m "refactor: phase X complete"
git tag -a "refactor-phase-X" -m "Phase X working"
```

### 5. Common Failure Points

- Mixing server/client components (Task 201, 402, 502)
- Using old auth patterns (Task 203)
- Wrong TanStack Table version (Task 501)
- Hydration errors (Task 503, 602)
- Import path errors (Task 303, 402)

## AI Implementation Guide

### For Each Task:

1. Copy the exact AI instruction
2. Provide file location and component type
3. Reference the PRD section
4. Verify output matches expected pattern
5. Test immediately

### Example AI Prompt:

```
I need you to implement [Task 201] following these rules:

1. This is a Next.js 15 TypeScript Strict App Router project using React 19
2. File location: apps/web/lib/supabase/server.ts
3. Component type: SERVER-ONLY utility
4. Must follow pattern from PRD section 5.1
5. Critical: Use createServerClient from @supabase/ssr, NOT the old pattern

Please implement the file now with the required headers.
```

## Emergency Rollback

If at any point the refactor fails catastrophically:

```bash
# Find latest backup
BACKUP_DIR=$(ls -1 apps/_web_backup_* | tail -1)

# Rollback
rm -rf apps/web
cp -r $BACKUP_DIR apps/web

# Restore dependencies
cd apps/web && pnpm install

# Verify working
pnpm dev
```

Document what failed in REFACTOR_CHANGELOG.md for future attempts.
