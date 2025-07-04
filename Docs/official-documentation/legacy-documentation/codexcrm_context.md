# CodexCRM Implementation Context

## Project Overview

CodexCRM is a wellness CRM application being migrated from a simple Next.js structure (`shadcn-supabase-app`) to a sophisticated monorepo architecture. The project aims to build a comprehensive practice management system for wellness practitioners with end-to-end type safety, robust security through Row Level Security (RLS), and AI-first development workflows.

## Core Architecture Vision

### Monorepo Structure

The application is being restructured into a Turborepo-managed workspace with the following organization:

```
codexcrmapp/
├── apps/
│   └── web/                 # Next.js 14 frontend (renamed from shadcn-supabase-app)
├── packages/
│   ├── server/              # tRPC routers, auth context, middlewares
│   ├── db/                  # Drizzle schemas, migrations, types
│   ├── jobs/                # Supabase Edge Functions, webhooks
│   └── ui/                  # Extracted shadcn components (optional)
├── supabase/                # CLI config, SQL migrations
├── .github/workflows/       # CI/CD pipelines
└── turbo.json              # Build optimization
```

### Technology Stack

- **Frontend**: Next.js 14 App Router with React Server Components
- **Backend**: tRPC v11 for type-safe APIs
- **Database**: PostgreSQL via Supabase with Row Level Security
- **ORM**: Drizzle for type-safe database operations
- **Auth**: Supabase Auth with server-side session management
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Monorepo**: pnpm workspaces with Turborepo optimization
- **Background Jobs**: Supabase Edge Functions (Deno runtime)

## Security Model

### Row Level Security (RLS)

All data tables implement user-based isolation through PostgreSQL RLS policies. The standard "owner can read/write" policy pattern ensures practitioners can only access their own clients, sessions, and related data:

```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

### Authentication Architecture

- Server-side session validation using `@supabase/ssr`
- Page protection through React Server Components
- Route-level authentication checks before rendering sensitive content
- Client-side context via SupabaseProvider for interactive features

## Data Model

### Core Entities

The application manages several interconnected entities typical of a practice management system:

- **Clients**: Patient/client records with contact information and enrichment data
- **Services**: Offerings (massage, consultation, etc.) with duration and pricing
- **Programs**: Multi-session packages or treatment plans
- **Sessions**: Individual appointments with attendance tracking
- **Payments**: Financial transactions linked to services/sessions
- **Notes**: Session notes and follow-up reminders

### Type Safety Strategy

- Database types generated via `supabase gen types typescript`
- Drizzle ORM introspection for runtime type safety
- Shared Zod schemas for validation across packages
- tRPC procedures ensuring end-to-end type consistency

## Development Workflow

### AI-First Approach

The project embraces AI-powered development with specific prompting strategies:

- Automated import path updates during monorepo migration
- Code generation for repetitive patterns (CRUD operations, forms)
- Consistent application of architectural patterns
- Strict preservation of type safety during refactoring

### Migration Strategy

The transition from single-app to monorepo follows a specific sequence:

1. Security implementation (RLS, page protection)
2. Structural reorganization (file moves, workspace setup)
3. Shared resource extraction (types, configs, utilities)
4. Background job architecture
5. Testing infrastructure

### Zero-Downtime Deployments

Database schema changes use PostgreSQL views as an abstraction layer:

- Application code queries views instead of tables directly
- Migrations update underlying tables then atomically replace views
- Edge Functions maintain compatibility during deployments

## Background Processing

### Edge Functions Architecture

Supabase Edge Functions handle asynchronous work:

- **Contact Enrichment**: External API integration for client data enhancement
- **Transcription**: Audio note processing with follow-up generation
- **Webhook Handling**: Stripe payments, Calendly sync
- **Scheduled Tasks**: Recurring data processing

### Job Trigger Patterns

- Database webhooks for real-time processing
- Storage events for file-based triggers
- HTTP endpoints for external system integration
- Scheduled functions for periodic tasks

## Environment Management

### Secret Handling

Clear separation of client and server-side secrets:

- **Public**: `NEXT_PUBLIC_*` variables for browser-accessible values
- **Server**: Service role keys, API tokens for backend/Edge Functions only
- **Development**: Local `.env` files with production parity
- **Production**: Platform-specific environment variable management

### Deployment Strategy

- Preview deployments with isolated Supabase branches
- Automated testing on pull requests
- Migration validation before production deployment
- Rollback capabilities through version-controlled migrations

## Testing Philosophy

### Unit Testing

Vitest-based testing focuses on:

- tRPC router procedure validation
- Database client initialization
- Core business logic isolation
- Mocked external service interactions

### End-to-End Testing

Playwright scenarios cover:

- Complete authentication flows
- CRUD operations through the UI
- Cross-page navigation and state management
- Error handling and edge cases

## Integration Points

### External Services

The system integrates with various third-party services:

- **Stripe**: Payment processing and webhook handling
- **Calendly**: Appointment scheduling synchronization
- **Clearbit/similar**: Contact data enrichment
- **Whisper API**: Audio transcription services

### Model Context Protocol (MCP)

Future-proofing for AI agent integration:

- Standardized function manifests for tRPC procedures
- OpenAPI-like documentation for Edge Functions
- Agent-friendly endpoint discovery
- Natural language to API operation mapping

## Performance Considerations

### Build Optimization

Turborepo configuration optimizes development and build processes:

- Cached builds across workspace packages
- Parallel execution of independent tasks
- Incremental builds for faster iterations
- Shared dependency management

### Database Performance

- Efficient RLS policy design
- Strategic indexing on user_id columns
- View-based abstraction for complex queries
- Connection pooling through Supabase

## Implementation Priorities

The sprint structure prioritizes foundational elements before advanced features:

**Sprint 1**: Core security, monorepo structure, basic CRUD operations
**Later Sprints**: Advanced integrations, background processing, optimization

This approach ensures a solid foundation before adding complexity, with each component building on previously established patterns and security measures.

## Current Implementation Status

The user has begun with Item 1 (page protection via server-side session checking) but encountered initial setup questions regarding tooling and dependencies. The prerequisite steps include:

- Ensuring proper terminal positioning in the codexcrmapp directory
- Installing required tooling (Node.js, pnpm, Supabase CLI)
- Adding necessary dependencies (`@supabase/ssr`, `@supabase/supabase-js`)
- Creating authentication helper functions
- Implementing server-side session validation in protected routes

The implementation follows a careful, methodical approach where each component builds upon previous work, ensuring type safety and security are maintained throughout the migration process.

# CodexCRM Implementation Stage 2 Context

## Project Overview

CodexCRM is a wellness CRM application being migrated from a simple Next.js structure (`shadcn-supabase-app`) to a sophisticated monorepo architecture. The project aims to build a comprehensive practice management system for wellness practitioners with end-to-end type safety, robust security through Row Level Security (RLS), and AI-first development workflows.

## Core Architecture Vision

### Monorepo Structure

The application is being restructured into a Turborepo-managed workspace with the following organization:

```
codexcrmapp/
├── apps/
│   └── web/                 # Next.js 14 frontend (renamed from shadcn-supabase-app)
├── packages/
│   ├── server/              # tRPC routers, auth context, middlewares
│   ├── db/                  # Drizzle schemas, migrations, types
│   ├── jobs/                # Supabase Edge Functions, webhooks
│   └── ui/                  # Extracted shadcn components (optional)
├── supabase/                # CLI config, SQL migrations
├── .github/workflows/       # CI/CD pipelines
└── turbo.json              # Build optimization
```

### Technology Stack

- **Frontend**: Next.js 14 App Router with React Server Components
- **Backend**: tRPC v11 for type-safe APIs
- **Database**: PostgreSQL via Supabase with Row Level Security
- **ORM**: Drizzle for type-safe database operations
- **Auth**: Supabase Auth with server-side session management
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Monorepo**: pnpm workspaces with Turborepo optimization
- **Background Jobs**: Supabase Edge Functions (Deno runtime)

## Security Model

### Row Level Security (RLS)

All data tables implement user-based isolation through PostgreSQL RLS policies. The standard "owner can read/write" policy pattern ensures practitioners can only access their own clients, sessions, and related data:

```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

