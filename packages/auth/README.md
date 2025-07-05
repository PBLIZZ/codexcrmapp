<!--
Last Updated: 2025-06-15
Version: 1.0.0
Status: Active
-->

# `@codexcrm/auth`

This package manages all authentication logic, including user session management and interactions with the Supabase client. It provides hooks and context providers for the rest of the application.

## Configuration

The `tsconfig.json` in this package extends the shared TypeScript preset from `@codexcrm/config/typescript/base` to ensure consistent compiler settings.

## Dependencies

- `@supabase/ssr`
- `react`
- `@codexcrm/config`