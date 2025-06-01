# Product Requirements Document: CSV Contact Import

**Version:** 1.0
**Date:** 2025-05-31
**Author:** Cascade AI

## 1. Overview

### 1.1. Problem Statement
Users migrating from other CRM/contact management systems or managing contacts in spreadsheets need an efficient way to bulk import their existing contact data into CodexCRM. Manually entering hundreds or thousands of contacts is time-consuming and error-prone.

### 1.2. Goal/Purpose
To provide users with a simple and reliable feature to import contacts into CodexCRM using a CSV (Comma Separated Values) file. This will streamline the onboarding process for new users and allow existing users to easily add contacts in bulk.

### 1.3. Target User
CodexCRM users who:
*   Are new to the platform and want to migrate their existing contact list.
*   Receive contact lists in CSV format (e.g., from lead generation, events).
*   Prefer managing and preparing contact data in spreadsheet software before importing.

## 2. User Stories

*   **As a new user,** I want to import my contacts from a CSV file so that I can quickly start using CodexCRM with my existing data without manual entry.
*   **As a sales manager,** I want to upload a list of leads acquired from a conference (in CSV format) so that my team can start follow-ups immediately.
*   **As a user,** I want to download a CSV template so that I know the correct format and fields for importing my contacts.
*   **As a user,** I want to be notified of the import progress and see a summary of successful imports and any errors so that I can verify the process and correct issues.
*   **As a user,** when importing contacts, if a contact already exists (based on email), I want to choose whether to skip the import, overwrite the existing contact, or merge the data, so I can manage duplicates effectively.

## 3. Functional Requirements

### 3.1. Core Functionality
*   Users must be able to upload a CSV file containing contact data.
*   The system must parse the CSV file and create new contact records or update existing ones based on the data.
*   The import functionality should be accessible from the Settings page, a quick link on the Dashboard, and the sidebar in the Contacts section.

### 3.2. CSV File Format & Validation
*   The system will expect a strict CSV format.
*   A downloadable CSV template/example file must be provided to users, clearly showing the required headers and data formats.
*   **Expected CSV Columns (Headers must match exactly, case-insensitive preferred for robustness but documented as case-sensitive for strictness initially):**
    *   `first_name` (Text). If blank and `last_name` is also blank, will attempt to derive from `email` (e.g., `john.doe@example.com` -> `first_name: john`).
    *   `last_name` (Text). If blank and `first_name` is also blank, will attempt to derive from `email` (e.g., `john.doe@example.com` -> `last_name: doe`).
    *   *Note: A pending schema change (Task 7.X - Refactor client name) aims to replace `first_name` and `last_name` with a single `full_name` field. If this change is implemented before or during the development of CSV import, this PRD and the CSV template will be updated to expect a `full_name` column instead.*
    *   `email` (Text, **Required for new records**, Primary Key for matching)
    *   `phone` (Text)
    *   `company` (Text)
    *   `website` (Text)
    *   `address_street` (Text)
    *   `address_city` (Text)
    *   `address_state` (Text)
    *   `address_postal_code` (Text)
    *   `address_country` (Text)
    *   `notes` (Text)
    *   `status` (Text, e.g., "active", "lead", "inactive")
    *   `lead_source` (Text)
    *   `tags` (Text, comma-separated values, e.g., "vip,new lead,requires follow-up")
    *   `birthday` (Date, format: YYYY-MM-DD)
    *   `linkedin_profile` (Text, URL)
    *   `twitter_profile` (Text, URL)
