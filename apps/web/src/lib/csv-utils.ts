import Papa, { ParseResult, ParseError, ParseLocalConfig } from 'papaparse';

export interface ParsedCsvRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ValidatedContactData {
  first_name: string;
  last_name: string;
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

const REQUIRED_HEADERS: string[] = ['first_name', 'last_name', 'email'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export function validateCsvData(
  parsedResult: ParseCsvFileResult
): { validatedData: ValidatedContactData[]; errors: CsvValidationError[] } {
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
  if (errors.some(err => err.type === 'header' && REQUIRED_HEADERS.includes(err.field || ''))) {
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
    if (emailValue === null || emailValue === undefined || String(emailValue).trim() === '') {
      errors.push({
        row: csvRowNumber,
        field: 'email',
        message: 'Email is missing.',
        type: 'data',
      });
    } else if (typeof emailValue === 'string' && !EMAIL_REGEX.test(emailValue.trim())) {
      errors.push({
        row: csvRowNumber,
        field: 'email',
        message: `Invalid email format: "${emailValue}".`,
        type: 'email_format',
      });
    } else {
      emailIsValid = true;
    }

    // Handle first_name
    const firstName = row.first_name;
    if (firstName === null || firstName === undefined || String(firstName).trim() === '') {
      if (emailIsValid && typeof emailValue === 'string') {
        const emailParts = emailValue.split('@')[0];
        const nameParts = emailParts.split(/[._-]/); // Split by common separators
        if (nameParts.length > 0 && nameParts[0]) {
          row.first_name = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
        } else {
          row.first_name = 'Contact'; // Fallback
        }
      } else {
        row.first_name = 'Contact'; // Fallback if email is not valid for derivation
        // Only add an error if email was also missing/invalid, otherwise we've provided a fallback.
        if (!emailIsValid) {
            errors.push({ row: csvRowNumber, field: 'first_name', message: 'First name is missing and cannot be derived (invalid email).', type: 'data' });
        }
      }
    }

    // Handle last_name
    const lastName = row.last_name;
    if (lastName === null || lastName === undefined || String(lastName).trim() === '') {
      if (emailIsValid && typeof emailValue === 'string') {
        const emailParts = emailValue.split('@')[0];
        const nameParts = emailParts.split(/[._-]/);
        if (nameParts.length > 1 && nameParts[1]) {
          row.last_name = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);
        } else if (nameParts.length === 1 && nameParts[0].length > String(row.first_name || '').length) {
          // If only one part in email name, and it's longer than the derived first name, assume the rest is last name
          // This is a heuristic, e.g. "johnsmith@..." first_name="John", last_name="Smith"
          const potentialLastName = nameParts[0].slice(String(row.first_name || '').length);
          if (potentialLastName) {
            row.last_name = potentialLastName.charAt(0).toUpperCase() + potentialLastName.slice(1);
          } else {
            row.last_name = '(Imported)'; // Fallback
          }
        } else {
          row.last_name = '(Imported)'; // Fallback
        }
      } else {
        row.last_name = '(Imported)'; // Fallback if email is not valid for derivation
         // Only add an error if email was also missing/invalid.
        if (!emailIsValid) {
            errors.push({ row: csvRowNumber, field: 'last_name', message: 'Last name is missing and cannot be derived (invalid email).', type: 'data' });
        }
      }
    }

    // Validate website if present
    const websiteValue = row.website;
    if (websiteValue !== null && websiteValue !== undefined && String(websiteValue).trim() !== '') {
      if (typeof websiteValue !== 'string' || !URL_REGEX.test(String(websiteValue).trim())) {
        errors.push({ row: csvRowNumber, field: 'website', message: `Invalid URL format for website: "${websiteValue}".`, type: 'data' });
      }
    }

    // After all transformations and validations for the row
    validatedData.push(row as unknown as ValidatedContactData); // Cast to ValidatedContactData after processing
  });

  return { validatedData, errors };
}
