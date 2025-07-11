<!--
Last Updated: 2025-06-15
Version: 1.0.0
Status: Active
-->

# `@codexcrm/config`

This package is the single source of truth for all shared tooling configurations in the monorepo. It ensures that every package and application adheres to the same standards for code quality, formatting, and compilation.

## Purpose

Instead of duplicating configuration files (`.eslintrc.js`, `tsconfig.json`, etc.) in every package, we define them once here and have other packages extend them.

## Connection to the System

Other packages consume these configurations via the `exports` map in this package's `package.json`. This allows for clean imports like `extends: '@codexcrm/config/typescript/base'` or `presets: [require('@codexcrm/config/tailwind')]`.