import { parseCsvFile, validateCsvData, type ValidatedContactData, type ParsedCsvRow } from './csv-utils';

export interface CsvImportResult {
  success: boolean;
  data?: ValidatedContactData[];
  errors?: string[];
  totalRows?: number;
  validRows?: number;
}

export interface CsvColumnMapping {
  // Current exact mapping - will be extended later for flexible mapping
  'Full Name': 'full_name';
  'Phone': 'phone';
  'Phone Country Code': 'phone_country_code';
  'Email': 'email';
  'Social Handles': 'social_handles';
  'Notes': 'notes';
  'Tags': 'tags';
  'Address Street': 'address_street';
  'Address City': 'address_city';
  'Address State': 'address_state';
  'Address Postal Code': 'address_postal_code';
  'Address Country': 'address_country';
  'Company Name': 'company_name';
  'Website': 'website';
  'Job Title': 'job_title';
}

// Expected CSV headers that match our template
const EXPECTED_HEADERS = [
  'Full Name',
  'Phone', 
  'Phone Country Code',
  'Email',
  'Social Handles',
  'Notes',
  'Tags',
  'Address Street',
  'Address City', 
  'Address State',
  'Address Postal Code',
  'Address Country',
  'Company Name',
  'Website',
  'Job Title'
] as const;

/**
 * Maps CSV row data from template format to database format
 */
function mapCsvRowToContact(row: ParsedCsvRow): ParsedCsvRow {
  const mappedRow: ParsedCsvRow = {};
  
  // Map template headers to database fields
  if (row['Full Name']) {mappedRow['full_name'] = row['Full Name'];}
  if (row['Phone']) {mappedRow['phone'] = row['Phone'];}
  if (row['Phone Country Code']) {mappedRow['phone_country_code'] = row['Phone Country Code'];}
  if (row['Email']) {mappedRow['email'] = row['Email'];}
  if (row['Company Name']) {mappedRow['company'] = row['Company Name'];} // Note: maps to 'company' not 'company_name'
  if (row['Job Title']) {mappedRow['job_title'] = row['Job Title'];}
  if (row['Website']) {mappedRow['website'] = row['Website'];}
  if (row['Notes']) {mappedRow['notes'] = row['Notes'];}
  
  // Handle arrays - split by semicolon instead of comma to avoid CSV conflicts
  if (row['Social Handles'] && typeof row['Social Handles'] === 'string') {
    mappedRow['social_handles'] = row['Social Handles']
      .split(';')
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);
  }
  
  if (row['Tags'] && typeof row['Tags'] === 'string') {
    mappedRow['tags'] = row['Tags']
      .split(';')
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);
  }
  
  // Combine address fields if present
  const addressParts = [
    row['Address Street'],
    row['Address City'],
    row['Address State'],
    row['Address Postal Code'],
    row['Address Country']
  ].filter(Boolean);
  
  if (addressParts.length > 0) {
    mappedRow['address'] = addressParts.join(', ');
  }
  
  return mappedRow;
}

/**
 * Processes a CSV file for contact import
 */
export async function processCsvImport(file: File): Promise<CsvImportResult> {
  try {
    // Parse the CSV file
    const parseResult = await parseCsvFile(file);
    
    if (parseResult.errors.length > 0) {
      return {
        success: false,
        errors: parseResult.errors.map(err => err.message)
      };
    }
    
    // Map CSV rows to our database format
    const mappedData = parseResult.data.map(mapCsvRowToContact);
    
    // Create a fake parse result with mapped data for validation
    const mappedParseResult = {
      ...parseResult,
      data: mappedData
    };
    
    // Validate the mapped data
    const { validatedData, errors } = validateCsvData(mappedParseResult);
    
    if (errors.length > 0) {
      return {
        success: false,
        errors: errors.map(err => 
          err.row ? `Row ${err.row}: ${err.message}` : err.message
        ),
        totalRows: parseResult.data.length,
        validRows: 0
      };
    }
    
    return {
      success: true,
      data: validatedData,
      totalRows: parseResult.data.length,
      validRows: validatedData.length
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process CSV file. Please check the format and try again.';
    return {
      success: false,
      errors: [errorMessage]
    };
  }
}

/**
 * Validates CSV headers match expected format
 */
export function validateCsvHeaders(headers: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for required headers
  const requiredHeaders = ['Full Name', 'Email'];
  for (const required of requiredHeaders) {
    if (!headers.includes(required)) {
      errors.push(`Missing required column: ${required}`);
    }
  }
  
  // Check for unexpected headers (optional - can be removed for flexibility)
  const validHeaders = new Set(EXPECTED_HEADERS);
  const unexpectedHeaders = headers.filter(h => !validHeaders.has(h as typeof EXPECTED_HEADERS[number]));
  if (unexpectedHeaders.length > 0) {
    errors.push(`Unexpected columns: ${unexpectedHeaders.join(', ')}. Please use the provided template.`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}