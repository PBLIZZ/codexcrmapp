<!--
Last Updated: 2025-06-15
Version: 1.1.0
Status: Active
-->

# Contributing to CodexCRM

Thank you for your interest in contributing! To ensure the stability and consistency of the project, please adhere to the following guidelines.

## 🛑 **Do Not Modify Core Configuration Files** 🛑

The configuration files at the root of this monorepo (e.g., `tsconfig.*.json`, `turbo.json`, `package.json`) and within `packages/config` have been carefully architected to ensure the entire project builds correctly and efficiently.

**Making changes to these files can break builds, type-checking, and deployments across all packages.**

If you believe a change to a core configuration file is necessary, please open an issue to discuss the proposed change with a senior developer or project lead before creating a pull request.

Refer to `/Docs/official-documentation/centralising-config.md` for a detailed explanation of the configuration strategy.

## Technical Guardrails

To help enforce these standards, the repository is equipped with automated guardrails:

### 1. Automated Code Review

The `.github/CODEOWNERS` file automatically requests a review from the project lead for any pull request that attempts to modify the core configuration files. This provides a critical safety net against accidental changes.

### 2. Pre-Commit Hooks

We use `husky` and `lint-staged` to run automated checks before any code is committed. When you run `git commit`, these tools will automatically format your code with Prettier and check it with ESLint. This ensures that all committed code adheres to our established style guides, preventing inconsistencies before they ever enter the codebase.