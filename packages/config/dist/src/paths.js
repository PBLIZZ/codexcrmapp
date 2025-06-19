"use strict";
/**
 * Defines application-wide route paths and constants for CodexCRM.
 * Centralizes path management to prevent magic strings and facilitate easy updates.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DASHBOARD_PATH = exports.LOG_IN_PATH = exports.AUTH_PAGES = void 0;
/**
 * An array of public-facing paths related to the authentication flow.
 * Used to determine if a user is on an auth page.
 */
exports.AUTH_PAGES = [
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
exports.LOG_IN_PATH = '/log-in';
/**
 * The main dashboard or home page for authenticated users.
 * Users will be redirected here after a successful login.
 */
exports.DASHBOARD_PATH = '/dashboard';