*   **Data Validation:**
    *   `email`: Must be a valid email format. This field is mandatory for creating a new contact.
    *   `first_name`, `last_name`: If `first_name` and `last_name` are both missing in the CSV for a new contact, the system will attempt to derive them from the `email` (e.g., `user.part@domain.com` might yield `first_name: user`, `last_name: part`). If derivation is not possible or if the database still requires them due to `NOT NULL` constraints without defaults (and derivation fails), the row will be flagged as an error. The strict requirement for these fields in the CSV can be relaxed if the email-derivation logic is robust.
    *   `birthday`: Must be a valid date in YYYY-MM-DD format.
    *   Other fields: Basic type validation (e.g., text shouldn't exceed DB limits).

### 3.3. Duplicate Handling
*   Duplicate checking will be based on the `email` field.
*   When an email in the CSV matches an existing contact's email, the user must be prompted to choose an action:
    *   **Skip:** Do not import or update this contact.
    *   **Overwrite:** Replace the existing contact's data with the data from the CSV row.
    *   **Merge (Optional - Advanced):** Update only the empty fields in the existing contact with values from the CSV, or provide a field-by-field merge UI. (For V1, "Overwrite" and "Skip" are sufficient. "Merge" can be a future enhancement).
    *   This choice can be made per import session (e.g., "For all duplicates in this file, do X") or potentially per duplicate if the number is small. Default to "Skip" or "Ask for all".

### 3.4. Error Handling & Reporting
*   **Import Summary:** After the import process, display a summary:
    *   Total rows in CSV.
    *   Number of contacts successfully imported/updated.
    *   Number of contacts skipped (duplicates or other reasons).
    *   Number of rows with errors.
*   **Error Details:** For rows that failed to import, provide a way for the user to view the specific errors (e.g., a downloadable CSV/list showing the problematic row data and the error message).
    *   Example errors: "Invalid email format on row X", "Missing required field 'email' on row Y", "Date format incorrect for 'birthday' on row Z".
*   **Failed Import Notification:** If the entire import process fails (e.g., invalid file type, critical error), notify the user clearly with guidance (e.g., "Import failed. Please check your CSV file against our example to ensure it is formatted correctly.").

### 3.5. UI/UX
*   A clear call-to-action (e.g., "Import Contacts" button) in designated application areas.
*   A file upload interface (e.g., drag-and-drop or file selector).
*   Link to download the CSV template/example.
*   Clear instructions on the CSV format, required fields, and data types.
*   Progress indication during the import process (e.g., "Importing X of Y contacts...").
*   Modal dialog or dedicated section for duplicate handling choices.
*   Clear success and error messages using the Sonner toast system or similar.

## 4. Non-Functional Requirements

### 4.1. Performance
*   The import process should handle reasonably large CSV files without significant UI freezing or excessive processing time. Consider background processing for files approaching the upper limit.
*   The import process will be capped at a maximum of 3000 rows per CSV file to ensure system stability and align with potential subscription tier limits.
*   Database operations (inserts/updates) should be optimized for bulk processing.

### 4.2. Security
*   Ensure that the CSV import functionality is only accessible to authenticated users.
*   All imported data must be associated with the correct `user_id`.
*   Validate CSV content to prevent injection attacks or data corruption (though CSV is generally safe, type and length checks are important).

### 4.3. Scalability (Subscription Plan Considerations)
*   The system should be designed with future subscription plan limits in mind (e.g., max contacts per plan).
*   The import process should check if the import would exceed the user's current plan limit *before* starting the actual import.
    *   If limits would be exceeded, inform the user and prevent the import or suggest an upgrade.
*   This constraint (checking plan limits) should be configurable and not hardcoded, to adapt to plan changes. (For V1, the mechanism for checking can be stubbed if plan management isn't fully built, but the import logic should be aware of it).

## 5. Acceptance Criteria

*   A user can successfully upload a CSV file matching the template and import new contacts.
*   A user can download the CSV template.
*   When importing, if a contact's email already exists, the user is prompted and can choose to skip or overwrite.
*   After import, the user sees a summary of successful imports, skips, and errors.
*   Users can view details for rows that failed to import.
*   The `first_name`, `last_name`, and `email` fields from the CSV are correctly mapped to the client record. If `first_name` or `last_name` are missing for a new record, they are handled according to the defined strategy (e.g. placeholder or error if required by DB).
*   Imported contacts are correctly associated with the logged-in user.
*   The feature is accessible from Settings, Dashboard quick links, and Contacts sidebar.
*   (Future) The import respects contact limits based on the user's subscription plan.

## 6. Out of Scope (Non-Goals) for V1

*   Automatic mapping of arbitrary CSV columns to contact fields (V1 uses a strict, predefined template).
*   Advanced field-by-field merging for duplicates.
*   Real-time collaborative import.
*   Importing from other file formats (e.g., Excel, vCard) directly.
*   Assigning contacts to specific Groups during the CSV import (can be a V2 feature by adding a 'group_names' column).
*   Importing `profile_photo_url` or `custom_fields` (JSONB).

## 7. Open Questions/Future Considerations

*   Final strategy for handling missing `first_name`/`last_name` if DB constraints are `NOT NULL` and no default values are set. Should DB schema be relaxed for these fields?
*   How to handle very large CSV files (e.g., >10,000 rows)? Background job processing might be needed.
*   Detailed UI mockups for the import flow, especially for error reporting and duplicate handling.
*   Mechanism for users to define their own custom fields and map them during import (a more advanced feature).
