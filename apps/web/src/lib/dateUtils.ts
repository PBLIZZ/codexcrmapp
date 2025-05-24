// apps/web/src/lib/dateUtils.ts

/**
 * Safely parses a date string or Date object.
 * @param dateInput The date string or Date object.
 * @returns A Date object if parsing is successful, otherwise null.
 */
function safeParseDate(dateInput: string | Date | null | undefined): Date | null {
  if (!dateInput) return null;
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formats a date for display (e.g., MM/DD/YYYY, HH:mm).
 * @param dateInput The date string or Date object.
 * @returns Formatted date string or '—' if invalid.
 */
export function formatDateForDisplay(dateInput: string | Date | null | undefined): string {
  const date = safeParseDate(dateInput);
  if (!date) return '—';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format for consistency with datetime-local
  };
  // Adjust to a common display format, e.g., 07/11/2022, 02:02
  // Intl.DateTimeFormat can be locale-sensitive. For DD/MM/YYYY HH:mm:
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

/**
 * Formats a date for the value of a datetime-local input (YYYY-MM-DDTHH:mm).
 * @param dateInput The date string or Date object.
 * @returns Formatted date string for input or empty string if invalid.
 */
export function formatDateForInput(dateInput: string | Date | null | undefined): string {
  const date = safeParseDate(dateInput);
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Parses a datetime-local input string (YYYY-MM-DDTHH:mm) into a full ISO string.
 * @param inputDateString The date string from datetime-local input.
 * @returns Full ISO string or null if input is invalid/empty.
 */
export function parseInputDateString(inputDateString: string | null | undefined): string | null {
  if (!inputDateString) return null;
  // Input is YYYY-MM-DDTHH:mm. Convert to Date object then to full ISO string.
  const date = new Date(inputDateString);
  if (isNaN(date.getTime())) return null;
  return date.toISOString();
}

/**
 * Formats a date for display in a more user-friendly way, e.g., 'November 7, 2022, 2:02 AM'.
 * Uses Intl.DateTimeFormat for better localization if needed in the future.
 * @param dateInput The date string or Date object.
 * @returns Formatted date string or '—' if invalid.
 */
export function formatDateTime(dateInput: string | Date | null | undefined): string {
  const date = safeParseDate(dateInput);
  if (!date) return '—';

  return new Intl.DateTimeFormat(undefined, { // undefined locale uses browser's default
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    // timeZoneName: 'short' // Optional: if you want to display timezone
  }).format(date);
}
