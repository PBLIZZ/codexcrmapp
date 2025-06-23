# Future Schema Considerations for Omnipotency AI CRM

**Date:** April 26, 2025
**Context:** This document captures a comprehensive list of potential database tables and relationships that were considered during the initial planning and visioning phase of Omnipotency AI CRM. While the MVP will start with a leaner schema focused on core contact and group management, these represent potential future expansions as features are developed. This serves as a reference for future schema design and evolution.

---

## I. Core CRM Entities (Beyond Initial MVP)

### 1. Programs & Sessions

- **`programs`**: For multi-session programs, courses, or packages.
  - `id (uuid PK)`
  - `user_id (uuid FK to auth.users)`
  - `name (text NOT NULL)`
  - `description (text)`
  - `start_date (date)`, `end_date (date)`
  - `price (numeric)`
  - `status (text)` (e.g., 'draft', 'active', 'archived')
  - `created_at (timestamptz)`, `updated_at (timestamptz)`
- **`sessions`**: For individual appointments, classes, or sessions (can be part of a program or standalone).
  - `id (uuid PK)`
  - `user_id (uuid FK to auth.users)`
  - `contact_id (uuid FK to contacts.id, NULLABLE)` (Primary contact for 1-on-1)
  - `program_id (uuid FK to programs.id, NULLABLE)`
  - `service_id (uuid FK to services.id, NULLABLE)` (See "Services" below)
  - `title (text NOT NULL)`
  - `scheduled_at (timestamptz NOT NULL)`
  - `duration_minutes (integer)`
  - `location (text)`
  - `status (text NOT NULL)` (e.g., 'pending_ai_confirmation', 'scheduled_in_crm', 'synced_to_gcal', 'completed', 'cancelled', 'no_show')
  - `notes (text)`
  - `google_calendar_event_id (text, NULLABLE, UNIQUE per user_id)`
  - `created_at (timestamptz)`, `updated_at (timestamptz)`
- **`session_attendees`**: Junction table for group sessions (Many-to-Many: `sessions` ↔ `contacts`).
  - `session_id (uuid FK to sessions.id)`
  - `contact_id (uuid FK to contacts.id)`
  - `user_id (uuid FK to auth.users)`
  - `attendance_status (text DEFAULT 'registered')`
  - `notes (text)`
  - `PRIMARY KEY (session_id, contact_id)`
- **`program_enrollments`**: Junction table for program enrollments (Many-to-Many: `programs` ↔ `contacts`).
  - `program_id (uuid FK to programs.id)`
  - `contact_id (uuid FK to contacts.id)`
  - `user_id (uuid FK to auth.users)`
  - `enrollment_date (timestamptz)`
  - `status (text DEFAULT 'active')`
  - `completion_date (timestamptz)`
  - `PRIMARY KEY (program_id, contact_id)`

### 2. Services

- **`services`**: For defining individual service offerings.
  - `id (uuid PK)`
  - `user_id (uuid FK to auth.users)`
  - `name (text NOT NULL)`
  - `description (text)`
  - `duration_minutes (integer)`
  - `price (numeric)`
  - `is_active (boolean DEFAULT true)`
  - `created_at (timestamptz)`, `updated_at (timestamptz)`

## II. Supporting CRM & Business Management Entities

### 3. Follow-ups & Tasks (Internal for Practitioner)

- **`follow_ups` / `tasks`**: (Could be one table or separate, `tasks` is more generic)
  - `id (uuid PK)`
  - `user_id (uuid FK to auth.users)`
  - `contact_id (uuid FK to contacts.id, NULLABLE)`
  - `project_id (uuid FK to projects.id, NULLABLE)` (See "Projects" below)
  - `session_id (uuid FK to sessions.id, NULLABLE)`
  - `title (text NOT NULL)`
  - `description (text)`
  - `due_date (timestamptz)`
  - `priority (text DEFAULT 'medium')`
  - `status (text DEFAULT 'pending')` (e.g., 'pending', 'in_progress', 'completed', 'deferred')
  - `completed_at (timestamptz)`
  - `parent_task_id (uuid FK to tasks.id, NULLABLE)` (For sub-tasks)
  - `created_at (timestamptz)`, `updated_at (timestamptz)`
- **`projects`**: Simple containers for tasks/follow-ups.
  - `id (uuid PK)`
  - `user_id (uuid FK to auth.users)`
  - `name (text NOT NULL)`
  - `status (text DEFAULT 'active')`
  - `created_at (timestamptz)`, `updated_at (timestamptz)`

