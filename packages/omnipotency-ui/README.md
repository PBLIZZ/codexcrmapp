# @omnipotency/ui

The UI component library for the CodexCRM project.

This library provides a set of reusable React components based on shadcn/ui and Radix UI primitives, designed to integrate seamlessly within the CodexCRM ecosystem.

## Features (Planned)

- Core primitive components (Button, Input, Card, etc.)
- Composite components (DataTable, Modals, Forms, etc.)
- Theming capabilities
- Accessibility focused

## Installation

This package is part of the CodexCRM monorepo and managed by pnpm workspaces.

To use components from this library in other packages (e.g., `apps/web`):
1. Add `@omnipotency/ui` as a dependency in the target package's `package.json`:
   ```json
   "dependencies": {
     "@omnipotency/ui": "workspace:*"
   }
   ```
2. Run `pnpm install` from the monorepo root.

## Usage

(Details to be added once components are developed)

Example:
```tsx
import { Button } from '@omnipotency/ui';

// ...
<Button>Click Me</Button>
// ...
```

---
This library is currently under development.
