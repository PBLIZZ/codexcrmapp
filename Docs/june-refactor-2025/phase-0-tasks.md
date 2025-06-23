# Phase 0: Pre-Flight & Backup Tasks

**Timeline**: Day 0 (Complete before ANY refactoring)  
**Critical**: These tasks MUST be completed in order. Do not proceed to Phase 1 until all are verified.

---

## Task 001: Complete Backup and Validation

**Priority**: CRITICAL  
**Dependencies**: None  
**Duration**: 15 minutes  
**Description**: Create timestamped backup of current working app with rollback verification

### Implementation Steps:

```bash
# 1. Create timestamp variable
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 2. Create backup directory
BACKUP_DIR="apps/_web_backup_${TIMESTAMP}"
cp -r apps/web $BACKUP_DIR

# 3. Create backup manifest
cat > ${BACKUP_DIR}/BACKUP_MANIFEST.md << EOF
Backup Created: ${TIMESTAMP}
OAuth Status: WORKING
Supabase Connection: VERIFIED
Last Commit: $(git rev-parse HEAD)
EOF

# Exclude node_modules but explicitly include hidden files
rsync -a --exclude='node_modules' --include='.*' apps/web/ $BACKUP_DIR/web/

# 4. Commit current state
git add -A && git commit -m "pre-refactor: working state before monorepo migration"

# 5. Tag the working state
git tag -a "pre-refactor-${TIMESTAMP}" -m "Working OAuth and Supabase setup"
```

### Validation Checklist:

- [x] Backup directory exists: `ls -la apps/_web_backup_*`
- [x] All files copied: `diff -r apps/web ${BACKUP_DIR} | wc -l` (should be 0)
- [x] OAuth flow works: Test login/logout cycle
- [x] Git tag created: `git tag -l "pre-refactor-*"`
- [x] Rollback tested: `rm -rf apps/web && cp -r ${BACKUP_DIR} apps/web && rm -rf apps/web && git checkout apps/web`
      the .env.local and the .env.sentry-build-plugin were not present in the rollback but i had saved them separately beforehand.

### Success Criteria:

- Backup manifest file exists with all status indicators
- Can restore from backup in under 30 seconds
- OAuth and Supabase still functional after restore test

---

## Task 002: Initialize Refactor Tracking System

**Priority**: CRITICAL  
**Dependencies**: [001]  
**Duration**: 10 minutes  
**Description**: Set up comprehensive change tracking system for AI implementation

### Implementation Steps:

```bash
# 1. Create tracking file at repository root
touch REFACTOR_CHANGELOG.md

# 2. Initialize with tracking template
cat > REFACTOR_CHANGELOG.md << 'EOF'
# CodexCRM Refactor Changelog

Started: $(date '+%Y-%m-%d %H:%M:%S')
Backup Location: ${BACKUP_DIR}
Current Phase: 0 - Pre-Flight
Git Tag: pre-refactor-${TIMESTAMP}

## Change Tracking Format

| Status | Action | Source | Destination | AI Tool | Issues | Resolution |
|--------|--------|--------|-------------|---------|---------|------------|
| ✅ | BACKUP | apps/web | ${BACKUP_DIR} | Manual | None | N/A |

## Dependency Map

| Component | Old Pattern | New Pattern | Breaking Change | Migration |
|-----------|-------------|-------------|-----------------|-----------|
| Auth | getSession() | getUser() | Yes | Update all occurrences |
| Imports | Relative | Workspace | Yes | Update after monorepo |
| Components | In app | In packages | No | Gradual migration |

## AI Instruction Log

| Task | Instruction Given | Expected Output | Actual Output | Corrections |
|------|-------------------|-----------------|---------------|-------------|
| Example | "Create server.ts" | Server component | Added 'use client' | Removed directive |

## Rollback Procedures

### Full Rollback:
\`\`\`bash
rm -rf apps/web
cp -r ${BACKUP_DIR} apps/web
cd apps/web && pnpm install
\`\`\`

### Partial Rollback:
Document specific file reversions here.

## Phase Completion Checklist

### Phase 0: Pre-Flight ✅
- [x] Backup created and verified
- [x] Tracking system initialized
- [ ] Dependencies audited
- [ ] Team notified of refactor start
EOF

# 3. Commit tracking file
git add REFACTOR_CHANGELOG.md
git commit -m "refactor: initialize tracking system"
```

### Validation Checklist:

- [ ] REFACTOR_CHANGELOG.md exists at repository root
- [ ] File contains all template sections
- [ ] Backup location is correctly recorded
- [ ] File is tracked in git

### Success Criteria:

- Can quickly log changes during refactor
- Clear rollback procedures documented
- AI instruction patterns established

---