### 4. Notes (Detailed Notes beyond `contacts.notes`)

- **`contact_notes` / `session_notes` (or a unified `notes` table with polymorphic relations):**
  - `id (uuid PK)`
  - `user_id (uuid FK to auth.users)`
  - `contact_id (uuid FK to contacts.id, NULLABLE)`
  - `session_id (uuid FK to sessions.id, NULLABLE)`
  - `program_id (uuid FK to programs.id, NULLABLE)`
  - `title (text)`
  - `content (text NOT NULL)`
  - `is_pinned (boolean DEFAULT false)`
  - `note_type (text DEFAULT 'general')`
  - `created_at (timestamptz)`, `updated_at (timestamptz)`

### 5. Financials

- **`payments`**:
  - `id (uuid PK)`
  - `user_id (uuid FK to auth.users)`
  - `contact_id (uuid FK to contacts.id)`
  - `session_id (uuid FK to sessions.id, NULLABLE)`
  - `program_id (uuid FK to programs.id, NULLABLE)`
  - `service_id (uuid FK to services.id, NULLABLE)`
  - `amount (numeric NOT NULL)`
  - `currency (char(3) DEFAULT 'USD')`
  - `status (text NOT NULL)` (e.g., 'pending', 'paid', 'failed', 'refunded')
  - `method (text)`
  - `external_payment_id (text UNIQUE)` (e.g., Stripe ID)
  - `paid_at (timestamptz)`
  - `created_at (timestamptz)`, `updated_at (timestamptz)`
- **`invoices`** & **`invoice_items`**: For more formal invoicing.
  - (Schema similar to what was previously detailed)

### 6. Communication & Templates

- **`communications`**: Log of emails, (future) SMS/WhatsApp sent via CRM.
  - `id (uuid PK)`
  - `user_id (uuid FK to auth.users)`
  - `contact_id (uuid FK to contacts.id)`
  - `communication_type (text NOT NULL)` (e.g., 'email', 'sms')
  - `subject (text)`
  - `body_preview (text)`
  - `status (text DEFAULT 'sent')` (e.g., 'draft', 'sent', 'failed', 'opened', 'clicked')
  - `sent_at (timestamptz)`
  - `template_id (uuid FK to templates.id, NULLABLE)`
- **`templates`**: User-created templates for emails, messages.
  - `id (uuid PK)`
  - `user_id (uuid FK to auth.users)`
  - `name (text NOT NULL)`
  - `subject (text)`
  - `body_html (text NOT NULL)`
  - `template_type (text DEFAULT 'email')`
  - `variables (jsonb)` (e.g., `{{contact.first_name}}`)

### 7. Resources & Sharing

- **`resources`**: For the practitioner's downloadable library.
  - `id (uuid PK)`
  - `user_id (uuid FK to auth.users)`
  - `title (text NOT NULL)`
  - `description (text)`
  - `resource_type (text)` (e.g., 'pdf', 'video_link', 'audio_file')
  - `file_path_storage (text)` (Path in Supabase Storage)
  - `external_url (text)`
  - `tags (text[])`
- **`resource_shares`**: Junction linking resources to contacts.
  - `resource_id (uuid FK to resources.id)`
  - `contact_id (uuid FK to contacts.id)`
  - `user_id (uuid FK to auth.users)`
  - `shared_at (timestamptz)`
  - `PRIMARY KEY (resource_id, contact_id)`

## III. AI & System Specific Tables (MVP & Near Future)

- **`pending_approvals`** (As defined previously):
  - `id (uuid PK)`, `user_id`, `type`, `status`, `related_contact_id`, `related_session_id`, `source_trigger`, `data_payload (jsonb)`, `ai_confidence_score`, `created_at`, `resolved_at`.
- **`oauth_connections`** (As defined previously):
  - `id (uuid PK)`, `user_id`, `provider` (e.g., 'google_gmail', 'google_calendar'), `access_token (encrypted)`, `refresh_token (encrypted)`, `expires_at`, `scopes`, `last_synced_at`.
- **`user_settings`** (Instead of generic `settings`):
  - `user_id (uuid PK, FK to auth.users.id)`
  - `setting_key (text NOT NULL)`
  - `setting_value (jsonb)`
  - `PRIMARY KEY (user_id, setting_key)`
  - (Example keys: 'gcal_business_calendar_id', 'ai_scan_frequency_gmail', 'enrichment_enabled')

---

This document should be reviewed when planning new features or sprints to ensure a consistent and thoughtful evolution of the Omnipotency AI CRM database schema.
