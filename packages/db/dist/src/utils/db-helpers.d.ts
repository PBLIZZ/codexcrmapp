import type { Database } from '../database.types';
/**
 * Get or initialize the Supabase client
 * @param supabaseUrl The Supabase project URL
 * @param supabaseKey The Supabase API key
 * @returns A typed Supabase client instance
 */
export declare const getSupabaseClient: (supabaseUrl?: string, supabaseKey?: string) => import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
/**
 * Error handler for database operations
 * @param error The error object
 * @param operation Description of the operation that failed
 * @returns Formatted error object with error: true
 */
export declare const handleDbError: (error: any, operation: string) => {
    error: true;
    message: string;
    details: any;
};
/**
 * Safely execute a database operation with error handling
 * @param operation Function that performs the database operation
 * @param operationName Description of the operation for error reporting
 * @returns Result of the operation or error object
 */
export declare const safeDbOperation: <T>(operation: () => Promise<T>, operationName: string) => Promise<T | {
    error: true;
    message: string;
    details: any;
}>;
/**
 * Check if a result contains an error
 * @param result Result from a database operation
 * @returns True if the result is an error object
 */
export declare const isDbError: (result: any) => result is {
    error: true;
    message: string;
    details: any;
};
/**
 * Handle the result of a database operation, throwing an error if it's an error object
 * @param result Result from a database operation
 * @returns The result if it's not an error
 * @throws Error if the result is an error object
 */
export declare const handleDbResult: <T>(result: T | {
    error: true;
    message: string;
    details: any;
}) => T;
/**
 * Format a database query with parameters for logging
 * @param query SQL query string
 * @param params Query parameters
 * @returns Formatted query string
 */
export declare const formatQuery: (query: string, params?: any[]) => string;
/**
 * Log a database query for debugging
 * @param query SQL query string
 * @param params Query parameters
 */
export declare const logQuery: (query: string, params?: any[]) => void;
