## **Product Requirements Document (PRD): CodexCRM - V1 AI-Assisted Tasks & Scheduling Module**

**Version:** 1.1 (Revised)
**Date:** June 17, 2025
**Status:** Scoping Finalized

### 1. Overview & Vision

#### 1.1. **Product Goal**
To build a human-supervised, AI-driven task and scheduling system as a core module within CodexCRM. This module will empower wellness practitioners by automating administrative work, proactively suggesting actions, and providing intelligent assistance that is deeply aware of their client relationships and calendar availability.

#### 1.2. **Core User Experience**
The system bridges the gap between planning (**Tasks** module), scheduling (**Calendar** module), and execution (AI-powered actions). The practitioner remains in full control via a central **"Pending Approvals"** queue—located within the Tasks module—where all significant AI-generated suggestions are presented for review before being actioned.

#### 1.3. **Target Personas**
*   **Human Practitioner:** The primary user of the CRM. They create tasks, manage their calendar, and approve/reject AI suggestions.
*   **"The Heart" AI Engine:** The backend orchestrator that receives triggers and delegates work.
*   **"Task-Master" AI Developer Agent:** The LLM agent that will use this PRD to implement the defined features.

---

### 2. V1 Feature Scope & User Stories

#### 2.1. **Task & Project Management (Manual)**
*   **User Story:** As a practitioner, I can access the **Tasks** module from the main navigation to manage my to-do items.
*   **User Story:** Within the Tasks module, I can create, view, update, and delete simple **Projects** to act as containers for my work.
*   **User Story:** I can create a **Task**, optionally assign it to a Project, and break it down into one level of **Sub-tasks**.
*   **User Story:** I can view my tasks in a "Things-inspired" UI, filtered by smart lists (**Inbox, Today, Upcoming**) and by Project.

#### 2.2. **Calendar & Google Integration**
*   **User Story:** As a practitioner, I can navigate to the **Settings** section to securely connect my Google account via OAuth.
*   **User Story:** During setup in Settings, I can either choose one of my existing Google Calendars or have the system create a new "Omnipotency AI Business" calendar to be the designated target for all CRM-related events.
*   **User Story:** I can view all my CRM and synced Google Calendar events in a unified view within the main **Calendar** module (`/calendar`).

#### 2.3. **AI-Assisted Workflow**
*   **User Story:** As a practitioner, when viewing a task, I can click an "Ask AI to help" button to trigger an AI workflow.
*   **User Story:** I can navigate to the **"Approvals" page within the Tasks module** (`/tasks/approvals`) to review all AI-generated suggestions (new tasks, email drafts, proposed calendar events).
*   **User Story:** When the AI detects a new event on my connected Google Calendar, I will see a suggestion in my "Approvals" queue to log it in the CRM and link it to the correct client.

---

### 3. Detailed Functional & Technical Requirements

#### 3.1. **Data Model & Schema**
This V1 implementation will be built upon the provided 25-table database schema. Key tables for this module are: `projects`, `tasks`, `follow_ups`, `calendar_events`, and a new `pending_approvals` table.

#### 3.2. **The `pending_approvals` System**
*   **UI Location:** Implement a dedicated page at **`/tasks/approvals`**. The `TasksSidebar` must be updated to include a navigation item for "Approvals". A summary widget on the main `/dashboard` should show a count of pending items and link to this page.
*   **Database Table:** Create the `pending_approvals` table as previously specified (id, user_id, type, status, data_payload, etc.).
*   **`data_payload` V1 JSON Structures:**
    *   For `type: 'email_draft'`: `{"to_contact_id": "uuid", "subject": "string", "body_html": "string", "template_id": "uuid" (optional)}`
    *   For `type: 'calendar_event_proposal'`: `{"contact_id": "uuid", "title": "string", "start_time": "ISO_datetime_string", "end_time": "ISO_datetime_string", "notes": "string" (optional), "source_gcal_event_id": "string" (optional)}`
    *   For `type: 'proposed_new_follow_up'`: Contains all necessary fields to create a new record in the `follow_ups` table.

#### 3.3. **Google Calendar Integration Workflow**
*   **Onboarding Location:** The user interface for initiating the Google OAuth flow and selecting a primary business calendar will be located within the **Settings** section (e.g., at `/settings/integrations`).
*   **Sync (GCal -> CRM):** Implement a background job (e.g., Supabase Edge Function) to run periodically. On detecting a new event, it creates a `pending_approvals` record of type `calendar_event_proposal`.
*   **Sync (CRM -> GCal):** When a `calendar_event_proposal` is approved, the system creates a record in the CRM's `calendar_events` table and pushes a corresponding event to the user's designated Google Calendar via the API.

#### 3.4. **API Layer (tRPC)**
All frontend interactions with the database **MUST** go through tRPC routers in `packages/server`.
*   **`taskRouter`:** `list`, `create`, `update`, `delete`.
*   **`projectRouter`:** `list`, `create`.
*   **`approvalRouter`:** `list`, `get`, `action(input: { approvalId, action, editedPayload? })`. This router is central to the AI workflow.
*   **`calendarRouter`:** `listEvents(input: { startDate, endDate })`. Fetches events from both the `calendar_events` table and the synced Google Calendar for display in the `/calendar` UI.

#### 3.5. **AI System & UX Constraints**
*   **Background Cadence & Manual Triggers:** The UI should message that background AI suggestions appear periodically, while manual triggers provide immediate feedback and a note on AI credit usage.
*   **Task/Approval Linking:** The UI for a task in the `/tasks` list must visually indicate if it has a related item pending in `/tasks/approvals`.

---

### 4. V2 & Future Scope (Not for V1 Implementation)
*   **Advanced UI:** Kanban board view for tasks.
*   **Advanced Task Organization:** In-project "Headings".
*   **Deeper Integrations:** Full 2-way sync with rich data for Google Calendar.
*   **Marketing & Analytics Integration:** Using data from other CRM modules to inform AI suggestions, as hinted at in the provided `MarketingSidebar.tsx` and `AnalyticsSidebar.tsx` files.