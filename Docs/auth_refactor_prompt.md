<task>
Modernize the authentication layer and app architecture using Next.js 15 and React 19 best practices.
Our codebase is outdated and uses legacy structures like `getSession()` and file groupings that don't follow App Router conventions.
</task>

<goal>
- Adopt the App Router file/folder structure
- Refactor all auth logic to Supabase's recommended SSR `getUser()` flow
- Implement folder-based layouts, middleware, and loading/error boundaries
- Integrate React 19 features as applicable
- Restructure TanStack Query usage for modern best practices
- Use tRPC v11 and Zod 4 in a type-safe and scalable way
</goal>

<docs>
Please use the following documentation files to inform your implementation:

📁 `Docs/official-documentation/nextjs15`
- `nextjs_app_router_documentation.md`
- `nextjs-best-practices.md`
- `nextjs15_release_briefing.md`

📁 `Docs/official-documentation/react19`
- `react-best-practices.md`
- `react-hook-form-best-practices.md`
- `react19_ecosystem_guide.md`

📁 `Docs/official-documentation/tRPC`
- `trpc-migration-guide.md`
- `trpc-nextjs-optimization.md`
- `trpc-rsc-guide.md`
- `trpc-v11-react19-next15.md`

📁 `Docs/official-documentation/tanstack`
- `tanstack_query_nextjs_guide.md`
- `tanstack_query_advanced_techniques.md`

📁 `Docs/official-documentation/typescript`
- `typescript_best_practices.md` *(optional)*
</docs>

<methodology>
1. Skim the above documentation and quote the most relevant best practices to this refactor
2. Create a 3-phase implementation plan based on those quotes
3. Apply the changes in a logical order, leaving the app broken if necessary during the process
4. Log reasoning and key decisions in the <scratchpad>
</methodology>

<restrictions>
You are allowed to break the code temporarily if your plan will resolve the issues by the end of the implementation.
Do not stop to fix isolated runtime or type errors unless they indicate a deeper problem with your strategy.
</restrictions>

<output_format>
Please respond using the following structure:
- <quotes>: Key passages from the documentation used to inform the plan
- <plan>: Summary of intended implementation steps
- <scratchpad>: Live reasoning, insights, concerns, and state tracking
- <code>: Once ready, begin implementing the changes in code
</output_format>
