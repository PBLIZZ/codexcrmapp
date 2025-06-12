/**
 * Defines application-wide route paths and constants for CodexCRM.
 * Centralizes path management to prevent magic strings and facilitate easy updates.
 */

/**
 * An array of public-facing paths related to the authentication flow.
 * Used to determine if a user is on an auth page.
 */
export const AUTH_PAGES: string[] = [
  '/log-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/sign-up/confirmation',
];

/**
 * The primary sign-in page for the application.
 * Unauthenticated users on protected routes will be redirected here.
 */
export const LOG_IN_PATH: string = '/log-in';

/**
 * The main dashboard or home page for authenticated users.
 * Users will be redirected here after a successful login.
 */
export const DASHBOARD_PATH: string = '/dashboard';
