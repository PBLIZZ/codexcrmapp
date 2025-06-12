import Papa, { ParseResult, ParseError, ParseLocalConfig } from 'papaparse';

export interface ParsedCsvRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ValidatedContactData {
  full_name: string;
  email: string | null;
  phone?: string | null;
  company?: string | null;
  job_title?: string | null;
  website?: string | null;
  notes?: string | null;
  lead_source?: string | null;
  tags?: string | null;
}

export interface ParseCsvFileResult {
  data: ParsedCsvRow[];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

/**
 * Parses a CSV file using Papa Parse.
 * @param file The CSV file to parse.
 * @param options Optional Papa Parse configuration.
 * @returns A Promise that resolves with the parsed data, errors, and metadata.
 */
export function parseCsvFile(
  file: File,
  options?: Omit<ParseLocalConfig<ParsedCsvRow, File>, 'complete' | 'error'>
): Promise<ParseCsvFileResult> {
  return new Promise((resolve, reject) => {
    const papaConfig: ParseLocalConfig<ParsedCsvRow, File> = {
      // Default settings that can be overridden by options
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      ...options, // User-provided options override defaults but not complete/error

      // Explicitly defined complete and error for local file parsing
      complete: (results: ParseResult<ParsedCsvRow>, parsedFile: File) => {
        resolve({
          data: results.data,
          errors: results.errors,
          meta: results.meta,
        });
      },
      error: (error: Error, parsedFile: File) => {
        console.error('Error parsing CSV file:', error, parsedFile);
        const err = new Error(error.message);
        // You could attach the original PapaError to the new Error if needed:
        // (err as any).papaErrorDetails = error;
        reject(err);
      },
    };

    Papa.parse(file, papaConfig);
  });
}

// Example usage (can be tested in a component or another script):
/*
async function handleFile(selectedFile: File) {
  try {
    const result = await parseCsvFile(selectedFile);
    console.log('Parsed Data:', result.data);
    if (result.errors.length > 0) {
      console.warn('Parsing Errors:', result.errors);
    }
    console.log('Metadata:', result.meta);
  } catch (error) {
    console.error('Failed to parse CSV:', error);
  }
}
*/

export interface CsvValidationError {
  row?: number; // Row number in the CSV (1-indexed for data rows)
  field?: string;
  message: string;
  type: 'header' | 'data' | 'email_format';
}

const REQUIRED_HEADERS: string[] = ['full_name', 'email'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
const URL_REGEX =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

export function validateCsvData(parsedResult: ParseCsvFileResult): {
  validatedData: ValidatedContactData[];
  errors: CsvValidationError[];
} {
  const errors: CsvValidationError[] = [];
  const headers = parsedResult.meta.fields;

  if (!headers || headers.length === 0) {
    errors.push({
      message: 'CSV is empty or headers are missing.',
      type: 'header',
    });
    return { validatedData: [], errors }; // Stop validation if no headers
  }

  // 1. Validate Headers
  for (const requiredHeader of REQUIRED_HEADERS) {
    if (!headers.includes(requiredHeader)) {
      errors.push({
        message: `Required header "${requiredHeader}" is missing.`,
        type: 'header',
        field: requiredHeader,
      });
    }
  }

  // If critical header errors exist, perhaps return early
  if (
    errors.some(
      (err) =>
        err.type === 'header' && REQUIRED_HEADERS.includes(err.field || '')
    )
  ) {
    // Optionally, return only header errors if essential headers are missing
    // return errors;
  }

  // 2. Validate Data Rows and Transform Missing Names
  const validatedData: ValidatedContactData[] = [];
  parsedResult.data.forEach((originalRow, index) => {
    const row = { ...originalRow }; // Work on a copy
    const csvRowNumber = index + 2; // PapaParse data is 0-indexed, CSV rows are 1-indexed, +1 for header

    // Trim whitespace from all string values in the row
    for (const key in row) {
      if (typeof row[key] === 'string') {
        row[key] = (row[key] as string).trim();
      }
    }
    let emailIsValid = false;

    // Check for email presence and basic format
    const emailValue = row.email;
    if (
      emailValue === null ||
      emailValue === undefined ||
      String(emailValue).trim() === ''
    ) {
      errors.push({
        row: csvRowNumber,
        field: 'email',
        message: 'Email is missing.',
        type: 'data',
      });
    } else if (
      typeof emailValue === 'string' &&
      !EMAIL_REGEX.test(emailValue.trim())
    ) {
      errors.push({
        row: csvRowNumber,
        field: 'email',
        message: `Invalid email format: "${emailValue}".`,
        type: 'email_format',
      });
    } else {
      emailIsValid = true;
    }

    // Handle full_name
    const fullNameValue = row.full_name;
    if (
      fullNameValue === null ||
      fullNameValue === undefined ||
      String(fullNameValue).trim() === ''
    ) {
      if (emailIsValid && typeof emailValue === 'string') {
        const emailLocalPart = emailValue.split('@')[0];
        const nameParts = emailLocalPart
          .split(/[._-]/) // Split by common separators like '.', '_', '-'
          .map(
            (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          )
          .filter((part) => part !== ''); // Remove empty parts

        if (nameParts.length > 0) {
          row.full_name = nameParts.join(' ');
        } else {
          row.full_name = 'Imported Contact'; // Fallback if email local part is unusual
        }
      } else {
        row.full_name = 'Imported Contact'; // Fallback if email is not valid for derivation
        // Only add an error if email was also missing/invalid, otherwise we've provided a fallback.
        if (!emailIsValid) {
          errors.push({
            row: csvRowNumber,
            field: 'full_name',
            message:
              'Full name is missing and cannot be derived (invalid or missing email).',
            type: 'data',
          });
        }
      }
    }
    // Ensure first_name and last_name are not present on the row object before casting
    delete row.first_name;
    delete row.last_name;

    // Validate website if present
    const websiteValue = row.website;
    if (
      websiteValue !== null &&
      websiteValue !== undefined &&
      String(websiteValue).trim() !== ''
    ) {
      if (
        typeof websiteValue !== 'string' ||
        !URL_REGEX.test(String(websiteValue).trim())
      ) {
        errors.push({
          row: csvRowNumber,
          field: 'website',
          message: `Invalid URL format for website: "${websiteValue}".`,
          type: 'data',
        });
      }
    }

    // After all transformations and validations for the row
    validatedData.push(row as unknown as ValidatedContactData); // Cast to ValidatedContactData after processing
  });

  return { validatedData, errors };
}
