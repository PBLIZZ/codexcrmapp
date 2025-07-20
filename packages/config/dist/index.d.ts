/**
 * Defines application-wide route paths and constants for CodexCRM.
 * Centralizes path management to prevent magic strings and facilitate easy updates.
 */
/**
 * An array of public-facing paths related to the authentication flow.
 * Used to determine if a user is on an auth page.
 */
declare const AUTH_PAGES: readonly ["/log-in", "/sign-up", "/forgot-password", "/reset-password", "/sign-up/confirmation"];
/**
 * The primary sign-in page for the application.
 * Unauthenticated users on protected routes will be redirected here.
 */
declare const LOG_IN_PATH: "/log-in";
/**
 * The main dashboard or home page for authenticated users.
 * Users will be redirected here after a successful login.
 */
declare const DASHBOARD_PATH: "/dashboard";

export { AUTH_PAGES, DASHBOARD_PATH, LOG_IN_PATH };
