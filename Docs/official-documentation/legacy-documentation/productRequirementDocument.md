# Omnipotency AI CRM Product Requirements Document

**Version:** 0.8 (Sprint 1 – Stabilization Focus)  
**Date:** 2025-05-13  
**Author:** Peter Blizzard (Concept), AI Assistant (Documentation)  
**Status:** Draft

---

## 1. Introduction

### 1.1 Purpose of this document

This Product Requirements Document (PRD) outlines the vision, goals, features, and requirements for **CodexCRM**, an AI-first Customer Relationship Management platform tailored to solo wellness practitioners (e.g. yoga teachers, massage therapists, alternative therapists). It serves as the single source of truth for design, development, and testing, ensuring the product meets user needs and achieves its strategic objectives. Version 0.8 focuses on stabilizing the Sprint 1 scope and laying a solid foundation for future AI-driven capabilities.

### 1.2 Project overview

CodexCRM is built around an AI assistant that automates tasks, manages data, guides client communication, and surfaces business insights. The MVP delivers core CRM functionality—client management, authentication, and session-tracking concepts—via a clean web interface. Over time, voice/chat interactions, data enrichment, personalized communications, and advanced analytics will be layered on, all powered by the AI core.

---

## 2. Product Overview

### 2.1 Vision

> Empower solo wellness practitioners with an intelligent, intuitive, and automated CRM that acts as a **true assistant**, freeing them to focus on client well-being and practice growth.

### 2.2 Product description

CodexCRM is a web application that lets practitioners manage clients, track interactions, schedule sessions, and streamline admin tasks. Its key differentiator is its **AI-first** approach: natural-language commands will drive the UI, automate workflows, and generate insights. Data is stored securely in a **Supabase PostgreSQL** database and exposed via a **tRPC** API to a **Next.js** front end.

### 2.3 Key differentiators

- **AI-First Design** – AI is the core engine, not a bolt-on.
- **Niche Focus** – Purpose-built for solo wellness practitioners.
- **Centralized Data Hub** – Consolidates client data and operations, reducing tool sprawl.
- **Future-Proof Architecture** – Modern stack (Next.js, Supabase, tRPC, pnpm monorepo) enables scalability.

---

## 3. Goals and Objectives

### 3.1 Business goals

1. Launch an MVP that attracts early adopters within the solo-wellness community.
2. Position CodexCRM as the leading AI-first CRM in its niche.
3. Achieve high user satisfaction and retention.
4. Build a scalable platform ready for advanced AI features.

### 3.2 Product goals – _Sprint 1 focus_

- **Stabilize Core Functionality** – Robust authentication and client CRUD.
- **Data Integrity & Security** – Implement and verify Row-Level Security (RLS).
- **Foundational UX** – Clean interface for managing clients before the AI layer.
- **Build & Deploy** – Reliable build and Vercel deployment.

### 3.3 Success metrics (post-MVP launch)

- Active-user count.
- Client-creation and interaction rates.
- User feedback (NPS, feature-satisfaction).
- Task-completion time with/without AI assistance.
- Adoption rate of AI features as they launch.

---

## 4. Target Audience

### 4.1 Primary users

- Solo yoga instructors
- Massage therapists
- Alternative therapists (acupuncture, reiki, herbalism, etc.)
- Independent personal trainers and fitness coaches

### 4.2 User characteristics

- Run the business largely alone; minimal administrative help.
- Varying tech comfort; value simplicity.
- Client-relationship-centric; prioritize personalized service.
- Need appointment, history, and notes tracking—often payments/waivers too.
- Price-sensitive.
- Time-constrained and receptive to automation.

### 4.3 Needs & pain points addressed

| Need                                   | Pain Point                                     |
| -------------------------------------- | ---------------------------------------------- |
| Efficient client information & history | Reliance on spreadsheets/paper or generic CRMs |
| Secure note storage                    | Data-privacy worries and disorganization       |
| Lower administrative overhead          | Excessive time spent on manual tasks           |
| Personalized client communication      | Hard to track individual preferences           |
| Simple scheduling                      | Managing bookings across multiple tools        |
| Digital consent & waivers              | Paper-based processes are clumsy               |

---

## 5. Features and Requirements – _Sprint 1 Stabilization_

### 5.1 User Authentication & Account Management

| ID           | Requirement                                                   |
| ------------ | ------------------------------------------------------------- |
| REQ-AUTH-001 | Email/password sign-up with email confirmation                |
| REQ-AUTH-002 | Email/password sign-in                                        |
| REQ-AUTH-003 | Passwordless **Magic Link** sign-in                           |
| REQ-AUTH-004 | Google OAuth sign-in                                          |
| REQ-AUTH-005 | Secure sign-out                                               |
| REQ-AUTH-006 | Password-reset flow                                           |
| REQ-AUTH-007 | Basic account-management page                                 |
| REQ-AUTH-008 | Middleware/SSR route protection                               |
| REQ-AUTH-009 | Redirect unauthenticated users from protected routes          |
| REQ-AUTH-010 | Redirect authenticated users from public-only routes          |
| REQ-AUTH-011 | Secure session management via Supabase Auth & `@supabase/ssr` |

### 5.2 Client Management (CRUD)

