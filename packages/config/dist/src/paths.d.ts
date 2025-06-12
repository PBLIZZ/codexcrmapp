/**
 * Defines application-wide route paths and constants for CodexCRM.
 * Centralizes path management to prevent magic strings and facilitate easy updates.
 */
/**
 * An array of public-facing paths related to the authentication flow.
 * Used to determine if a user is on an auth page.
 */
export declare const AUTH_PAGES: string[];
/**
 * The primary sign-in page for the application.
 * Unauthenticated users on protected routes will be redirected here.
 */
export declare const LOG_IN_PATH: string;
/**
 * The main dashboard or home page for authenticated users.
 * Users will be redirected here after a successful login.
 */
export declare const DASHBOARD_PATH: string;
//# sourceMappingURL=paths.d.ts.map