### Authentication Architecture

- Server-side session validation using `@supabase/ssr`
- Page protection through React Server Components
- Route-level authentication checks before rendering sensitive content
- Client-side context via SupabaseProvider for interactive features

## Data Model

### Core Entities

The application manages several interconnected entities typical of a practice management system:

- **Clients**: Patient/client records with contact information and enrichment data
- **Services**: Offerings (massage, consultation, etc.) with duration and pricing
- **Programs**: Multi-session packages or treatment plans
- **Sessions**: Individual appointments with attendance tracking
- **Payments**: Financial transactions linked to services/sessions
- **Notes**: Session notes and follow-up reminders

### Type Safety Strategy

- Database types generated via `supabase gen types typescript`
- Drizzle ORM introspection for runtime type safety
- Shared Zod schemas for validation across packages
- tRPC procedures ensuring end-to-end type consistency

## Development Workflow

### AI-First Approach

The project embraces AI-powered development with specific prompting strategies:

- Automated import path updates during monorepo migration
- Code generation for repetitive patterns (CRUD operations, forms)
- Consistent application of architectural patterns
- Strict preservation of type safety during refactoring

### Migration Strategy

The transition from single-app to monorepo follows a specific sequence:

1. Security implementation (RLS, page protection)
2. Structural reorganization (file moves, workspace setup)
3. Shared resource extraction (types, configs, utilities)
4. Background job architecture
5. Testing infrastructure

### Zero-Downtime Deployments

Database schema changes use PostgreSQL views as an abstraction layer:

- Application code queries views instead of tables directly
- Migrations update underlying tables then atomically replace views
- Edge Functions maintain compatibility during deployments

## Background Processing

### Edge Functions Architecture

Supabase Edge Functions handle asynchronous work:

- **Contact Enrichment**: External API integration for client data enhancement
- **Transcription**: Audio note processing with follow-up generation
- **Webhook Handling**: Stripe payments, Calendly sync
- **Scheduled Tasks**: Recurring data processing

### Job Trigger Patterns

- Database webhooks for real-time processing
- Storage events for file-based triggers
- HTTP endpoints for external system integration
- Scheduled functions for periodic tasks

## Environment Management

### Secret Handling

Clear separation of client and server-side secrets:

- **Public**: `NEXT_PUBLIC_*` variables for browser-accessible values
- **Server**: Service role keys, API tokens for backend/Edge Functions only
- **Development**: Local `.env` files with production parity
- **Production**: Platform-specific environment variable management

### Deployment Strategy

- Preview deployments with isolated Supabase branches
- Automated testing on pull requests
- Migration validation before production deployment
- Rollback capabilities through version-controlled migrations

## Testing Philosophy

### Unit Testing

Vitest-based testing focuses on:

- tRPC router procedure validation
- Database client initialization
- Core business logic isolation
- Mocked external service interactions

### End-to-End Testing

Playwright scenarios cover:

- Complete authentication flows
- CRUD operations through the UI
- Cross-page navigation and state management
- Error handling and edge cases

## Integration Points

### External Services

The system integrates with various third-party services:

- **Stripe**: Payment processing and webhook handling
- **Calendly**: Appointment scheduling synchronization
- **Clearbit/similar**: Contact data enrichment
- **Whisper API**: Audio transcription services

### Model Context Protocol (MCP)

Future-proofing for AI agent integration:

- Standardized function manifests for tRPC procedures
- OpenAPI-like documentation for Edge Functions
- Agent-friendly endpoint discovery
- Natural language to API operation mapping

## Performance Considerations

### Build Optimization

Turborepo configuration optimizes development and build processes:

- Cached builds across workspace packages
- Parallel execution of independent tasks
- Incremental builds for faster iterations
- Shared dependency management

### Database Performance

- Efficient RLS policy design
- Strategic indexing on user_id columns
- View-based abstraction for complex queries
- Connection pooling through Supabase

## Implementation Priorities

The sprint structure prioritizes foundational elements before advanced features:

**Sprint 1**: Core security, monorepo structure, basic CRUD operations
**Later Sprints**: Advanced integrations, background processing, optimization

This approach ensures a solid foundation before adding complexity, with each component building on previously established patterns and security measures.

## Current Implementation Challenges

### Sprint 1 Progress Assessment

The project has undergone significant refactoring efforts with mixed results. While the monorepo structure has been established and key dependencies upgraded, several critical issues remain unresolved that prevent Sprint 1 completion.

### Technical Debt Accumulation

During the implementation process, multiple technical debt items have emerged:

**Build System Issues**: TypeScript compilation failures due to dependency conflicts between React Query v4 and v5, improper file extensions (.ts vs .tsx), and misconfigured path aliases causing import resolution failures.

**tRPC Integration Problems**: The API router configuration has encountered issues with proper context creation and route handler setup, preventing the backend-frontend communication layer from functioning correctly.

**Authentication Flow Gaps**: While server-side session management utilities exist, the complete authentication flow with proper page protection and client-side state management remains incomplete.

**Development Environment Instability**: Local development setup has been complicated by Supabase CLI binary issues, requiring manual approval of build scripts and dependency conflicts.

### Key Blockers Identified

**TypeScript Configuration**: The monorepo's TypeScript setup requires refinement to properly handle workspace package imports and JSX compilation. Current path aliases like `@codexcrm/server/*` are not resolving correctly, and React component files need proper .tsx extensions.

**Dependency Management**: The transition to newer versions (React 19, Next.js 15, TanStack Query v5) has created compatibility issues that require systematic resolution rather than piecemeal fixes.

**File Structure Recovery**: During the monorepo migration, some application files were inadvertently moved or deleted, requiring restoration from the GitHub repository and careful re-establishment of the correct directory structure.

### Lessons Learned

**Incremental Migration Strategy**: The ambitious attempt to migrate multiple systems simultaneously (monorepo structure, dependency upgrades, authentication refactor, tRPC integration) proved too complex for a single sprint. A more incremental approach would have been more manageable.