## Task 003: Audit Current Dependencies

**Priority**: HIGH  
**Dependencies**: [001, 002]  
**Duration**: 20 minutes  
**Description**: Map all current dependencies and identify migration requirements

### Implementation Steps:

```bash
# 1. Extract current dependencies
cd apps/web
pnpm list --depth=0 --json > ../../DEPENDENCY_AUDIT.json

# 2. Create dependency comparison report
cat > ../../DEPENDENCY_COMPARISON.md << 'EOF'
# Dependency Audit Report
Generated: $(date)

## Current vs Required Versions

| Package | Current | Required | Action | Risk |
|---------|---------|----------|--------|------|
| react | $(pnpm list react --depth=0 | grep react | awk '{print $2}') | ^19.0.2 | Verify | Low |
| next | $(pnpm list next --depth=0 | grep next | awk '{print $2}') | 15.3.1 | Verify | Low |
| @supabase/ssr | $(pnpm list @supabase/ssr --depth=0 | grep @supabase/ssr | awk '{print $2}') | ^0.6.1 | Upgrade | Medium |
| @tanstack/react-table | Not installed | ^8.20.0 | Install | Low |

## Breaking Changes to Address

### React 19 Changes:
- [ ] Check for legacy context usage
- [ ] Verify no findDOMNode usage
- [ ] Update any legacy lifecycle methods

### Next.js 15 Changes:
- [ ] Update to App Router patterns
- [ ] Remove getServerSideProps/getStaticProps
- [ ] Update Link components (no <a> child needed)

### Supabase SSR Changes:
- [ ] Replace getSession with getUser
- [ ] Update createClient patterns
- [ ] Implement new cookie handling

## Deprecated Packages:
List any packages that need removal

## Missing Packages for Refactor:
- [ ] @tanstack/react-table (table implementation)
- [ ] @hookform/resolvers (form validation)
- [ ] Additional workspace packages
EOF

# 3. Check for outdated packages
pnpm outdated > ../../OUTDATED_PACKAGES.txt

# 4. Document in changelog
echo "| ✅ | AUDIT | package.json | DEPENDENCY_AUDIT.json | Manual | None | Documented |" >> ../../REFACTOR_CHANGELOG.md
```

### Validation Checklist:

- [ ] DEPENDENCY_AUDIT.json created
- [ ] DEPENDENCY_COMPARISON.md filled with actual versions
- [ ] All major version differences identified
- [ ] Breaking changes documented
- [ ] Update added to REFACTOR_CHANGELOG.md

### Success Criteria:

- Clear understanding of version gaps
- Migration risks identified
- No surprise breaking changes during refactor

---

## Task 004: Test Current Authentication Flow

**Priority**: HIGH  
**Dependencies**: [001, 002, 003]  
**Duration**: 15 minutes  
**Description**: Document and test the working authentication flow before any changes

### Implementation Steps:

```bash
# 1. Create auth flow documentation
cat > AUTH_FLOW_TEST.md << 'EOF'
# Authentication Flow Test Results
Date: $(date)
Tester: [Your name]

## Test Scenarios

### 1. Fresh Login Flow
- [ ] Navigate to app while logged out
- [ ] Redirected to login page
- [ ] OAuth provider buttons visible
- [ ] Click Google/GitHub OAuth
- [ ] Complete OAuth flow
- [ ] Redirected back to app
- [ ] User data visible in header
- [ ] Can access protected routes

Result: ⬜ PASS / ⬜ FAIL

### 2. Session Persistence
- [ ] Log in successfully
- [ ] Note cookie values in DevTools
- [ ] Refresh page (F5)
- [ ] Still logged in
- [ ] Close browser completely
- [ ] Reopen and navigate to app
- [ ] Still logged in
- [ ] Session cookies present

Result: ⬜ PASS / ⬜ FAIL

### 3. Logout Flow
- [ ] Click logout button
- [ ] Redirected to login page
- [ ] Try accessing protected route
- [ ] Redirected back to login
- [ ] Cookies cleared in DevTools

Result: ⬜ PASS / ⬜ FAIL

### 4. Error Handling
- [ ] Try invalid credentials (if using email/password)
- [ ] Error message displayed
- [ ] Cancel OAuth flow
- [ ] Returned to login page
- [ ] No console errors

Result: ⬜ PASS / ⬜ FAIL

## Cookie Analysis
\`\`\`
Supabase cookies found:
- [ ] sb-access-token
- [ ] sb-refresh-token
Cookie attributes:
- [ ] HttpOnly
- [ ] Secure (if HTTPS)
- [ ] SameSite configured
\`\`\`

## Current Auth Code Locations
- Login page: apps/web/app/(auth)/login/page.tsx
- Auth utilities: apps/web/lib/supabase/[client|server].ts
- Middleware: apps/web/middleware.ts
- Protected layout: apps/web/app/(dashboard)/layout.tsx

## Screenshots
- [ ] Login page screenshot saved
- [ ] OAuth flow screenshot saved
- [ ] Dashboard (logged in) screenshot saved
EOF

# 2. Run the tests and update the checkboxes
echo "Complete the AUTH_FLOW_TEST.md checklist manually"

# 3. Update changelog
echo "| ✅ | TEST | Auth Flow | AUTH_FLOW_TEST.md | Manual | None | All passing |" >> REFACTOR_CHANGELOG.md
```

