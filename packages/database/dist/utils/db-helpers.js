import { createClient } from '@supabase/supabase-js';
// Create a singleton Supabase client
let supabaseClient = null;
/**
 * Get or initialize the Supabase client
 * @param supabaseUrl The Supabase project URL
 * @param supabaseKey The Supabase API key
 * @returns A typed Supabase client instance
 */
export const getSupabaseClient = (supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '', supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '') => {
    if (!supabaseClient) {
        supabaseClient = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: true,
            },
        });
    }
    return supabaseClient;
};
/**
 * Error handler for database operations
 * @param error The error object
 * @param operation Description of the operation that failed
 * @returns Formatted error object with error: true
 */
export const handleDbError = (error, operation) => {
    console.error(`Database error during ${operation}:`, error);
    return {
        error: true,
        message: `Error during ${operation}: ${error.message || 'Unknown error'}`,
        details: error,
    };
};
/**
 * Safely execute a database operation with error handling
 * @param operation Function that performs the database operation
 * @param operationName Description of the operation for error reporting
 * @returns Result of the operation or error object
 */
export const safeDbOperation = async (operation, operationName) => {
    try {
        return await operation();
    }
    catch (error) {
        return handleDbError(error, operationName);
    }
};
/**
 * Check if a result contains an error
 * @param result Result from a database operation
 * @returns True if the result is an error object
 */
export const isDbError = (result) => {
    return result && typeof result === 'object' && 'error' in result && result.error === true;
};
/**
 * Handle the result of a database operation, throwing an error if it's an error object
 * @param result Result from a database operation
 * @returns The result if it's not an error
 * @throws Error if the result is an error object
 */
export const handleDbResult = (result) => {
    if (isDbError(result)) {
        throw new Error(result.message);
    }
    return result;
};
/**
 * Format a database query with parameters for logging
 * @param query SQL query string
 * @param params Query parameters
 * @returns Formatted query string
 */
export const formatQuery = (query, params = []) => {
    let formattedQuery = query;
    params.forEach((param, index) => {
        const placeholder = `$${index + 1}`;
        const value = typeof param === 'string' ? `'${param}'` : param;
        formattedQuery = formattedQuery.replace(placeholder, String(value));
    });
    return formattedQuery;
};
/**
 * Log a database query for debugging
 * @param query SQL query string
 * @param params Query parameters
 */
export const logQuery = (query, params = []) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Executing query:', formatQuery(query, params));
    }
};