| ID                   | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| REQ-CLIENT-001 → 005 | Create, list, view, edit, and delete client records                                                                                                                                                                                                                                                                                                                                                                                  |
| REQ-CLIENT-006       | **Client data model** (minimum):<br>`sql<br>id                UUID  PRIMARY KEY,<br>user_id           UUID  REFERENCES auth.users(id),<br>first_name        text  NOT NULL,<br>last_name         text  NOT NULL,<br>email             text  UNIQUE,<br>phone             text,<br>profile_image_url text,<br>tags             text[],<br>notes             text,<br>created_at        timestamp,<br>updated_at        timestamp<br>` |
| REQ-CLIENT-007       | UI forms aligned with the data model                                                                                                                                                                                                                                                                                                                                                                                                 |
| REQ-CLIENT-008       | Zod validation (client and server side)                                                                                                                                                                                                                                                                                                                                                                                              |

### 5.3 Data Security & Integrity

- **REQ-SEC-001** – Enable RLS on all user-specific tables.
- **REQ-SEC-002** – Policies restrict access to `user_id = auth.uid()`.
- **REQ-SEC-003** – tRPC procedures must respect user scope.

### 5.4 UI & UX (_basic for Sprint 1_)

- Clean, responsive dashboard.
- Client list (table or cards) with sort/search placeholders.
- Clear loading/error states.
- Consistent Shadcn UI and Tailwind styling.

### 5.5 Technical Foundation

- `pnpm` monorepo (`apps/web`, `packages/*`).
- TypeScript path aliases.
- tRPC v10 API + TanStack Query v4.
- Successful local build.
- Successful Vercel deployment.

---

## 6. User Stories & Acceptance Criteria (_Sprint 1 focus_)

<details>
<summary>Authentication & Account Management</summary>

#### ST-AUTH-101 · Sign-up (email/password)

As a new practitioner, I want to sign up with email/password so I can start using the CRM.

- **AC1** – Sign-up form is available.
- **AC2** – User enters email and password.
- **AC3** – Confirmation email is sent.
- **AC4** – UI prompts user to check email.
- **AC5** – Clicking the link activates account and allows login.

#### ST-AUTH-102 · Sign-in (email/password)

- **AC1** – Sign-in form is available.
- **AC2** – User enters credentials.
- **AC3** – Successful authentication redirects to dashboard.
- **AC4** – Failure shows error message.

#### ST-AUTH-103 · Magic Link sign-in

- **AC1** – Request link via email.
- **AC2** – Email sent.
- **AC3** – Clicking link logs user in and redirects to dashboard.

#### ST-AUTH-104 · Google OAuth sign-in

- OAuth flow completes; user lands on dashboard.

#### ST-AUTH-105 · Sign-out

- Sign-out button ends session and redirects.

#### ST-AUTH-106 · Forgot password

- Reset-link flow lets user set a new password.

#### ST-AUTH-107 · Secure access

- Protected routes redirect unauthenticated users.
- HttpOnly cookies via `@supabase/ssr`.
- API endpoints require a valid session.

</details>

<details>
<summary>Client Management</summary>

#### ST-CLIENT-101 · Add new client

- **AC1** – Access _Add New Client_ form.
- **AC2** – Enter first name, last name, and email.
- **AC3** – Form validation.
- **AC4** – Record saved and linked to user.
- **AC5** – Client list updates.

#### ST-CLIENT-102 · View client list

- List displays only the authenticated user’s clients.

#### ST-CLIENT-103 · Edit client

- Pre-filled form allows saving changes.

#### ST-CLIENT-104 · Delete client

- Confirmation dialog, then removal.

#### ST-DBMODEL-101 · Database model & RLS

- `clients` table as above.
- RLS policies enforce `user_id = auth.uid()` for `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

</details>

---

## 7. Technical Requirements / Stack

- **Frontend:** Next.js (App Router 14+), React 18/19, TypeScript
- **API:** tRPC v10
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions – planned)
- **Data/State:** TanStack Query v4, `@trpc/react-query`
- **Styling:** Tailwind CSS, Shadcn UI
- **Validation:** Zod
- **Package Manager:** pnpm (monorepo)
- **Version Control:** Git / GitHub
- **Deployment:** Vercel
- **Local DB Management:** Supabase CLI

---

## 8. Design & User Interface

### 8.1 General principles

- Clean, modern, intuitive.
- Mobile-first responsive.
- Consistent Shadcn components and Tailwind classes.
- Clear hierarchy/navigation.
- Accessibility (WCAG).

### 8.2 Key screens – _Sprint 1_

- **Sign-in/Sign-up**
  - Email/password and magic-link forms.
  - Google OAuth buttons.
  - Minimalistic, action-focused layout.
- **Dashboard / Client List**
  - Header with **Add New Client** button and search placeholder.
  - Table view (photo, name, email, tags, actions).
  - Responsive card view on mobile.
- **Client Creation/Edit Form**
  - Modal or dedicated route.
  - Shadcn form components.
  - Clear inline validation.
- **Client Detail Page (placeholder)**
  - Route `/clients/[clientId]`.
  - Displays basic data for Sprint 1; full design planned for Sprint 2.

---

_End of Document – Version 0.8_
