<!--
Last Updated: 2025-06-15
Version: 1.0.0
Status: Active
-->

# `@codexcrm/ui`

This package contains the shared, reusable React UI components for the entire application, built with Shadcn UI and Tailwind CSS.

## Configuration

The `tailwind.config.ts` file in this package's root is crucial for developer tooling. It consumes the shared preset from `@codexcrm/config/tailwind` to ensure that tools like the Tailwind CSS IntelliSense extension in VS Code can correctly resolve your custom theme while you are developing components in isolation.

## Dependencies

- `react`
- `tailwindcss`
- `@codexcrm/config`