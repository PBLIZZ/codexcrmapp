# Legacy Tasks

Status Breakdown:

- Done: 23 tasks
- In Progress: 7 tasks
- Pending: 77 tasks

Key Task Categories:

1. Foundation & Setup: Monorepo structure, Next.js config,
   Supabase setup, tRPC integration
2. Authentication: User registration, login, Google OAuth,
   session management, UI updates
3. Contact Management: CRUD operations, groups, CSV
   import/export workflow
4. AI Features: Contact enrichment, email processing,
   calendar integration, automation
5. Data Processing: CSV parsing, validation, duplicate
   detection, database operations
6. UI/UX: Responsive design, accessibility, Shadcn UI
   integration, form improvements
7. Infrastructure: Testing frameworks, deployment
   pipelines, error handling, monitoring
8. Data Migration: Renaming clients to contacts across
   database, backend, and frontend

Notable Completed Features:

- CSV template creation and upload components
- Database migration from clients to contacts
- Backend tRPC router updates
- Frontend component refactoring
- Authentication UI improvements with Shadcn UI
- Password visibility toggles and requirements

Major Ongoing Efforts:

- CSV import workflow completion
- Authentication error handling
- Testing and bug fixing for contact entity rename
- AI automation features development

The legacy-tasks.md file now provides a comprehensive
overview of all project tasks with their current status and
testing strategies, making it easy to track progress and
identify priorities.

