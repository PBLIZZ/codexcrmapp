## **Product Requirements Document (PRD): CodexCRM - V1 AI-Powered Tasks Module**

**Version:** 2.0
**Date:** June 17, 2025
**Status:** Design Brief Integrated, Ready for Development

### 1. Overview & Vision

#### 1.1. **Product Goal**
To build a Tasks module that is not merely a to-do list, but a proactive, intelligent project manager. The design philosophy is a **partnership between the user and the AI**, where the user is always in control, but the AI does the heavy lifting. This module will empower practitioners to go from a high-level goal to a fully planned and partially executed project with minimal manual effort.

#### 1.2. **Primary User Story: "The New Year, New You Workshop"**
*Natalie, a wellness coach, wants to launch a new workshop. Feeling overwhelmed by the scope, she uses the Tasks module's AI to generate a complete project plan, delegate administrative tasks (like drafting emails) to the AI for completion, and receives proactive suggestions for next steps, turning a daunting goal into a manageable, AI-assisted workflow.*

#### 1.3. **Key UI/UX Symbol**
*   **The "Magic Sparkle" (✨) Icon:** This will be the consistent, branded visual indicator for all AI-powered actions and features throughout the module.

---

### 2. V1 Core Features & User Flows

This V1 is defined by three primary AI interaction features, supported by foundational manual controls and calendar intelligence.

#### 2.1. **Feature 1: AI-Assisted Project Creation ("The Blank Slate Solver")**
*   **User Goal:** "I have a big goal, but don't know the steps. I want the AI to build the project plan for me."
*   **User Story:** As Natalie, I can click "Create Project with AI," describe my goal ("Get 20 signups for my 'New Year New You' workshop"), and have the AI populate a new project with a comprehensive, editable list of tasks.
*   **User Flow:**
    1.  User navigates to Tasks -> Clicks "New Project" -> Clicks a "Create with AI" ✨ button.
    2.  An AI chat pane slides out from the right.
    3.  User types their goal into the chat input.
    4.  The AI responds with a preview of the suggested project and task list.
    5.  User reviews the list and clicks "Create Project."
    6.  A new project is created in their account, populated with the AI-generated tasks.

#### 2.2. **Feature 2: AI-Powered Task Completion ("The Do-it-for-me Button")**
*   **User Goal:** "This task is an action the AI can perform. I want it to do the work and let me approve the result."
*   **User Story:** As Natalie, I see a task "Draft marketing email for workshop." I click the ✨ "AI-Do" button. The AI drafts the email and changes the task status to "Pending Approval." I can then review, edit, and approve the email to be sent.
*   **User Flow:**
    1.  User sees a task with a ✨ icon, indicating it's AI-eligible.
    2.  User clicks the ✨ "AI-Do" button. The task's UI state changes to "AI - In Progress."
    3.  Upon completion, the state changes to "AI - Pending Approval."
    4.  User clicks the task to open the Approval UI (modal or expandable view).
    5.  User reviews the AI-generated content (e.g., the email draft).
    6.  User clicks "Approve & Send," "Edit," or "Reject."

#### 2.3. **Feature 3: Proactive Task Suggestions ("The Proactive Assistant")**
*   **User Goal:** "I want the app to connect the dots and suggest what I should do next."
*   **User Story:** As Natalie, after adding a new "potential collaborator" contact, I see a new item in my "AI Suggestions" list: "Follow up with [New Contact Name]." I can click to accept it (turning it into a real task) or dismiss it.
*   **User Flow:**
    1.  AI background jobs detect an opportunity (e.g., new lead, client inactivity).
    2.  A `pending_approvals` record is created with type `proposed_new_follow_up`.
    3.  The UI in `/tasks/approvals` displays this as a suggestion.
    4.  User clicks "Accept" to create a new record in the `follow_ups` or `tasks` table, or "Dismiss" to reject it.

---

### 3. Business & Monetization Requirements

