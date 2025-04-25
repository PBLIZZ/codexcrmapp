# CodexCRM

> **NOTE:** For the current sprint status and remaining tasks, please refer to [Sprint1-Status.md](./Sprint1-Status.md) which contains the most up-to-date information.

A simple CRM application built with a modern full-stack TypeScript setup.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **API:** [tRPC](https://trpc.io/) (v10 - *migration to v11 planned*)
- **Database & Auth:** [Supabase](https://supabase.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Client State/Caching:** [TanStack Query](https://tanstack.com/query/latest) (v4 - *migration to v5 planned*)
- **Validation:** [Zod](https://zod.dev/)
- **Package Manager:** [pnpm](https://pnpm.io/) (Workspaces)
- **Deployment:** [Vercel](https://vercel.com/)

## Project Structure

This project uses a pnpm monorepo structure:

- `apps/web`: The Next.js frontend application.
- `packages/server`: tRPC router definitions and API logic.
- `packages/db`: (Planned) Database schema definitions/migrations (using Supabase CLI).
- `packages/ui`: (Planned) Shared React UI components.
- `packages/jobs`: (Planned) Background job processing.

Path aliases are configured:
- `@/*`: Within `apps/web` for internal imports (e.g., `@/components/ui/button`).
- `@codexcrm/*`: For cross-package imports (e.g., `import { appRouter } from '@codexcrm/server/src/root'`).

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm (v9 or v10 recommended - install via `npm install -g pnpm`)
- Supabase account and project setup.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PBLIZZ/codexcrmapp.git
    cd codexcrmapp
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    - Create a `.env.local` file in the `apps/web` directory (`apps/web/.env.local`).
    - Add the following variables, replacing the placeholder values with your actual Supabase credentials:
      ```dotenv
      NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
      NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
      SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY # Keep this secret!
      # Optional: Add SUPABASE_JWT_SECRET if needed for specific auth flows
      ```
    - You can find these keys in your Supabase project dashboard under Project Settings > API.

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    This will start the Next.js app, usually on [http://localhost:3000](http://localhost:3000).

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (e.g., GitHub, GitLab).
2.  Import the project into Vercel.
3.  **Configure Project Settings:**
    - Set the **Framework Preset** to `Next.js`.
    - Set the **Root Directory** to `apps/web`.
    - Ensure the **Build Command** uses pnpm (Vercel usually detects this automatically, but you might need to override if necessary: `pnpm build`).
    - Ensure the **Install Command** uses pnpm (Vercel usually detects this automatically, but you might need to override if necessary: `pnpm install`).
4.  **Configure Environment Variables:**
    - Add the same environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) in the Vercel project settings.

## Current Status (Sprint 1 - April 2025)

- Core monorepo structure setup.
- Next.js, tRPC, Supabase, TanStack Query integrated.
- Basic email/password/magic link authentication working.
- `clients` tRPC router created with a protected `list` procedure.
- `/clients` page displays a list of clients for authenticated users.
- GitHub Actions CI (CodeQL) configured and passing.
- Vercel deployment pipeline configured and working.

## Next Steps (Potential)

- Implement full CRUD operations for Clients.
- Add Google OAuth.
- Implement Password Reset UI flow.
- Refine UI/UX, loading states, and error handling.
- Set up database migrations (`packages/db`).
