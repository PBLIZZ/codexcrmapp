# Phase 2: Authentication Layer Modernization
**Timeline**: Day 2 (4-5 hours)  
**Prerequisites**: Phase 1 complete, imports cleaned up  
**Focus**: Update to latest Supabase SSR patterns while preserving OAuth

---

## Task 201: Audit Current Auth Implementation
**Priority**: CRITICAL  
**Dependencies**: Phase 1 complete  
**Duration**: 30 minutes  
**Description**: Document current auth patterns before updating

### Implementation Steps:
```bash
# 1. Create auth audit file
cat > AUTH_AUDIT_PHASE2.md << 'EOF'
# Authentication Audit - Pre-Modernization
Date: $(date)

## Current Implementation Scan
EOF

# 2. Find all getSession usage
echo "## getSession Usage (to be replaced)" >> AUTH_AUDIT_PHASE2.md
echo '```' >> AUTH_AUDIT_PHASE2.md
grep -r "getSession" apps packages --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v dist >> AUTH_AUDIT_PHASE2.md
echo '```' >> AUTH_AUDIT_PHASE2.md

# 3. Find current auth utilities
echo "## Current Auth File Locations" >> AUTH_AUDIT_PHASE2.md
find apps packages -name "*auth*" -type f -path "*/src/*" | grep -E "\.(ts|tsx)$" | grep -v node_modules >> AUTH_AUDIT_PHASE2.md

# 4. Document middleware pattern
echo "## Current Middleware" >> AUTH_AUDIT_PHASE2.md
if [ -f "apps/web/middleware.ts" ]; then
  echo "Found: apps/web/middleware.ts" >> AUTH_AUDIT_PHASE2.md
  grep -A 5 -B 5 "auth\|session" apps/web/middleware.ts >> AUTH_AUDIT_PHASE2.md
fi

# 5. Test current OAuth flow
echo "## OAuth Test Results" >> AUTH_AUDIT_PHASE2.md
echo "- [ ] Google OAuth works" >> AUTH_AUDIT_PHASE2.md
echo "- [ ] GitHub OAuth works" >> AUTH_AUDIT_PHASE2.md
echo "- [ ] Session persists on refresh" >> AUTH_AUDIT_PHASE2.md
echo "- [ ] Logout clears session" >> AUTH_AUDIT_PHASE2.md
```

### Validation:
- [ ] All getSession calls documented
- [ ] OAuth tested and working
- [ ] Auth file locations mapped
- [ ] Backup created of working auth

---

## Task 202: Update Supabase Auth Package
**Priority**: HIGH  
**Dependencies**: [201]  
**Duration**: 25 minutes  
**Description**: Modernize packages/auth with latest SSR patterns

### Implementation Steps:
```bash
# 1. Backup current auth package
cp -r packages/auth packages/auth.backup.phase2

# 2. Update auth package dependencies
cd packages/auth
pnpm add @supabase/ssr@latest @supabase/supabase-js@latest

# 3. Create server auth utility
cat > src/server.ts << 'EOF'
// @SERVER-ONLY - Next.js 15 App Router
// @NO-USE-CLIENT - This file must NOT have 'use client'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@codexcrm/database/types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component cookie handling
          }
        },
      },
    }
  )
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}
EOF

# 4. Create client auth utility
cat > src/client.ts << 'EOF'
// @BROWSER-SAFE - Can be used in client components
// @USE-CLIENT-REQUIRED - Must be used with 'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@codexcrm/database/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
EOF

# 5. Update package exports
cat > src/index.ts << 'EOF'
// Server exports - for server components and route handlers
export { createClient as createServerClient, getUser } from './server'

// Client exports - for client components  
export { createClient as createBrowserClient } from './client'

// Type exports
export type { Database } from '@codexcrm/database/types'
EOF
```

### Validation:
- [ ] No TypeScript errors
- [ ] Server/client separation clear
- [ ] Headers properly annotated
- [ ] Exports match new pattern

---

## Task 203: Create Middleware with Session Refresh
**Priority**: CRITICAL  
**Dependencies**: [202]  
**Duration**: 30 minutes  
**Description**: Replace/create middleware for automatic session management

### Implementation Steps:
```bash
# 1. Backup existing middleware
if [ -f "apps/web/middleware.ts" ]; then
  cp apps/web/middleware.ts apps/web/middleware.ts.backup.phase2