**AI Assistant Limitations**: While AI tools provided extensive guidance, they occasionally suggested fixes that didn't address root causes or were contextually inappropriate for the specific project setup. Human judgment and systematic debugging proved essential.

**Testing Infrastructure Dependency**: Without a working build system, implementing proper testing infrastructure became impossible, creating a dependency chain that blocked progress verification.

## Recovery Strategy

### Immediate Priorities

The focus should shift to establishing a minimal viable foundation:

1. **Build System Stabilization**: Ensure TypeScript compilation succeeds across all packages
2. **Basic Authentication Flow**: Implement simple server-side session checking without complex tRPC integration
3. **Single Page Implementation**: Get one protected page working end-to-end before expanding
4. **Development Environment**: Establish reliable local development workflow

### Simplified Sprint 1 Goals

Rather than attempting the full implementation originally planned, Sprint 1 should focus on:

- Functional monorepo structure with working builds
- Basic Next.js application running in `apps/web`
- Simple page protection using Supabase Auth
- One working API endpoint (traditional Next.js API route before tRPC)
- Database connection with RLS enabled

### Future Sprint Planning

Subsequent sprints should introduce complexity incrementally:

- **Sprint 2**: tRPC integration with proper testing
- **Sprint 3**: Complete authentication flows and user management
- **Sprint 4**: Background jobs and external integrations
- **Sprint 5**: Performance optimization and advanced features

This revised approach acknowledges the complexity of modern full-stack applications and the importance of establishing solid foundations before adding sophisticated patterns and integrations.

## Current Implementation Status

The user has begun with Item 1 (page protection via server-side session checking) but encountered initial setup questions regarding tooling and dependencies. The prerequisite steps include:

- Ensuring proper terminal positioning in the codexcrmapp directory
- Installing required tooling (Node.js, pnpm, Supabase CLI)
- Adding necessary dependencies (`@supabase/ssr`, `@supabase/supabase-js`)
- Creating authentication helper functions
- Implementing server-side session validation in protected routes

The implementation follows a careful, methodical approach where each component builds upon previous work, ensuring type safety and security are maintained throughout the migration process.

# CodexCRM Implementation Context - Monorepo Migration Challenges

## Project Status Overview

Peter Blizzard's CodexCRM project represents a complex wellness practice management system undergoing migration from a simple Next.js application (`shadcn-supabase-app`) to a sophisticated monorepo architecture. The implementation has encountered significant technical challenges during Sprint 1, with multiple attempts at restructuring resulting in build failures and configuration issues.

## Current Implementation State

### Monorepo Structure Challenges

The migration from `shadcn-supabase-app` to the new monorepo structure has proven problematic. The intended structure aims for:

- **apps/web**: Next.js 14/15 frontend application
- **packages/server**: tRPC routers and backend logic
- **packages/db**: Database schemas, types, and migrations
- **packages/jobs**: Supabase Edge Functions
- **packages/ui**: Shared UI components
- **supabase/**: CLI configuration and migrations

However, the file movement operations resulted in nested directory issues (apps/web/apps/web) and inadvertent deletion of core application files during cleanup attempts.

### Technical Debt Accumulation

The engineering handover document reveals substantial technical debt:

- **TypeScript Build Failures**: Approximately 150 errors primarily from React Query v4/v5 type conflicts
- **tRPC Adapter Issues**: Incorrect router imports and context creation problems
- **Dependency Conflicts**: Mixed versions of React Query and incomplete package linking
- **Path Resolution Problems**: TypeScript aliases failing to resolve correctly after file moves

### Authentication and Security Implementation

Row Level Security (RLS) policies have been configured for user data isolation, with standard "owner can read/write" patterns applied across data tables. The authentication flow uses Supabase server-side helpers with cookie-based session management, though the implementation remains fragmented across the migration.

## Core Architecture Decisions

### Database and Type Safety Strategy

The project employs a multi-layered approach to type safety:

- Supabase-generated TypeScript types for database schema
- Optional Drizzle ORM integration for enhanced query building
- Shared Zod schemas for validation across packages
- tRPC procedures ensuring end-to-end type consistency

### Background Processing Architecture

Supabase Edge Functions handle asynchronous operations including:

- Contact data enrichment through external APIs
- Audio transcription with follow-up generation
- Webhook processing for Stripe and Calendly integration
- Scheduled maintenance tasks

## Sprint 1 Implementation Challenges

### File Structure Recovery Issues

The monorepo migration encountered critical problems during directory restructuring. Initial file movements resulted in incorrect nesting, and subsequent cleanup operations inadvertently removed essential Next.js application files. Despite GitHub repository backup availability, the local development environment requires complete reconstruction.

### Build System Complications

The transition to pnpm workspaces with Turborepo optimization has introduced build complexities:

- Package linking failures between workspace dependencies
- TypeScript configuration conflicts between root and package-level configs
- ESLint configuration inheritance issues
- Dependency hoisting problems with React Query versions

### Development Environment Stability

Local development setup faces multiple stability issues:

- Supabase CLI integration requiring build script approval
- Database migration synchronization between local and remote environments
- Environment variable management across multiple packages
- tRPC client-server communication failures

## Technical Implementation Gaps

### Incomplete tRPC Integration

The tRPC implementation remains partially configured:

- Router exports not properly aligned between client and server
- Context creation function missing required request handling
- React Query provider integration incomplete
- API route handler configuration errors

### Testing Infrastructure Gaps

Both unit and end-to-end testing frameworks require completion:

- Vitest configuration depends on successful TypeScript compilation
- Playwright setup blocked by development server startup failures
- Mock strategies undefined for external service integration
- Test environment isolation not established

## Recovery Strategy Requirements

### Immediate Priorities

The project requires systematic recovery focusing on:

1. **File Structure Restoration**: Proper placement of Next.js application files within apps/web
2. **Dependency Resolution**: Elimination of React Query version conflicts
3. **TypeScript Configuration**: Correction of path aliases and compilation settings
4. **Build System Validation**: Successful compilation before feature development

### Sprint 1 Completion Goals

Despite the setbacks, Sprint 1 objectives remain focused on foundational elements:

- Functional monorepo structure with proper package isolation
- Basic authentication and page protection implementation
- Single tRPC endpoint (clients) with React Query integration
- Database schema with RLS policies enabled
- Minimal testing framework establishment

## Lessons from Implementation Challenges

### File Migration Complexity

The monorepo migration revealed the complexity of moving established codebases. File operations that seem straightforward can cascade into multiple dependency and configuration issues, particularly when involving build tools and TypeScript path resolution.

### Dependency Management Challenges

Modern JavaScript ecosystems with multiple package managers, workspace configurations, and peer dependency requirements create fragile environments where version mismatches can prevent successful builds.

### Tool Integration Friction

Combining multiple sophisticated tools (Next.js, tRPC, Supabase, Turborepo, pnpm workspaces) introduces integration challenges that require careful sequencing and configuration alignment.

## Current Development Methodology

### AI-Assisted Development Approach

The project heavily relies on AI assistance for code generation and problem resolution, though this has led to some false confidence in fixes that don't address root causes. The implementation log shows multiple attempts at resolution that didn't achieve lasting stability.

### Incremental Recovery Strategy

Rather than attempting comprehensive fixes, the current approach favors incremental restoration of functionality, starting with basic compilation and build success before advancing to feature implementation.

## Future Considerations

### Architectural Validation

Once Sprint 1 stabilizes, the architecture should be validated through:

- Successful end-to-end data flow from database through tRPC to frontend
- Authentication flow completion with proper session management
- Background job execution and webhook handling
- Testing framework operation with meaningful coverage

### Scalability Preparation

The monorepo structure, while currently problematic, positions the project for future scalability with proper package isolation, shared dependencies, and build optimization through Turborepo.

## Implementation Context Summary

Peter's CodexCRM project represents an ambitious wellness practice management system with sophisticated technical requirements. The monorepo migration attempt has highlighted the complexity of modern full-stack development with multiple integrated tools and frameworks. While Sprint 1 has encountered significant technical challenges, the foundational architecture decisions remain sound, and the GitHub repository provides a reliable recovery point for systematic reconstruction of the development environment.

# CodexCRM Build and Deployment Context

## Technology Evaluation and Prioritization

### Peripheral Technologies Assessment

The development process involved evaluating several technologies that ultimately proved tangential to current deployment challenges:

**MCP (Model Context Protocol)**: Enables AI tools to interact directly with external services through predefined tools, allowing commands like "Create a Supabase project" to be executed by AI assistants. While useful for developer productivity, it has zero relevance to fixing build errors, connecting Next.js to Supabase for auth/data, or achieving successful deployment. It's a development tool enhancement, not part of runtime architecture.

**Next.js/Supabase Tutorial Structure**: Provides reference patterns for standard non-monorepo setups using @supabase/ssr with helpers in utils/supabase/ and middleware.ts. The tutorial shows fundamental patterns applicable to apps/web context, but diverges from the project's monorepo approach which uses tRPC in packages/server rather than direct Supabase calls or Server Actions.

**Shadcn UI Monorepo Integration**: Critical for component management in workspace environments. The latest Shadcn CLI understands monorepos, installing core UI components into packages/ui and app-specific components into apps/web/components. Requires proper components.json configuration in each workspace with correct alias setup (@workspace/ui vs project's @codexcrm/\* scope).

## Critical Deployment Blocker

### Build Process Dependency Chain

The absolute priority issue identified: Vercel deployment failure due to build process requirements. Vercel executes `pnpm install` followed by `pnpm build` (or `pnpm --filter @codexcrm/web build`). Local build failures with "Module not found" errors will inevitably cause Vercel deployment failures.

### TypeScript Type Resolution Issue

The core technical blocker manifested as a specific tRPC type error:

```
./app/clients/page.tsx:6:45
Type error: Property 'list' does not exist on type '"The property 'useContext' in your router collides with a built-in method, rename this router or procedure on your backend."'
```

This error indicated that the tRPC client (api object in apps/web/src/lib/trpc/client.ts) wasn't correctly typed with the AppRouter from packages/server/src/root.ts, suggesting path alias resolution or export configuration problems.

### Systematic Verification Requirements

The resolution approach focused on three critical verification points:

1. **Server Router Configuration**: Ensuring packages/server/src/root.ts exists with proper `export type AppRouter = typeof appRouter;` declaration
2. **Client Import Configuration**: Verifying apps/web/src/lib/trpc/client.ts correctly imports AppRouter using path aliases and creates the typed React client
3. **Component Usage Validation**: Confirming apps/web/app/clients/page.tsx imports and uses the API correctly with proper hook invocation

## Implementation Success and Current Status

### Build Resolution Achievement

Significant progress achieved through tRPC version mismatch resolution and systematic debugging. The local build process now succeeds, representing a fundamental milestone after extensive configuration refinement.

### Core Architecture Stabilization

The monorepo structure achieved stability with proper Next.js App Router integration, tRPC v11 routers with typed context, and functioning path aliases across packages. TypeScript configuration issues that previously blocked compilation have been resolved.

### Client Management Implementation

Comprehensive client management system implemented with ClientsContent.tsx providing full CRUD interface. The system includes tRPC integration with typed procedures, form handling with validation, and end-to-end data pipeline from UI through tRPC to Supabase.

## Current Authentication Challenge

### Supabase Rate Limiting Blocker

Authentication testing blocked by Supabase `over_email_send_rate_limit` error. This prevents validation of:

- Login flow completion and testing
- Protected route access verification
- Client form submission with database persistence
- Complete user workflow validation

Rate limiting appears project-specific rather than IP-based, requiring either waiting for automatic reset or potential Supabase support contact.

### Testing Workflow Impact

The authentication blocker prevents comprehensive end-to-end testing of implemented features. While the UI components and tRPC procedures are implemented, the complete user journey from authentication through client data operations cannot be validated.

## Sprint 1 Near-Completion Context

### Infrastructure Achievements

- Local build success with TypeScript compilation
- Monorepo package isolation and path alias resolution
- tRPC client-server type safety implementation
- Client management interface with CRUD operations
- Database schema with Row Level Security configuration

### Remaining Validation Requirements

Authentication rate limit resolution to enable:

- Login flow testing and protected route validation
- Client form submission with database verification
- Complete user workflow from authentication to data operations
- Production deployment preparation with Vercel-Supabase connection

## Future AI Integration Strategy

### Post-Infrastructure AI Workflow Planning

With core infrastructure stabilized, the roadmap includes AI-powered contact management features integrated into the CRM foundation rather than retrofitted afterward. Planned capabilities include contact enrichment, AI summarization, task suggestions, communication drafting, and sentiment analysis.

The implementation strategy involves tRPC procedures for user-triggered actions, Edge Functions for background processing, database extensions for AI-generated content, and native UI integration within existing workflows.

## Development Methodology Insights

### AI-Assisted Development Approach

The implementation revealed both benefits and limitations of heavy AI assistance. While effective for code generation and pattern identification, some AI-suggested fixes didn't address root causes, requiring systematic verification approaches and iterative debugging cycles.

### Build-First Deployment Strategy

The focus on achieving local build success before addressing deployment proved essential. This approach revealed that apparent deployment issues were actually build configuration problems requiring resolution in the development environment first.

## Implementation Context Summary

The CodexCRM project has progressed from complex monorepo migration challenges to stabilized build success with comprehensive client management capabilities. The current authentication rate limiting represents the final blocker before Sprint 1 completion and production deployment validation.

The technical architecture decisions throughout implementation position the project well for future AI feature integration and scalability, despite the complexity encountered during initial setup and configuration phases.

# CodexCRM RLS Resolution and Client Features Context

## Application Stability Assessment

Peter Blizzard's CodexCRM project has reached a critical milestone in Sprint 1 completion. The application demonstrates significant stability improvements with successful local builds, working client creation and editing functionality, and resolved authentication flows including magic link implementation.

## Current Application State

### Build and Deployment Success

The project achieves successful compilation with `pnpm run build` completing without errors. The monorepo structure with packages/server, packages/db, packages/ui, and apps/web functions correctly with proper TypeScript path alias resolution. Vercel deployment pipeline operates successfully, requiring GitHub commits to trigger deployments.

### Authentication Implementation Status

Multiple authentication methods have been implemented and tested:

- **Email/Password Authentication**: Functional with proper session management
- **Magic Link Authentication**: Implemented with correct callback routing to `/api/auth/callback`
- **OAuth Integration**: Google authentication configured with proper redirect handling
- **Session Management**: User sessions persist correctly across page refreshes

The initial loading spinner behavior represents normal page loading states rather than stuck processes, appearing momentarily until dashboard content loads successfully.

## Multi-Tenancy and Security Resolution

### Row Level Security Implementation

Four comprehensive RLS policies were added to the Supabase `clients` table:

- SELECT policy with `auth.uid() = user_id` condition for authenticated role
- INSERT policy with `auth.uid() = user_id` WITH CHECK condition
- UPDATE policy with `auth.uid() = user_id` for both USING and WITH CHECK conditions
- DELETE policy with `auth.uid() = user_id` USING condition

The tRPC procedures were corrected to use the user-scoped Supabase client (`ctx.supabaseUser`) for read operations instead of the admin client, ensuring RLS enforcement.

### Data Isolation Verification

Testing confirmed proper data isolation between users. User accounts can only access their own client records, with the system preventing cross-user data visibility. The initial user display mismatch during login represents a temporary state that resolves once client-side session processing completes.

## Client Management Functionality

### Current CRUD Operations Status

- **Client Creation**: Functions reliably on first form submission with immediate UI updates
- **Client Reading**: Lists display only user-owned records through RLS enforcement
- **Client Editing**: Works correctly using the refactored `save` procedure
- **Client Deletion**: Requires implementation of dedicated delete procedure and UI connection

### Form Validation and Data Requirements

Email validation was corrected to reflect business requirements, changing from optional to required field. The Zod validation schema and form UI labels were updated to enforce email as mandatory, aligning with database constraints.

## Advanced Client Features Planning

### Individual Client Detail Pages

The roadmap includes implementing dedicated client detail pages accessible through dynamic routing (`/clients/[clientId]`). These pages will display comprehensive client information and provide editing capabilities for all available fields.

### Extended Data Model Requirements

The client data model expansion includes:

**Personal Information Fields**: Phone number, address components (street, city, state, postal code, country), date of birth, company name, job title

**Digital Assets**: Profile image storage through Supabase Storage with private bucket configuration, social profile links stored as JSONB

**AI Enhancement Preparation**: Enrichment data field (JSONB) for storing external API responses, tags array for categorization, comprehensive notes field

**System Fields**: UUID primary key standardization, proper created_at and updated_at timestamp management

### Profile Image Integration Strategy

Profile picture functionality will utilize Supabase Storage with private bucket configuration. Users can upload images directly from their devices, including mobile camera integration. The system will generate signed URLs for secure image display while maintaining user data isolation through storage RLS policies.

## Technical Implementation Context

### Database Migration Requirements

The client table expansion requires a structured Supabase migration adding new columns while maintaining backward compatibility. The migration will standardize on UUID primary keys if not already implemented and add proper indexing for performance.

### tRPC Procedure Expansion

The client router requires additional procedures:

- `getById` procedure for individual client data retrieval with RLS enforcement
- `delete` procedure with confirmation dialog integration
- Updated `save` procedure schema to handle expanded field set

### Storage Security Implementation

Profile image storage requires careful security configuration with RLS policies ensuring users can only access images associated with their own client records. The implementation includes secure upload mechanisms and signed URL generation for authorized display.

## Build System and Type Safety Improvements

### Package Compilation Resolution

The packages/db build configuration was established with proper TypeScript compilation to dist folder, resolving module resolution errors. The package exports compiled JavaScript and type declaration files correctly for consumption by other workspace packages.

### Dependency Management Stability

React 19 and TanStack Query v4 compatibility was confirmed despite peer dependency warnings. The decision to maintain current versions prioritizes stability over version alignment, acknowledging warnings without runtime impact.

## Development Methodology Insights

### AI-Assisted Development Approach

The implementation demonstrates effective use of AI assistance for systematic debugging and feature implementation. The approach of providing comprehensive context through status documents enables consistent architectural adherence across development sessions.

### Systematic Problem Resolution

The development process follows a methodical approach: identifying root causes, implementing targeted fixes, and verifying solutions through testing. This methodology proved effective for resolving complex issues like RLS implementation and form handling.

## Sprint 1 Completion Assessment

### Achieved Milestones

- Monorepo architecture with proper package isolation and path aliases
- Authentication flows including multiple sign-in methods
- Client CRUD operations with proper security enforcement
- Build system stability with successful deployment pipeline
- Type safety implementation across the entire stack

### Remaining Implementation Tasks

- Client delete functionality with confirmation dialogs
- Individual client detail pages with expanded data fields
- Profile image upload and display capabilities
- Testing framework implementation (Vitest and Playwright)
- Performance optimization for initial load states

## Future Enhancement Roadmap

### AI Integration Preparation

The expanded client data model positions the application for AI-powered features including contact enrichment, automated data population, and intelligent suggestions. The JSONB fields provide flexible storage for AI-generated content and external API responses.

### Mobile Integration Considerations

The profile image capture functionality acknowledges mobile usage patterns, preparing for camera integration and mobile-optimized data entry workflows. This positions the application for hybrid web/mobile deployment strategies.

## Implementation Context Summary

Peter's CodexCRM project has successfully navigated the complex challenges of monorepo setup, authentication implementation, and multi-tenant security. The application demonstrates solid architectural foundations with proper separation of concerns, comprehensive security through RLS policies, and a clear path toward advanced features.

The systematic approach to problem resolution and the emphasis on security-first implementation provide a robust foundation for the planned AI enhancements and expanded client management capabilities. The project stands ready for Sprint 2 features while maintaining the stability and security established in Sprint 1.

# CodexCRM Development Context - Comprehensive Planning Documentation

## Project Vision & Strategic Direction

Peter Blizzard is developing CodexCRM (originally named Omnipotency AI CRM), an AI-first contact relationship management system specifically designed for solo wellness practitioners including yoga teachers, massage therapists, and similar service providers. The application targets professionals managing 20-200 clients weekly, offering both manual UI operations and AI-driven automation as primary interaction methods.

## Core Business Requirements

The application serves wellness practitioners who need simplified contact management with intelligent automation. Key differentiators include AI-first design philosophy where every major action has an AI option, dual interaction models supporting both manual UI and AI-driven commands, and emphasis on relationship nurturing rather than traditional sales pipeline management.

The target user operates as a solopreneur requiring intuitive, non-overwhelming interfaces with robust functionality for contact organization, communication management, and automated workflow assistance. The system prioritizes centralization of client data and interactions within a single platform.

## Technology Stack Foundation

**Primary Framework**: Next.js with App Router providing the React-based frontend
**Language**: TypeScript for type safety across the entire stack
**Backend Infrastructure**: Supabase providing PostgreSQL database, authentication, storage, and edge functions
**Deployment Platform**: Vercel for hosting and serverless execution
**API Architecture**: tRPC v10 for type-safe client-server communication
**Database Access**: Row Level Security (RLS) enforced through Supabase
**Validation Layer**: Zod schemas for input validation and type checking
**Monorepo Management**: pnpm workspaces organizing multiple packages
**UI Framework**: Shadcn/UI components with Tailwind CSS styling
**Authentication**: Supabase Auth supporting Google OAuth, email/password, and magic links
**AI Integration**: OpenRouter as LLM gateway for enrichment and automation features
**State Management**: TanStack Query v4 for server state, React Context or Zustand for client state

## Application Architecture

### Monorepo Structure

The project follows a modular monorepo pattern with distinct packages:

- `apps/web`: Next.js frontend application
- `packages/server`: tRPC backend procedures and business logic
- `packages/db`: Supabase client configuration and database types
- `packages/ui`: Shared React components using Shadcn/UI
- `packages/jobs`: Edge functions for background processing

### Data Model Design

The core data structure centers around user-scoped contact management with flexible organization:

**Contacts Table**: Stores comprehensive client information including personal details, contact information, social profiles (JSONB), enrichment data (JSONB), notes, tags array for grouping, and compliance checkboxes for waivers and consent.

**Groups/Categories**: Initially implemented as text array tags on contacts for MVP simplicity, with evolution path toward dedicated groups table and junction table for complex group management.

**Enrichment Data**: Dedicated JSONB fields store AI-enhanced contact information from external sources including social media profiles, professional information, and additional context data.

**Communications Logging**: Tracks email interactions, scheduling, and automated sequences with linkage to specific contacts and user accounts.

### AI Integration Strategy

AI functionality operates as a core system component rather than an add-on feature. The architecture supports:

**Contact Enrichment**: Automatic background processing upon contact creation or manual trigger, utilizing external APIs and LLM analysis to populate missing information, social profiles, and professional context.

**Command Processing**: Natural language input processing through `ai.processCommand` tRPC procedure, interpreting user intents and executing appropriate actions through existing system procedures.

**Communication Assistance**: AI-driven email drafting, response suggestions, and automated drip campaign content generation with user review and approval workflow.

**Workflow Automation**: Template-based AI workflows for common scenarios like new client onboarding, re-engagement campaigns, and follow-up sequences.

## Feature Requirements & Scope

### Core Contact Management

Manual contact creation and editing through comprehensive forms with AI-assisted alternatives for streamlined data entry. The system supports CSV import with field mapping, Google Contacts synchronization, and drag-and-drop file upload for business cards or intake forms.

Contact profiles display rich information including personal details, interaction history, notes, reminders, and enriched data from external sources. The interface provides quick actions for communication, scheduling, and task creation directly from contact views.

### Organization & Grouping

Flexible contact organization using tag-based grouping system for MVP, supporting categories like client types, service offerings, or custom business segments. Users can create favorite groups for quick access and filter contact views by multiple criteria.

The hierarchical structure allows drilling down from workspace level to category lists to individual contact records, supporting both broad overview and detailed client management workflows.

### Communication Framework

Integrated email capabilities supporting both one-to-one communications and bulk messaging to selected groups. The system accommodates user's existing email infrastructure through SMTP credentials or OAuth integration with Gmail/Outlook for sending emails as the practitioner.

Automated drip sequences trigger based on contact group membership or specific events, with AI assistance for content generation and timing optimization. All communications are logged and linked to contact records for comprehensive interaction tracking.

### Scheduling & Reminders

Basic appointment and session logging with support for both individual and group sessions. The system tracks session history, enables future scheduling, and maintains links between sessions and contact records.

Internal reminder system helps practitioners maintain consistent client relationships through configurable notifications and tasks. External client reminders automate appointment confirmations and follow-up communications.

### AI-Driven Automation

Background enrichment processes automatically enhance contact profiles using available information from social platforms and professional databases. AI suggests contact categorization, drafts follow-up communications, and identifies engagement opportunities.

Workflow templates provide pre-configured automation sequences for common scenarios, with customization options for specific business needs and communication styles.

## User Experience Design Principles

The interface emphasizes calm, focused design with ample whitespace and soft color palettes suitable for wellness practitioners. Navigation follows standard patterns with collapsible sidebar containing search, dashboard, contacts, groups, reminders, and settings sections.

AI features integrate seamlessly with manual operations, providing suggestions and automation while maintaining user control and review capabilities. The dual interaction model allows practitioners to choose between traditional form-based input and natural language AI commands based on their preferences and workflow requirements.

## Security & Privacy Framework

Row Level Security enforcement ensures complete data isolation between user accounts, with all database operations scoped to authenticated user context. Supabase Auth manages authentication flows including social OAuth and passwordless options.

API layer protection through tRPC's protected procedures prevents unauthorized access to user data and operations. External API credentials are securely stored and accessed only through server-side operations.

## Deployment & Infrastructure

Vercel provides hosting and serverless execution environment with automatic deployment triggered by GitHub repository updates. Environment variables manage configuration for Supabase connectivity, external API keys, and feature flags.

Supabase handles database management, file storage, and real-time capabilities with built-in backup and scaling features. Edge functions support background processing and webhook handling for AI enrichment and automation workflows.

## Development & Testing Strategy

The development approach emphasizes incremental feature delivery with Sprint 1 focusing on core contact management, authentication, and basic AI functionality. Subsequent sprints expand communication features, advanced AI capabilities, and integration options.

Testing framework includes unit tests for components and utilities, integration tests for tRPC procedures with RLS verification, and end-to-end testing for critical user workflows including authentication and contact management flows.

## Integration Roadmap

Initial integrations target Google Contacts for data import and email providers for communication capabilities. Future phases include calendar synchronization, social media APIs for enhanced enrichment, and payment processing integration through Stripe.

The modular architecture supports optional service connections, allowing users to leverage existing tools while benefiting from centralized contact management and AI enhancement capabilities.

## Scalability & Future Considerations

The foundation supports evolution from single-workspace contact management toward multi-workspace capabilities for practitioners managing distinct business lines. AI capabilities can expand from basic enrichment to sophisticated relationship health scoring and predictive engagement recommendations.

Mobile application development leverages the existing tRPC API, while Chrome extension development enables contact capture from external websites and social platforms. Advanced notification systems and real-time collaboration features align with growth toward team-based functionality.

## Business Model Alignment

The "free forever" core contact management approach with premium AI features and advanced automation capabilities creates sustainable monetization while serving the target market's budget constraints. User-provided API keys for external services transfer usage costs directly to practitioners while providing enterprise-grade capabilities.

This architecture and feature set positions CodexCRM as a specialized solution for wellness practitioners who need powerful contact management with AI enhancement but prefer simple, relationship-focused interfaces over complex sales pipeline management typical of traditional CRM systems.

# Technical Requirements Alignment Analysis - CodexCRM vs Generated Specifications

## Context Overview

Peter reviewed a newly generated technical specification document titled "Omnipotency AI CRM – Concise Functional Requirements" that was created based on research of comparable CRM platforms. This document emerged from analysis of existing solutions including Zoho CRM, Folk CRM, Close CRM, Less Annoying CRM, ActiveCampaign, SocialBee, and Ariise.io to establish functional requirements for an AI-first wellness practitioner CRM.

## Key Technical Stack Discrepancies Identified

### Architecture Framework Differences

**Generated Document Specifications:**

- GraphQL v3 over REST microservices with OpenAPI 3.1 documentation
- PostgreSQL 16 + PostGIS with Redis 7 for queues and caching
- JWT access tokens with opaque refresh tokens
- Rate limiting at 60 requests per minute per workspace
- OpenAI moderation with low threshold for all outbound AI content

**Established CodexCRM Stack:**

- tRPC for type-safe client-server communication within Next.js
- Supabase providing PostgreSQL, authentication, storage, and edge functions
- Supabase Auth managing authentication flows including OAuth
- No explicit rate limiting requirements defined for MVP
- OpenRouter as LLM gateway rather than direct OpenAI integration

### Data Model Architecture Variations

**Generated Document Approach:**

- Explicit Workspace entities with formal isolation
- Dedicated Group tables with unlimited nesting capabilities
- Event entities for appointments with many-to-many contact relationships
- Message entities with threaded unified inbox functionality
- Task entities for reminder management

**CodexCRM Current Design:**

- User-scoped data isolation through RLS without formal workspace tables
- Tag-based contact grouping using text arrays for MVP simplicity
- Session logging linked to individual contacts
- Communication tracking through dedicated tables
- Note and reminder systems tied to contact records

### AI Integration Strategy Differences

**Generated Document Vision:**

- GPT-4o as primary AI engine for natural language actions
- Clearbit/Apollo integration for contact enrichment
- Advanced workflow automation with visual canvas builders
- Predictive analytics for churn risk and client value assessment
- Pre-built AI workflow recipes for common scenarios

**CodexCRM Approach:**

- OpenRouter providing access to multiple LLM options
- MCP-based contact enrichment through social platforms
- Simple trigger-based automation with AI assistance
- Basic analytics dashboard with AI-generated insights
- User-controlled AI actions with explicit confirmation requirements

## Feature Scope Alignment Assessment

### Contact Management Convergence

Both specifications align on core contact management requirements including rich profile storage, custom field support, CSV import capabilities, and Google Contacts synchronization. The hierarchical organization concept appears in both, though implementation details differ significantly.

### Communication Feature Overlap

Multi-channel communication support appears in both specifications, including email integration, bulk messaging capabilities, and automated sequence functionality. The generated document emphasizes unified inbox functionality while CodexCRM focuses on external service integration flexibility.

### Scheduling and Event Management

Both recognize appointment scheduling as essential functionality, though the generated document treats events as first-class entities with complex attendee management, while CodexCRM approaches scheduling through simpler session logging with contact linkage.

### Integration Philosophy Differences

The generated document assumes comprehensive built-in functionality with optional external integrations, while CodexCRM emphasizes modular design allowing users to leverage existing tools through strategic integration points.

## Platform Complexity Analysis

### Generated Document Complexity Level

The specification reflects enterprise-grade CRM functionality condensed for small business use, including sophisticated automation builders, comprehensive analytics dashboards, and advanced AI workflow management. This represents significant development complexity with extensive feature surface area.

### CodexCRM Focused Approach

The established architecture prioritizes core relationship management with AI enhancement, emphasizing simplicity and ease of use over comprehensive feature breadth. This approach reduces development complexity while maintaining extensibility through integration capabilities.

## Target User Alignment

### Generated Document User Profile

Targets wellness practitioners requiring comprehensive business management functionality including marketing automation, advanced scheduling, detailed analytics, and sophisticated workflow management. Assumes users comfortable with complex feature sets.

### CodexCRM User Profile

Focuses specifically on solo practitioners needing streamlined contact management with intelligent assistance, emphasizing simplicity over feature breadth. Designed for users preferring focused tools over all-in-one platforms.

## Technical Architecture Implications

### Implementation Complexity Considerations

The generated document specification would require significantly more development resources, longer time to market, and ongoing maintenance complexity. The microservices architecture, comprehensive feature set, and advanced AI integration represent substantial technical challenges.

### CodexCRM Pragmatic Benefits

The established Next.js/Supabase/tRPC architecture provides faster development velocity, simpler deployment and maintenance, and clear upgrade paths for feature expansion. The focused scope enables quicker MVP delivery with proven technology choices.

## Strategic Decision Framework

### Platform Evolution Path

CodexCRM's current architecture supports organic growth from core contact management toward advanced features as user needs evolve and development resources expand. The modular design enables selective feature addition without architectural overhaul.

### Market Entry Strategy

The simplified approach allows faster market validation with core wellness practitioner needs before expanding into comprehensive business management functionality. This reduces initial development risk while establishing market presence.

## Recommendation Synthesis

The analysis reveals that while the generated specification provides valuable insight into comprehensive CRM functionality expectations, the established CodexCRM architecture and feature scope better align with rapid MVP development, target user needs, and available development resources.

The generated document serves effectively as a long-term vision and feature roadmap rather than immediate implementation requirements. Key elements like advanced workflow automation, comprehensive analytics, and sophisticated AI features represent logical evolution targets after establishing core platform functionality.

The CodexCRM approach maintains focus on essential wellness practitioner needs while preserving extensibility for future enhancement, providing a more pragmatic path to market entry and user validation.

# IFLAIR

## AI Assistant/Agent Architecture Plan (to add to your briefing document)

You need to articulate the "AI-first" vision in a way that a developer can understand the intended architecture, even if the full implementation is phased.

### AI-First Architecture & Interaction Model (Omnipotency AI CRM)

Core Principle: Omnipotency AI CRM is designed as an AI-first platform. While a manual graphical user interface (GUI) will exist for direct data manipulation and overview, the primary and most powerful interaction model will be through an AI assistant. This assistant acts as the "brain" or "engine" of the CRM, translating natural language commands from the user into specific actions within the system.

User Interaction Flow (MVP Target: Text-Based Chat):

### Input Channel

The user interacts with the AI assistant via a text-based chat interface within the `apps/web` application. (Future: Voice input via STT, WhatsApp integration).

### Command Processing

The user's natural language input (e.g., "Add a new client John Doe, john@example.com, interested in yoga", "Show me clients I haven't contacted in 30 days", "Draft a follow-up email to Jane for her session last Tuesday") is sent to a central AI processing layer.

## AI Orchestration Layer

(Likely within `packages/server` or a dedicated `packages/ai-orchestrator`): This layer receives the user's command. It uses a primary LLM (via **OpenRouter** for flexibility) to perform Natural Language Understanding (NLU) to determine:

### Intent:

What does the user want to achieve? (e.g., create_contact, list_contacts, draft_email, schedule_session).

### Entities:

What are the key pieces of information? (e.g., name: "John Doe", email: "john@example.com", interest: "yoga", date_range: "last 30 days").

### Tool/Function Calling:

Based on the intent, the LLM selects the appropriate "tool" to execute. These "tools" are our **tRPC procedures** defined in `packages/server`. The LLM will be prompted with definitions of available tRPC procedures it can call. The LLM generates a structured request (e.g., JSON) specifying the tRPC procedure to call and the parameters derived from the user's input.

### tRPC Execution

The AI Orchestration Layer makes a call to the identified tRPC procedure (e.g., `api.clients.save.mutate(...)`, `api.clients.list.query(...)`, `api.communication.draftEmail.mutate(...)`).

The tRPC procedures contain the business logic to interact with the **Supabase PostgreSQL database** (CRUD operations, data retrieval), respecting RLS via user-scoped Supabase clients (`ctx.supabaseUser`).

### Response & Feedback

The tRPC procedure returns a result (data or success/error status) to the AI Orchestration Layer. The AI Orchestration Layer formats this result (or generates a natural language summary using the LLM if needed) and sends it back to the user via the chat interface. (Future: Notifications of AI actions can also be sent to user's email/WhatsApp).

## Data Flow for AI Features

### Contact Enrichment (Non-Negotiable from Start)

Triggered automatically on new contact creation (e.g., via Supabase Database trigger -> Supabase Edge Function in `packages/jobs`).
The Edge Function (or a tRPC procedure called by it) interacts with an enrichment service/LLM (via OpenRouter, using user-provided API keys where necessary for external paid services) to fetch additional public information (social profiles, company data, etc.).
Enriched data is stored in dedicated `jsonb` fields (e.g., `enrichment_data`, `social_profiles`) in the `clients` table.

### AI-Generated Content (Notes, Emails, Tags)

User requests content generation via the AI Assistant.
AI Orchestration Layer calls LLM (via OpenRouter) with appropriate context (client data, previous interactions).
LLM generates draft content.
User reviews/edits (critical for maintaining practitioner's voice).
Approved content is saved to the database via tRPC procedures (e.g., new note in `notes` table, draft email in a `communications` table, tags updated on `clients` table).

### AI-Suggested Workflows/Tasks

Background processes (Edge Functions or scheduled jobs) or event-driven logic within tRPC procedures can analyze data (e.g., last contact date, session completion).
If a condition is met, the AI can suggest a task (e.g., "Follow up with Client X") or draft a communication, which is then presented to the user for approval/action.

## Key Architectural Principles for AI Integration

### Decoupled AI Logic:

The core CRM functionality (tRPC procedures, database schema) should be robust and testable independently of the AI layer. The AI layer _uses_ these core functions as tools.

### Stateless AI Interactions (Primarily):

Each user command to the AI should ideally be processed as a discrete transaction. Context/memory will be managed by passing relevant history/data in prompts or by having the AI retrieve necessary data via tRPC queries.

### Supabase as the Single Source of Truth:

All client data, notes, sessions, AI-generated content, and configuration are stored in Supabase.

### Modularity:

Design tRPC procedures to be granular and represent single, well-defined actions. This makes them easier for the LLM to understand and use as "tools".

### User in Control:

Especially for actions with external impact (sending emails, updating critical data), the user should have the opportunity to review and approve AI-generated actions/content, at least in the MVP.

## Future Vision - Agent Swarm - Post MVP:

The long-term vision involves evolving the AI assistant into a more sophisticated system, potentially resembling a lead agent coordinating specialized sub-agents (e.g., "Communications Agent", "Data Management Agent", "Content Creation Agent"). Each sub-agent would still leverage the core tRPC procedures but could have more specialized prompting or even use different fine-tuned LLMs for their specific tasks. This architecture allows for scaling complexity and specialization over time. The initial focus, however, is on a single, versatile AI assistant orchestrating well-defined tRPC tools.

## Sprint Planner Template (for defining work chunks)

This template is designed to be simple and can be used in a text file, a shared document (Google Docs/Notion), or a project management tool.

### Sprint Plan: [Sprint Name/Number] - CodexCRM

**Sprint Dates:** [Start Date] - [End Date] (e.g., 2 Weeks)
**Sprint Goal:** [Define 1-3 main objectives for this sprint. What key outcomes are we aiming for?]

---

### Key Focus Areas / Epics for this Sprint:

_(High-level themes or large features being worked on)_

1.  [Focus Area 1 - e.g., Complete Client Delete Functionality]
2.  [Focus Area 2 - e.g., Implement User Sign-Up Flow]
3.  [Focus Area 3 - e.g., Initial AI Contact Enrichment Setup]

---

### Tasks & User Stories:

| Task ID / User Story ID | Description                                                                                   | Owner      | Est. Effort (e.g., S/M/L or hours) | Status      | Depends On | Notes / Acceptance Criteria (Brief)                                                                                                   |
| :---------------------- | :-------------------------------------------------------------------------------------------- | :--------- | :--------------------------------- | :---------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **[Focus Area 1]**      |                                                                                               |            |                                    |             |            |                                                                                                                                       |
| TASK-XXX                | [Specific development task - e.g., Create tRPC `client.delete` procedure]                     | [Dev Name] | M                                  | To Do       | TASK-YYY   | - Procedure accepts `clientId`. <br/> - Uses `ctx.supabaseUser`. <br/> - Matches `id` and `user_id`. <br/> - Returns success/failure. |
| ST-CLIENT-YYY           | [User Story - e.g., As a practitioner, I want to delete a client record with confirmation...] | [Dev Name] | L                                  | To Do       | TASK-XXX   | - Delete button in UI. <br/> - Confirmation modal appears. <br/> - Client removed from list on success.                               |
| ...                     | ...                                                                                           |            |                                    |             |            |                                                                                                                                       |
| **[Focus Area 2]**      |                                                                                               |            |                                    |             |            |                                                                                                                                       |
| TASK-ZZZ                | [e.g., Create Sign-Up UI Form in `apps/web`]                                                  | [Dev Name] | S                                  | In Progress |            | - Form for email/password. <br/> - Client-side validation. <br/> - Calls `signUp` action.                                             |
| ...                     | ...                                                                                           |            |                                    |             |            |                                                                                                                                       |

---

### Key Milestones / Deliverables for this Sprint:

- [Deliverable 1 - e.g., Client Delete function fully implemented and tested]
- [Deliverable 2 - e.g., Users can successfully sign up with email confirmation]
- ...

### Potential Blockers / Risks:

- [Blocker 1 - e.g., Supabase Auth rate limits if extensive testing needed]
- [Risk 1 - e.g., Complexity of Google OAuth setup might take longer than expected]

### Notes for Next Sprint Planning:

- [Any learnings or items to carry over/consider for the *next* sprint]

### How to use this Sprint Planner Template:

#### Before Sprint:

You and the developer collaboratively fill this out.

- Define the Sprint Goal.
- Break down larger features (from your overall roadmap or the Taskmaster AI generated tasks) into smaller, manageable tasks and user stories for the sprint duration.
- Estimate effort (can be simple T-shirt sizes: S, M, L, XL, or rough hours/days).
- Identify dependencies between tasks.
- Assign owners.

#### During Sprint:

Update the "Status" column (e.g., To Do, In Progress, In Review, Done).

#### End of Sprint:

Review what was completed, discuss blockers, and use the "Notes for Next Sprint Planning" section.
