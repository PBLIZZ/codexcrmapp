import Papa from 'papaparse';

/**
 * CSV parsing utilities for contact data
 */

interface ContactRow {
  [key: string]: string | undefined;
}

/**
 * Parse CSV file and return structured contact data
 */
export function parseContactCSV(file: File): Promise<ContactRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
        } else {
          resolve(results.data as ContactRow[]);
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
}

/**
 * Validate CSV data structure for contact import
 */
export function validateContactData(data: ContactRow[]): {
  isValid: boolean;
  errors: string[];
  validRows: ContactRow[];
} {
  const errors: string[] = [];
  const validRows: ContactRow[] = [];

  // Check if data is empty
  if (!data || data.length === 0) {
    errors.push('CSV file is empty or contains no valid data');
    return { isValid: false, errors, validRows };
  }

  // Required fields for contact import
  const requiredFields = ['name', 'email'];

  // Check if required columns exist
  const firstRow = data[0];
  const availableColumns = Object.keys(firstRow || {});

  const missingColumns = requiredFields.filter(
    (field) => !availableColumns.some((col) => col.toLowerCase().includes(field.toLowerCase()))
  );

  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  // Validate each row
  data.forEach((row, index) => {
    const rowErrors: string[] = [];

    // Check for email if present
    if (row.email && !isValidEmail(row.email)) {
      rowErrors.push(`Invalid email format: ${row.email}`);
    }

    // Check for name
    if (!row.name || row.name.trim() === '') {
      rowErrors.push('Name is required');
    }

    if (rowErrors.length > 0) {
      errors.push(`Row ${index + 1}: ${rowErrors.join(', ')}`);
    } else {
      validRows.push(row);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validRows,
  };
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a sample CSV template for contact import
 */
export function generateSampleCSV(): string {
  const headers = ['name', 'email', 'phone', 'company', 'notes'];
  const sampleData = [
    ['John Doe', 'john@example.com', '+1-555-0123', 'Acme Corp', 'Potential client'],
    ['Jane Smith', 'jane@example.com', '+1-555-0456', 'Tech Solutions', 'Follow up needed'],
    [
      'Bob Johnson',
      'bob@example.com',
      '+1-555-0789',
      'Design Studio',
      'Interested in premium plan',
    ],
  ];

  return Papa.unparse({
    fields: headers,
    data: sampleData,
  });
}