fi

# 2. Create new middleware
cat > apps/web/middleware.ts << 'EOF'
// @MIDDLEWARE - Next.js Edge Runtime
// @EDGE-RUNTIME - Runs on Edge, not Node.js

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getUser()

  // Add security headers
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
EOF
```

### Validation:
- [ ] Middleware runs without errors
- [ ] Session cookies refresh on navigation
- [ ] Security headers present in responses
- [ ] No impact on static assets

---

## Task 204: Update Auth Guards in Layouts
**Priority**: HIGH  
**Dependencies**: [202, 203]  
**Duration**: 30 minutes  
**Description**: Replace getSession with getUser in protected layouts

### Implementation Steps:
```bash
# 1. Find all layout files with auth checks
echo "Layout files to update:" > AUTH_LAYOUT_UPDATES.md
find apps/web -name "layout.tsx" -exec grep -l "auth\|session" {} \; >> AUTH_LAYOUT_UPDATES.md

# 2. Update dashboard layout pattern
# Replace this pattern in protected layouts:
# OLD:
# const { data: { session } } = await supabase.auth.getSession()
# if (!session) {
#   redirect('/login')
# }

# NEW:
# import { getUser } from '@codexcrm/auth'
# const { user, error } = await getUser()
# if (error || !user) {
#   redirect('/login')
# }

# 3. Create migration script
cat > scripts/update-auth-guards.js << 'EOF'
const fs = require('fs');
const path = require('path');