| Title                     | Description                                                                                                                                   | Status      | Test Strategy                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| Monorepo Structure        | Initialize project monorepo with pnpm workspaces, apps/web, packages directories, tsconfig, ESLint, Prettier, Git setup                       | Done        | No test strategy specified                                                             |
| Next.js Configuration     | Set up Next.js 14+ with TypeScript, App Router, Tailwind CSS, Shadcn UI components integration                                                | Done        | No test strategy specified                                                             |
| Supabase Database         | Create Supabase project, configure initial DB schema, Row Level Security policies, API endpoints                                              | Done        | No test strategy specified                                                             |
| Supabase Authentication   | Set up Supabase authentication with email/password, secure session management, email confirmation, user profiles                              | Pending     | No test strategy specified                                                             |
| tRPC Setup                | Implement tRPC v10 for type-safe API, Zod validation, TanStack Query v4 integration                                                           | Done        | End-to-end tests to ensure type safety, validation, and data fetching work as expected |
| UI Component Library      | Create shared UI component library based on shadcn/ui and Radix with development tooling                                                      | Pending     | No test strategy specified                                                             |
| Contact CRUD              | Create tRPC procedures and UI for CRUD operations on contacts, pagination, filtering, sorting, profile images, tags                           | Pending     | No test strategy specified                                                             |
| Contact Grouping          | Create group management: create groups, add/remove contacts, view by group, many-to-many relationship                                         | Pending     | No test strategy specified                                                             |
| AI Contact Enrichment     | Implement AI contact enrichment using OpenRouter/LLMs, enrichment service, status tracking, UI                                                | Pending     | No test strategy specified                                                             |
| Implement Dashboard       | Create main dashboard: recent activity, upcoming reminders, frequent contacts, metrics, quick add                                             | Pending     | No test strategy specified                                                             |
| Reminder System           | Create reminder system: set reminders for contacts, recurrence, UI (form, list, card), date/time picker, filtering, display on contact detail | Pending     | No test strategy specified                                                             |
| Interaction Tracking      | System for tracking/recording interactions: date, type, summary, UI (form, list, card, timeline), update last_contacted_at                    | Pending     | No test strategy specified                                                             |
| User Profile Settings     | Create user profile management (view/update info) and application settings                                                                    | Pending     | No test strategy specified                                                             |
| Global Search             | Global search across contacts, groups, reminders, interactions with tRPC, DB queries/indexes, UI input/results/filters                        | Pending     | No test strategy specified                                                             |
| Responsive Design         | Ensure application is fully responsive (desktop, tablet, mobile): layouts, data displays, mobile nav, touch-friendly controls                 | Pending     | No test strategy specified                                                             |
| Error Logging System      | Comprehensive error handling/logging: error boundaries, structured tRPC errors, custom error classes, toast notifications                     | Pending     | No test strategy specified                                                             |
| Data Import Export        | Create functionality for manually importing contacts from CSV/JSON files and exporting contacts with data mapping                             | Pending     | No test strategy specified                                                             |
| Accessibility Features    | Ensure accessibility compliance with WCAG 2.1 AA: ARIA, keyboard nav, color contrast, focus indicators, screen readers                        | Pending     | No test strategy specified                                                             |
| Performance Optimizations | Optimize application for performance: code splitting, React.memo, DB query optimization, caching, virtualized lists                           | Pending     | No test strategy specified                                                             |
| Deployment Pipeline       | Set up CI/CD for automated testing, building, deployment to Vercel with GitHub Actions, environments, monitoring                              | Pending     | No test strategy specified                                                             |
| Security Measures         | Comprehensive security measures: CSP, XSS/CSRF protection, secure cookies, rate limiting, input sanitization                                  | Pending     | No test strategy specified                                                             |
| Testing Framework         | Set up comprehensive testing (unit, integration, E2E): Vitest, React Testing Library, MSW, test DB, Playwright                                | Pending     | No test strategy specified                                                             |
| Documentation System      | Create comprehensive documentation: API, code, user guides, developer docs, tRPC docs, JSDoc, architecture                                    | Pending     | No test strategy specified                                                             |
| Analytics Monitoring      | Set up analytics tracking and application health monitoring: error/performance/uptime monitoring, analytics                                   | Pending     | No test strategy specified                                                             |
| Integration UAT           | Perform comprehensive integration and UAT: E2E testing, test scenarios, issue tracking, load testing                                          | Pending     | No test strategy specified                                                             |
| Terminology Consistency   | Refactor supabase/utils.ts and related areas to ensure consistent use of 'contact(s)' terminology                                             | Pending     | No test strategy specified                                                             |
| SignOut Component         | [DEPRECATED] Original objectives superseded by Task #211 - Fix, Centralize, and Standardize Logout                                            | Pending     | No testing required - functionality moved to Task #211                                 |
| Inline Add                | Create spreadsheet-like inline row addition for contacts list with UI, focus management, validation                                           | Pending     | No test strategy specified                                                             |
| Google OAuth              | CRITICAL BLOCKER: Fix Google OAuth sign-in issue preventing application from loading                                                          | In Progress | OAuth flow testing with detailed logging and session management                        |
| Iflair Tasks              | Compile a list of tasks suitable for delegation to the Iflair software engineer company                                                       | Pending     | No test strategy specified                                                             |
| Vision Brief              | Finalize the project's Vision Brief document                                                                                                  | Pending     | No test strategy specified                                                             |
| Update PRD                | Update the Product Requirements Document based on the latest vision and plans                                                                 | Pending     | No test strategy specified                                                             |
| Format Tasks              | Print out or format all outstanding tasks in a markdown document for review or distribution                                                   | Pending     | No test strategy specified                                                             |
| Lead Ingestion            | Implement comprehensive lead ingestion from multiple sources (webhooks, email, integrations, website tracking)                                | Pending     | No test strategy specified                                                             |
| AI Automation             | Developing AI-powered automation features for contact enrichment, email processing, calendar management                                       | Pending     | No test strategy specified                                                             |
| AI Approval               | Implementing system for users to review, approve, and manage AI-generated actions with scheduling                                             | Pending     | No test strategy specified                                                             |
| Webhook Receiver          | Design and implement universal webhook endpoint for clients to send contact data from various sources                                         | Pending     | No test strategy specified                                                             |
| Email Integration         | Set up email parsing for clients to forward lead notifications with AI-assisted parsing                                                       | Pending     | No test strategy specified                                                             |
| API Connections           | Build pre-configured integrations for popular platforms (Mailchimp, Calendly, Social Media, Google Forms)                                     | Pending     | No test strategy specified                                                             |
| WordPress Plugin          | Develop WordPress plugin to capture form submissions and send them to the app via webhook/API                                                 | Pending     | No test strategy specified                                                             |
| Website Tracking          | Create tracking script/pixel for clients to embed on websites to capture form submissions/lead events                                         | Pending     | No test strategy specified                                                             |
| Data Normalization        | Build robust system to standardize contact data from all sources and prevent duplicates                                                       | Pending     | No test strategy specified                                                             |
| AI Onboarding             | Develop AI assistant and UI to guide users through smart setup, foundation setup, website integration                                         | Pending     | No test strategy specified                                                             |
| Pending Approvals         | Implement system for users to review, approve, reject, and edit AI-generated actions                                                          | Pending     | No test strategy specified                                                             |
| Background Jobs           | Set up infrastructure for running tasks in the background (BullMQ, Supabase Edge Functions)                                                   | Pending     | No test strategy specified                                                             |
| Foundation Epic           | Establishing core monorepo, Next.js application, Supabase integration, tRPC, and base UI library                                              | Done        | No test strategy specified                                                             |
| Auth Epic                 | Implementing secure user sign-up, sign-in (including Google OAuth), session management, user profiles                                         | Pending     | No test strategy specified                                                             |
| CRM Epic                  | Implementing fundamental CRM features for managing contacts and organizing them into groups                                                   | Pending     | No test strategy specified                                                             |
| Supporting CRM            | Implementing additional CRM functionalities like dashboard, reminders, interaction tracking, global search                                    | Pending     | No test strategy specified                                                             |
| UI UX Epic                | Ensuring responsive, accessible, and user-friendly experience across all devices and for all users                                            | Pending     | No test strategy specified                                                             |
| Quality Epic              | Focusing on non-functional requirements like error handling, performance, security, deployment                                                | Pending     | No test strategy specified                                                             |
| Documentation Epic        | Managing project documentation, final testing phases, and administrative project tasks                                                        | Pending     | No test strategy specified                                                             |
| Foundation Epic Dup       | Establishing core monorepo, Next.js application, Supabase integration, tRPC, and base UI library                                              | Done        | No test strategy specified                                                             |
| Auth Epic Live            | Implementing secure user sign-up, sign-in (including Google OAuth), session management, user profiles                                         | In Progress | No test strategy specified                                                             |
| Lead Ingestion Epic       | Implement comprehensive lead ingestion from multiple sources (webhooks, email, integrations)                                                  | Pending     | Unit tests for each ingestion channel, integration tests for full lead flow            |
| CRM Epic Live             | Implementing fundamental CRM features for managing contacts and organizing them into groups                                                   | In Progress | No test strategy specified                                                             |
| AI Automation Epic        | Developing AI-powered automation features for contact enrichment, email processing, calendar management                                       | Pending     | Unit tests, integration tests with AI services, user acceptance testing                |
| AI Approval Epic          | Implementing system for users to review, approve, and manage AI-generated actions with scheduling                                             | Pending     | No test strategy specified                                                             |
| Supporting CRM Epic       | Implementing additional CRM functionalities like dashboard, reminders, interaction tracking, global search                                    | Pending     | Unit tests for components, integration tests, user acceptance testing                  |
| UI UX Epic Live           | Ensuring responsive, accessible, and user-friendly experience across all devices and for all users                                            | Pending     | Accessibility audits, responsive design testing, usability testing                     |
| Quality Epic Live         | Focusing on non-functional requirements like error handling, performance, security, deployment                                                | Pending     | Test with simulated errors, load testing, penetration testing, CI/CD verification      |
| Manual Import Export      | Create functionality for manually importing contacts from CSV/JSON files and exporting contacts                                               | Pending     | No test strategy specified                                                             |
| Webhook Receiver Dup      | Design and implement universal webhook endpoint for clients to send contact data from various sources                                         | Pending     | No test strategy specified                                                             |
| Email Engine Lead         | Set up email parsing for clients to forward lead notifications with AI-assisted parsing                                                       | Pending     | No test strategy specified                                                             |
| API Connection Mgr        | Build pre-configured integrations for popular platforms (Mailchimp, Calendly, Social Media, Google Forms)                                     | Pending     | No test strategy specified                                                             |
| AI Contact Enrichment     | Implement AI contact enrichment using OpenRouter/LLMs with enrichment service, tRPC procedures, UI                                            | Pending     | No test strategy specified                                                             |
| Gmail AI Processing       | Connect to user's Gmail, scan emails for leads, draft personalized welcome emails and replies using AI                                        | Pending     | No test strategy specified                                                             |
| Calendar AI Booking       | Sync with user's Google Calendar, manage bookings, send reminders/follow-ups using AI                                                         | Pending     | No test strategy specified                                                             |
| Format Tasks Dup          | Print out or format all outstanding tasks in a markdown document for review or distribution                                                   | Pending     | No test strategy specified                                                             |
| CSV Template              | Create a downloadable CSV template file with all required headers and example data for contact import                                         | Done        | Manual verification with Excel and Google Sheets compatibility                         |
| CSV Upload Component      | Create reusable file upload component that allows users to select or drag-and-drop CSV files                                                  | Done        | Unit test with various file types, test drag-and-drop functionality                    |
| CSV Parser Service        | Develop service to parse uploaded CSV files, validate structure, and convert data into usable format                                          | In Progress | Unit test with various CSV files including edge cases and encoding types               |
| Duplicate Detection       | Create service to detect duplicate contacts based on email address and provide handling options                                               | Pending     | Unit test with datasets containing new and duplicate contacts                          |
| Import UI Workflow        | Create multi-step UI workflow for CSV import process from file selection to completion                                                        | Done        | Comprehensive UI tests for each screen, responsive design verification                 |
| Backend Import API        | Create backend API endpoint that receives CSV data, processes it, and imports valid contacts                                                  | Pending     | Unit tests for endpoint, authentication validation, performance testing                |
| Email Name Derivation     | Create utility function to derive first and last names from email addresses when missing                                                      | Pending     | Comprehensive unit tests with various email formats and edge cases                     |
| Error Reporting           | Create functionality to generate detailed error reports for failed imports and allow downloads                                                | Pending     | Test error collection with import failures, verify CSV generation                      |
| Progress Tracking         | Implement mechanism to track and display progress of CSV import operations for larger files                                                   | Pending     | Test progress tracking with various file sizes, verify polling mechanism               |
| Subscription Limits       | Add functionality to check if CSV import would exceed user's subscription plan limits                                                         | Pending     | Test with various combinations of contact counts, plan limits, and import sizes        |
| UI Entry Points           | Add CSV import entry points (buttons/links) to Settings page, Dashboard, and Contacts sidebar                                                 | Pending     | Verify all entry points correctly launch import workflow, test responsive behavior     |
| CSV Field Validation      | Create comprehensive validation for all CSV fields to ensure data integrity and provide clear error messages                                  | Pending     | Comprehensive unit tests for each field validation function, test with edge cases      |
| Database Operations       | Create optimized database operations to efficiently insert new contacts and update existing ones                                              | Pending     | Unit tests for database operations, test with large datasets for performance           |
| Import Notifications      | Implement notification system to inform users about CSV import results using Sonner toast system                                              | Pending     | Test all notification types and scenarios, verify correct styling and content          |
| E2E Import Testing        | Develop comprehensive end-to-end tests covering entire CSV import workflow from upload to database                                            | Pending     | Run E2E test suite in CI/CD pipeline, verify all test scenarios pass consistently      |
| DB Migration Script       | Develop SQL migration script to rename 'clients' table to 'contacts' preserving data and constraints                                          | Done        | Create backup, execute in dev environment, verify data preservation and RLS policies   |
| Backend tRPC Update       | Refactor all backend code to use 'contacts' instead of 'clients' in tRPC routers and service logic                                            | Done        | Run TypeScript compiler, execute unit tests, test CRUD operations                      |
| Shared Types Update       | Refactor shared type definitions and utility functions to use 'contact' instead of 'client' terminology                                       | Done        | Run TypeScript compiler, verify imports/exports, test utility functions                |
| Frontend Components       | Refactor frontend components and state management to use 'contact' instead of 'client' terminology                                            | Done        | Run TypeScript compiler, verify components render correctly, test CRUD operations      |
| UI Text Update            | Update all user-facing text and labels from 'Clients' to 'Contacts' throughout the application                                                | Done        | Manual inspection of all pages, verify no instances of 'Client' remain                 |
| Testing Bug Fixing        | Perform thorough testing to ensure all functionality related to renamed 'contacts' entity works                                               | Pending     | Execute automated tests, perform manual testing, document issues and resolutions       |
| Documentation Update      | Update all documentation and code comments to reflect new 'contacts' terminology                                                              | Pending     | Perform documentation review, verify code examples use new terminology                 |
| Navbar Logout Error       | This issue superseded by task #211 - Fix, Centralize, and Standardize Logout Functionality                                                    | Pending     | Testing handled under task #211's validation strategy                                  |
| CSV Auth Protection       | Add authentication check to CsvUploadTestPage to redirect unauthenticated users to sign-in                                                    | Pending     | Test scenarios: unauthenticated access, authenticated access, session expiration       |
| Sign In Rename            | Update all instances of 'Sign In' to 'Log In' throughout the application including components                                                 | Done        | Create checklist, manually verify instances, test navigation flows                     |
| Shadcn UI Integration     | Research and implement Shadcn UI components for authentication forms including Card, Input, Button                                            | Done        | Verify components render correctly, test styling, verify accessibility features        |
| Log In Page Update        | Redesign Log In page with new styling, layout, and UX improvements according to PRD requirements                                              | In Progress | Visual inspection against design, test form submission, verify responsive design       |
| Sign Up Page Update       | Redesign Sign Up page with new styling and UX improvements including addition of Name field                                                   | Done        | Visual inspection against design, test form submission, verify responsive design       |
| Name Field Storage        | Update sign-up process to collect and store user's name in Supabase auth.users.raw_user_meta_data                                             | Done        | Test sign-up with valid data, verify name storage in Supabase, test form validation    |
| Profile Creation Trigger  | Ensure new record is automatically created in profiles table when user signs up                                                               | Pending     | Create test user, verify profile record creation, test with OAuth sign-up              |
| Password Visibility       | Add functionality to show/hide password in both Log In and Sign Up forms                                                                      | Done        | Test toggling password visibility, verify keyboard accessibility, test screen reader   |
| Password Requirements     | Add visual feedback for password requirements during sign-up to guide users                                                                   | Done        | Test with various password inputs, verify visual feedback clarity, test accessibility  |
| Responsive Auth Pages     | Ensure both Log In and Sign Up pages are fully responsive across different device sizes                                                       | Done        | Test on various device sizes, use browser dev tools, verify touch targets              |
| Auth Error Handling       | Add comprehensive error handling and form validation for Log In and Sign Up forms                                                             | In Progress | Test form submission with valid/invalid inputs, verify error message clarity           |
