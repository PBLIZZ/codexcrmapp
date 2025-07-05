<!--
Last Updated: 2025-06-15
Version: 1.0.0
Status: Active
-->

# `@codexcrm/api`

This package is responsible for defining the application's tRPC API layer. It contains all the routers, procedures, and input/output schemas (using Zod) that make up the backend API.

## Configuration

The `tsconfig.json` in this package extends the shared TypeScript preset from `@codexcrm/config/typescript/base` to ensure consistent compiler settings.

## Dependencies

- `@trpc/server`
- `zod`
- `@codexcrm/config`