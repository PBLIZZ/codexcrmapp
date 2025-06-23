# Dependency Audit Report

Generated: Mon Jun 23 13:08:24 CEST 2025

## Current vs Required Versions

| Package               | Current | Required | Action  | Risk   |
| --------------------- | ------- | -------- | ------- | ------ |
| react                 | 19.1.0  | ^19.0.2  | Verify  | Low    |
| next                  |         | 15.3.1   | Upgrade | High   |
| @supabase/ssr         | 0.6.1   | ^0.6.1   | Upgrade | Medium |
| @tanstack/react-table | 8.21.3  | ^8.20.0  | Verify  | Low    |

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

No deprecated packages found.

## Missing Packages for Refactor:

- [ ] @tanstack/react-table (table implementation)
- [ ] @hookform/resolvers (form validation)
- [ ] Additional workspace packages