function updateAuthGuards(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace getSession pattern
  content = content.replace(
    /const\s*{\s*data:\s*{\s*session\s*}\s*}\s*=\s*await\s*supabase\.auth\.getSession\(\)/g,
    'const { user, error } = await getUser()'
  );
  
  // Replace session checks
  content = content.replace(
    /if\s*\(!session\)/g,
    'if (error || !user)'
  );
  
  // Add import if needed
  if (content.includes('getUser()') && !content.includes("from '@codexcrm/auth'")) {
    content = `import { getUser } from '@codexcrm/auth'\n${content}`;
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${filePath}`);
}

// Run on dashboard layout
updateAuthGuards('./apps/web/app/(dashboard)/layout.tsx');
EOF

# 4. Run the update
node scripts/update-auth-guards.js
```

### Validation:
- [ ] Protected routes still redirect when logged out
- [ ] Logged in users can access protected routes
- [ ] No TypeScript errors in layouts
- [ ] Import statements correct

---

## Task 205: Update API Context for Auth
**Priority**: HIGH  
**Dependencies**: [202]  
**Duration**: 25 minutes  
**Description**: Update tRPC context to use new auth pattern

### Implementation Steps:
```bash
# 1. Update API context
cd packages/api/src

# 2. Update context.ts
cat > context.ts.new << 'EOF'
// @SERVER-ONLY
import { createServerClient } from '@codexcrm/auth'
import type { inferAsyncReturnType } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export async function createContext(opts: FetchCreateContextFnOptions) {
  const supabase = await createServerClient()
  
  // Use getUser instead of getSession
  const { data: { user }, error } = await supabase.auth.getUser()
  
  return {
    supabase,
    user: error ? null : user,
    headers: opts.req.headers,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
EOF

# 3. Compare and update if different
if ! diff -q context.ts context.ts.new > /dev/null; then
  mv context.ts context.ts.backup.phase2
  mv context.ts.new context.ts
else
  rm context.ts.new
fi

# 4. Update protected procedure if needed
grep -l "session" . -R --include="*.ts" | while read file; do
  echo "Check for session usage in: $file"
done
```

### Validation:
- [ ] API context builds without errors
- [ ] Protected procedures work
- [ ] User object available in context
- [ ] No session references remain

---

## Task 206: Update Client Components Auth
**Priority**: MEDIUM  
**Dependencies**: [202]  
**Duration**: 30 minutes  
**Description**: Update client-side auth usage patterns

### Implementation Steps:
```bash
# 1. Find client components using auth
echo "Client components with auth:" > CLIENT_AUTH_UPDATES.md
grep -r "createClient\|supabase\.auth" apps/web --include="*.tsx" | grep -l "use client" >> CLIENT_AUTH_UPDATES.md

# 2. Create auth hook for client components
mkdir -p apps/web/hooks
cat > apps/web/hooks/use-auth.ts << 'EOF'
'use client'

import { createBrowserClient } from '@codexcrm/auth'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading, supabase }
}
EOF

# 3. Update imports in client components
# From: import { createClient } from '@/lib/supabase/client'  
# To: import { createBrowserClient } from '@codexcrm/auth'
```

### Validation:
- [ ] Client components compile
- [ ] Auth hook works
- [ ] No console errors
- [ ] Auth state updates properly

---

## Task 207: Test & Verify OAuth Flow
**Priority**: CRITICAL  
**Dependencies**: [201-206]  
**Duration**: 30 minutes  
**Description**: Comprehensive testing of updated auth

### Test Checklist:
```bash
# Create test report
cat > PHASE_2_AUTH_TEST.md << 'EOF'
# Phase 2 Auth Modernization Test Report
Date: $(date)

## OAuth Provider Tests
### Google OAuth
- [ ] Login button works
- [ ] Redirects to Google
- [ ] Returns with user data
- [ ] Session cookie set
- [ ] User appears in header

### GitHub OAuth  
- [ ] Login button works
- [ ] Redirects to GitHub
- [ ] Returns with user data
- [ ] Session cookie set
- [ ] User appears in header

## Session Management
- [ ] Refresh page - still logged in
- [ ] Close browser, reopen - still logged in
- [ ] Session refreshes automatically
- [ ] No getSession errors in console

## Protected Routes
- [ ] /contacts requires auth
- [ ] /dashboard requires auth
- [ ] Redirect to /login when logged out
- [ ] Access granted when logged in

## API Calls
- [ ] tRPC procedures detect user
- [ ] Protected procedures work
- [ ] Public procedures work
- [ ] User context available

## Client Components
- [ ] useAuth hook returns user
- [ ] Auth state updates on login/logout
- [ ] No hydration errors
- [ ] Supabase client works

## Performance
- [ ] No duplicate auth calls
- [ ] Middleware runs efficiently
- [ ] Page loads are fast
- [ ] No memory leaks
EOF

# Run through all tests manually
```

### Rollback Plan:
```bash
# If auth breaks:
cp packages/auth.backup.phase2/* packages/auth/
cp apps/web/middleware.ts.backup.phase2 apps/web/middleware.ts
# Restore any other modified files from backups
pnpm install
```

---

## Task 208: Create Phase 2 Completion Report
**Priority**: HIGH  
**Dependencies**: [201-207]  
**Duration**: 15 minutes  
**Description**: Document successful auth modernization

### Implementation:
```bash
cat > PHASE_2_COMPLETE.md << 'EOF'
# Phase 2 Completion Report
Date: $(date)
Status: Auth Modernized ✓

## Changes Implemented
- [x] Supabase SSR patterns updated
- [x] getSession → getUser migration complete
- [x] Middleware with session refresh
- [x] Auth package modernized
- [x] Client/server utilities separated
- [x] API context updated
- [x] All tests passing

## Key Files Changed
- packages/auth/src/server.ts (new)
- packages/auth/src/client.ts (new)
- apps/web/middleware.ts (updated)
- apps/web/app/(dashboard)/layout.tsx (updated)
- packages/api/src/context.ts (updated)

## OAuth Status
- Google: ✓ Working
- GitHub: ✓ Working
- Session Management: ✓ Working
- Protected Routes: ✓ Working

## Next Phase Ready
Ready for Phase 3: Table Implementation
EOF

git add -A
git commit -m "refactor(auth): modernize to latest Supabase SSR patterns"
git tag -a "phase-2-auth-complete" -m "Auth modernization complete"
```

---

## Critical Success Factors

1. **Test OAuth after EVERY task** - it's the most fragile part
2. **Keep backups** - every file modified gets a .backup.phase2
3. **Server/Client separation** - crucial for Next.js 15
4. **No mixing patterns** - completely replace getSession
5. **Middleware is key** - handles automatic session refresh

## Common Pitfalls to Avoid

- Don't mix old and new auth patterns
- Ensure cookies are handled properly in middleware
- Test both OAuth providers, not just one
- Remember the edge runtime limitations in middleware
- Keep the @SERVER-ONLY and @BROWSER-SAFE annotations

Ready to begin Phase 2? Start with Task 201 to audit your current implementation.