### Validation Checklist:

- [ ] All test scenarios completed
- [ ] Screenshots captured for reference
- [ ] Cookie behavior documented
- [ ] No failing tests (fix before proceeding)

### Success Criteria:

- 100% of auth tests passing
- Clear documentation of working behavior
- Reference point for post-refactor testing

---

## Task 005: Create Phase 0 Completion Checkpoint

**Priority**: HIGH  
**Dependencies**: [001, 002, 003, 004]  
**Duration**: 10 minutes  
**Description**: Final verification and sign-off before proceeding to Phase 1

### Implementation Steps:

```bash
# 1. Create completion report
cat > PHASE_0_COMPLETE.md << 'EOF'
# Phase 0 Completion Report
Date: $(date)
Ready for Phase 1: ⬜ YES / ⬜ NO

## Checklist Verification

### Backups
- [ ] Full backup created with timestamp
- [ ] Backup manifest documents working state
- [ ] Rollback procedure tested successfully
- [ ] Git tag created for recovery point

### Tracking
- [ ] REFACTOR_CHANGELOG.md initialized
- [ ] All Phase 0 tasks logged
- [ ] AI instruction patterns documented
- [ ] Team access to tracking doc verified

### Dependencies
- [ ] Current versions documented
- [ ] Required versions identified
- [ ] Breaking changes catalogued
- [ ] Migration risks assessed

### Authentication
- [ ] Current flow tested and passing
- [ ] Cookie behavior documented
- [ ] All auth endpoints identified
- [ ] Screenshots captured for reference

## Go/No-Go Decision

### Required for GO:
- All checkboxes above marked ✓
- No blocking issues identified
- Team availability confirmed
- At least 4 hours uninterrupted time for Phase 1

### Reasons for NO-GO:
- [ ] Auth tests failing
- [ ] Backup verification failed
- [ ] Major dependency conflicts found
- [ ] Team unavailable

## Sign-offs
- Technical Lead: _________________ Date: _______
- Developer: _____________________ Date: _______

## Next Steps
If GO: Proceed to Phase 1 - Monorepo Foundation
If NO-GO: Address issues and repeat Phase 0 Task 005
EOF

# 2. Final git commit for Phase 0
git add -A
git commit -m "refactor: Phase 0 complete - ready for monorepo migration"
git tag -a "phase-0-complete" -m "All pre-flight checks passed"

# 3. Create a final backup snapshot
FINAL_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp -r apps/web "apps/_web_phase0_complete_${FINAL_TIMESTAMP}"

echo "Phase 0 Complete! Backup at: apps/_web_phase0_complete_${FINAL_TIMESTAMP}"
```

### Validation Checklist:

- [ ] PHASE_0_COMPLETE.md created and filled
- [ ] All previous task outputs present
- [ ] Git tag 'phase-0-complete' created
- [ ] Final backup created
- [ ] Go/No-Go decision made

### Success Criteria:

- Confident to proceed with refactor
- Clear rollback path if needed
- All working functionality documented
- Team aligned on next steps

---

## Phase 0 Summary

**Total Duration**: ~1.5 hours  
**Critical Files Created**:

- `apps/_web_backup_[timestamp]/` - Full backup
- `REFACTOR_CHANGELOG.md` - Change tracking
- `DEPENDENCY_AUDIT.json` - Current dependencies
- `DEPENDENCY_COMPARISON.md` - Version analysis
- `AUTH_FLOW_TEST.md` - Working auth documentation
- `PHASE_0_COMPLETE.md` - Go/No-Go decision

**Git Tags Created**:

- `pre-refactor-[timestamp]` - Original working state
- `phase-0-complete` - Pre-flight checks done

**Ready for Phase 1 Criteria**:

1. ✅ Complete backup with tested restore
2. ✅ Tracking system operational
3. ✅ Dependencies mapped and risks identified
4. ✅ Authentication flow documented and working
5. ✅ Team sign-off obtained

⚠️ **DO NOT PROCEED TO PHASE 1 WITHOUT COMPLETING ALL PHASE 0 TASKS**
