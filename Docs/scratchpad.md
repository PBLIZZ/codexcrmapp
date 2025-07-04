# 🔍 Scratchpad: Auth & Architecture Refactor

## 🤔 Thoughts & Decisions

- We’re currently using `getSession()` everywhere — must standardize to `getUser()` from Supabase docs.
- Layout folders are inconsistent — move toward App Router structure (`/app/page.tsx`, `/app/layout.tsx`, etc.)
- Avoid breaking polder-state logic until client/server boundaries are clearly defined.

## ❗ Uncertainties

- Not sure if `useSession()` is still used in any client components.
- Supabase SSR integration with tRPC not clearly documented.

## 📌 Pending Tasks

- Migrate `/pages/api/*` to `/app/api/*`
- Refactor middleware
- Create unified auth context using `useAuth()` pattern
