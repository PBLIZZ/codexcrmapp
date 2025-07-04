# General Principles for Naming Conventions

Before diving into specifics, these overarching principles apply across your entire stack:

- **Consistency is Key:** Whatever convention you choose, stick to it rigorously. Inconsistency leads to confusion and errors.
- **Readability:** Names should be clear, descriptive, and easy to understand at a glance.
- **Predictability:** Developers should be able to guess the name of a file, component, or function based on its purpose.
- **Avoid Ambiguity:** Don't use names that could mean multiple things.
- **Be Specific:** More specific names are generally better than generic ones.
- **Avoid Reserved Keywords:** Be mindful of keywords in JavaScript, TypeScript, SQL, and your frameworks.

## 1. Next.js 15 (App Router)

Next.js App Router has very specific file-system conventions that dictate routing and component rendering.

### Route Segments (Folders):
- **Lowercase, kebab-case:** For static route segments (folders that define paths). E.g., `app/users/[user-id]/settings/page.tsx`.
- **Dynamic Segments:** Use square brackets `[]` for dynamic segments. E.g., `[user-id]`, `[slug]`. For catch-all segments, use `[...]`. For optional catch-all, use `[[...]]`.

### Files within Route Segments:
- **page.tsx:** Must be `page.tsx` (all lowercase). This file defines the UI for a route segment.
- **layout.tsx:** Must be `layout.tsx` (all lowercase). Defines shared UI for a segment and its children.
- **loading.tsx:** Must be `loading.tsx` (all lowercase). Defines loading UI.
- **error.tsx:** Must be `error.tsx` (all lowercase). Defines error UI.
- **not-found.tsx:** Must be `not-found.tsx` (all lowercase). Defines not-found UI.
- **template.tsx:** Must be `template.tsx` (all lowercase). Similar to layout but creates a new instance on navigation.
- **route.ts / route.js:** For API routes (all lowercase).

### Components (within components/ or ui/ folders):
- **PascalCase:** For React components. E.g., `UserProfileCard.tsx`, `DashboardLayout.tsx`.
- **Folders for related components:** Use PascalCase for all folders containing related components, or representing a feature/module. E.g., `components/UserProfile/UserProfileCard.tsx` or `components/Dashboard/DashboardLayout.tsx`.
- **Hooks:** See React section.

## 2. React 19

React follows standard JavaScript/TypeScript conventions with some React-specific additions.

### Components:
- **PascalCase:** Always for component names and their filenames. E.g., `MyComponent.tsx`, `Button.tsx`.
- **Props:** camelCase. E.g., `userName`, `onClick`.

### Hooks (Custom Hooks):
- **use prefix + camelCase:** Always start with `use`. E.g., `useAuth`, `useFormValidation`, `useDebounce`.
- **Filenames:** `useAuth.ts`, `useFormValidation.ts`.

### State Variables:
- **camelCase** for the variable. **set prefix + PascalCase** for the setter function. E.g., `const [count, setCount] = useState(0);`

### Event Handlers:
- **on prefix + PascalCase** for props. E.g., `onClick`, `onInputChange`.
- **handle prefix + PascalCase** for internal component functions. E.g., `handleChange`, `handleSubmit`.

### Context:
- **PascalCase** for the context object. E.g., `AuthContext`.
- **use prefix + PascalCase** for the custom hook to consume context. E.g., `useAuthContext`.

## 3. tRPC 11

tRPC procedures are essentially functions, so standard function naming applies, but with an emphasis on clarity for API endpoints.

### Procedure Names:
- **camelCase:** For individual procedure names. E.g., `getUser`, `createUser`, `updateUser`, `deleteUser`.
- **Descriptive Verbs:** Start with a verb that describes the action. E.g., `get`, `create`, `update`, `delete`, `list`, `send`, `verify`.
- **Input/Output Types:** Use PascalCase for Zod schemas or TypeScript interfaces. E.g., `CreateUserInput`, `UserOutput`.

### Routers:
- **camelCase + Router suffix:** E.g., `userRouter`, `postRouter`, `authRouter`.
- **appRouter:** For the root router.

### File Structure:
Organize procedures into logical routers, typically in `server/routers/`.
- `server/routers/user.ts` (containing 'userRouter')
- `server/routers/post.ts` (containing 'postRouter')

## 4. TanStack Query 5

Query keys are critical for caching and invalidation. They should be arrays that uniquely identify your data.

### Query Keys:
- **Array of strings/objects:** The first element is typically the entity name (kebab-case or camelCase). Subsequent elements are IDs or filters.
- **Consistency:** Define them centrally or use a helper function to ensure consistency.

### Examples:
```javascript
['todos']
['todos', todoId]
['users', { status: 'active', page: 1 }]
['posts', postId, 'comments']
```

- **queryFn / mutationFn:** camelCase for the function names.

## 5. Supabase (PostgreSQL Database & RLS)

Supabase uses PostgreSQL, so SQL naming conventions are paramount. Conflicts often arise here if you use camelCase, which SQL doesn't naturally support without quoting.

### Tables:
- **snake_case:** All lowercase, words separated by underscores. This is the standard SQL convention and avoids issues with case sensitivity or needing to quote identifiers.
- **Plural nouns:** E.g., `users`, `products`, `orders`.

### Columns:
- **snake_case:** All lowercase, words separated by underscores. E.g., `first_name`, `created_at`, `is_active`.
- **Foreign Keys:** Typically `related_table_singular_id`. E.g., `user_id`, `product_id`.
- **Primary Keys:** Conventionally `id` (snake_case is still `id`).

### Functions (PostgreSQL Functions/Triggers/RPC):
- **snake_case:** All lowercase, words separated by underscores. E.g., `get_user_profile`, `update_order_status`.

### Views:
- **snake_case:** E.g., `active_users_view`.

### Row Level Security (RLS) Policies:
- **Descriptive names, often snake_case:** E.g., `enable_read_access_for_users`.

## Avoiding Naming Conflicts & Best Practices

1. **Database First (for shared names):** If a name exists in your database (e.g., `user_id`), try to use that exact snake_case name when interacting with it in your backend code (tRPC inputs/outputs) and even frontend types if possible. When converting to camelCase for JavaScript/React, do so consistently (e.g., `userId`). Many ORMs/libraries handle this conversion automatically (e.g., supabase-js often returns camelCase for snake_case columns).

2. **TypeScript for Type Safety:** Leverage TypeScript extensively. Define types for your database rows, tRPC inputs/outputs, and React props. This catches many potential naming mismatches at compile time.

3. **Monorepo Aliases:** You're using a monorepo (`@codexcrm/*`). Ensure your `tsconfig.json` and `jsconfig.json` (if applicable) have consistent path aliases to avoid import conflicts.

4. **Shared Constants/Enums:** For things like authentication page paths (`AUTH_PAGES`, `DASHBOARD_PATH`, `LOG_IN_PATH` from `@codexcrm/config`), centralize them in a shared package. This prevents typos and ensures consistency across your app.

5. **Code Formatters & Linters:** Use tools like Prettier and ESLint with rules for naming conventions (e.g., `@typescript-eslint/naming-convention`). This automates consistency and catches deviations.

6. **Documentation:** Keep a small internal style guide or a `CONTRIBUTING.md` file that outlines your chosen conventions.

By following these guidelines, you'll create a codebase that is not only functional but also highly maintainable and easy for any developer to understand and contribute to.