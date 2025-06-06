# PRD: CodexCRM Auth UI/UX Enhancement

## 1. Introduction
This document outlines the requirements for enhancing the User Interface (UI) and User Experience (UX) of the authentication pages (Sign Up and Log In) for the CodexCRM application. The goal is to create a more modern, intuitive, and visually consistent authentication flow, incorporating best practices and specific branding elements.

## 2. Goals
-   Improve the visual appeal and consistency of Sign Up and Log In pages.
-   Enhance user experience by simplifying forms and incorporating UX best practices.
-   Reinforce brand identity by adding the company logo.
-   Collect user's name during the sign-up process.
-   Ensure seamless integration with Supabase authentication and profile management.

## 3. User Stories
-   As a new user, I want a visually appealing and intuitive sign-up form so I can easily create an account with my name, email, and password.
-   As a returning user, I want a clear and consistent log-in form so I can quickly access my account using my email and password, magic link, or Google.
-   As a user, I want to see the company logo on authentication pages to reinforce trust and brand recognition.
-   As a user, I want the option to sign up or log in using my Google account for convenience.
-   As a user, I want to be clearly informed of password requirements during sign-up.
-   As a user, I want to easily switch between Log In and Sign Up pages.

## 4. Functional Requirements

### 4.1. General Changes
-   **Terminology:** Rename all instances of "Sign In" (and its variations like "SignIn", "signin") to "Log In" (and "LogIn", "login"). This includes page titles, component names, button texts, links.
-   **Logo:** Display the company logo (e.g., from `public/images/logo.png` or a similar path accessible to the auth pages) prominently on both Log In and Sign Up pages.
-   **Styling Theme (apply to both Log In and Sign Up pages):**
    -   Text color: `text-teal-800`
    -   Accent color (e.g., links, highlights): `text-orange-500`
    -   Page background (area outside the form card): `bg-teal-50`
    -   Form container background (Card component): A light, contrasting color (e.g., `bg-white` or `bg-gray-50`).
-   **Component Library:** Investigate and utilize Shadcn UI components (e.g., `Card`, `Input`, `Button`, `Label`) for form elements, adapting them as needed. Look for existing Shadcn templates for login/signup forms as a base.

### 4.2. Log In Page (formerly Sign In Page)
-   **Location:** `apps/web/app/(auth)/sign-in/page.tsx` (content to be updated). Consider if the route path itself should change from `/sign-in` to `/log-in`.
-   **Content & Layout:**
    -   Company Logo.
    -   Title: "Log In" or "Log in to CodexCRM".
    -   Form elements within a Card component.
    -   Input fields for Email and Password. Labels should appear as placeholders *inside* the input boxes (or as floating labels if preferred and easily achievable with Shadcn).
    -   "Log In" button (primary action, styled: `bg-teal-800 text-teal-200`).
    -   "Forgot Password?" link.
    -   "Continue with Google" button (using existing/standard Google button component).
    -   Option for Magic Link (if retained from current design, styled consistently).
    -   Link to "Sign Up" page (e.g., "Don't have an account? Sign Up").
    -   Consider adding "By logging in I accept the Company's Terms of Use and Privacy Policy" text below the form.

### 4.3. Sign Up Page
-   **Location:** `apps/web/app/(auth)/sign-up/page.tsx`
-   **Content & Layout (to match Log In page's new style):**
    -   Company Logo.
    -   Title: "Sign Up" or "Create your CodexCRM Account".
    -   Form elements within a Card component.
    -   Input fields:
        -   Name (Full Name)
        -   Email
        -   Password
    -   Labels should appear as placeholders *inside* the input boxes (or floating).
    -   Password requirements should be clearly visible or indicated dynamically (e.g., next to the field or on focus/error).
    -   Option to show/hide password (toggle icon within the password input).
    -   "Sign Up" button: `bg-teal-800 text-teal-200`.
    -   "Sign up with Google" button (using existing/standard Google button component).
    -   Link to "Log In" page (e.g., "Already have an account? Log In").
    -   Consider adding "By signing up I accept the Company's Terms of Use and Privacy Policy" text below the form.
-   **Data Handling:**
    -   The "Name" field collected during sign-up must be stored. This should be passed to Supabase `auth.signUp` via the `options.data` field (e.g., `{ data: { full_name: 'User Name' } }`). This data will be stored in `auth.users.raw_user_meta_data`.

### 4.4. Profile Creation
-   The act of signing up (or logging in for the first time via OAuth if it creates an account) must result in a usable user profile.
-   The application relies on Supabase `auth.users` for basic user data.
-   If a separate `profiles` table is used for extended user data (as implied by "profile page already exists"), ensure that a new record in this `profiles` table is automatically created when a new user signs up (typically handled by a Supabase database trigger on `auth.users` table insertions). The `name` collected (as `full_name` in `raw_user_meta_data`) should be copied to the relevant field in the `profiles` table by this trigger.

## 5. UI/UX Best Practices to Incorporate (from provided text)
-   **Simplicity:** Keep forms as short as possible.
-   **Autofocus:** Automatically focus on the first input field of the form.
-   **Input Validation:** Provide instant (inline) validation for form fields.
-   **Clear Calls to Action:** Use descriptive labels for buttons.
-   **Error Handling:** Display clear, user-friendly error messages.
-   **Password Visibility:** Mask password by default, but allow users to show it.
-   **Switching Forms:** Easy navigation between Log In and Sign Up.
-   **Distinct Terms:** Use "Log In" and "Sign Up" to avoid confusion.

## 6. Non-Functional Requirements
-   **Responsiveness:** Forms must be responsive and usable across various screen sizes.
-   **Accessibility:** Adhere to WCAG AA guidelines where possible.
-   **Performance:** Pages should load quickly.

## 7. Out of Scope
-   Implementation of the profile editing page itself (assumed to exist).
-   Major changes to the backend authentication logic beyond storing the name and ensuring profile trigger works.
-   Multi-step registration process (current design is single step).