*   **Tiered Plans:** The UI must visually differentiate between `Free` and `Plus` user plans.
    *   **Free Plan:** AI features are visible but limited. The ✨ icon is present but if they reach their usage limit it will be disabled/greyed-out. Clicking it triggers a modal prompting an upgrade. A UI element must inform user that the tasks they delegate to AI are subject to a monthly limit. They can reduce their usage by deleting tasks they no longer need or by upgrading to a Plus plan. AI models for the free plan are less powerful than the paid plan.
    *   **Plus Plan:** All AI features are fully enabled. AI models for the paid plan are more powerful than the free plan.

---

### 4. Detailed Technical & Architectural Requirements

#### 4.1. **Data Model & Schema Updates**
*   **Use mcp tool calls to work with supabase directly to update the schema.**
*   **`tasks` Table:**
    *   The `status` column (text) must support: `pending`, `in_progress`, `ai_in_progress`, `pending_approval`, `completed`, `cancelled`.
    *   Add a new column: `is_ai_eligible` (boolean, default: false). This will be set by the system to determine if the ✨ icon should be shown.
*   **`pending_approvals` Table (as defined previously):**
    *   This table is central to Features 2 and 3.
    *   The `type` column must support: `email_draft`, `calendar_event_proposal`, `proposed_new_follow_up`.
    *   The `status` column must support: `pending_review`, `approved`, `rejected`, `executed`, `execution_failed`.
    *   Add nullable FKs: `related_task_id` (links to `tasks`).
*   **New `ai_usage_logs` Table:**
    *   Schema: `id` (uuid), `user_id` (uuid), `interaction_type` (text, e.g., 'project_creation', 'task_completion'), `credits_consumed` (integer, default 1), `created_at` (timestamptz).

#### 4.2. **UI Component & State Design**
*   **Task Item (`ThingsTaskCard.tsx`):** Must be refactored to visually represent all new statuses:
    *   `ai_in_progress`: A subtle loading indicator or animation.
    *   `pending_approval`: A prominent badge/icon that is clearly clickable.
    *   `is_ai_eligible`: The ✨ icon should be visible and clickable.
*   **Approval UI:** A modal or expandable component that renders the `data_payload` from a `pending_approvals` record and provides "Approve," "Edit," and "Reject" actions.
*   **AI Chat Pane:** A new component, likely a right-hand slide-out panel, with a chat history view, text input, and submit button for Feature 1.
*   **Plan Gating:** Components containing AI features must be aware of the user's plan and render the "locked" or "active" state accordingly. The AI usage counter should be displayed prominently, perhaps in the `TasksSidebar`.

#### 4.3. **API Layer (tRPC) - Revised**
*   **Middleware (`planCheckMiddleware`):** A new tRPC middleware must protect all AI-powered endpoints. It will:
    1.  Check the user's current plan (`Plus` or `Free`).
    2.  Check their remaining AI interaction count.
    3.  If allowed, proceed with the execution and log the interaction in `ai_usage_logs`.
    4.  If disallowed, throw a `FORBIDDEN` TRPCError with a message prompting an upgrade.
*   **New `aiRouter`:**
    *   `createProjectFromGoal(input: { goal: string })`: Powers Feature 1. Protected by `planCheckMiddleware`.
    *   `executeTask(input: { taskId: string })`: Powers Feature 2. Protected by `planCheckMiddleware`.
*   **`approvalRouter` (`action` procedure):** When an action is approved, and it fails (e.g., email service is down), the procedure must catch the error, update the `pending_approvals` record status to `execution_failed`, and store the error message in `execution_error_details`.

#### 4.4. **Calendar & Settings Location**
*   **Calendar Module:** All calendar-related UI will reside under the `/calendar` route.
*   **Google Calendar Onboarding:** The UI for connecting a Google Calendar will reside in the Settings section at `/settings/integrations`.

---

### 5. V2 & Future Scope
*   Advanced task organization (Kanban, Headings).
*   Deeper calendar intelligence (e.g., "AI, find a time for me and Jane Doe next week").
*   Integration with Marketing/Analytics data for more contextual AI suggestions.