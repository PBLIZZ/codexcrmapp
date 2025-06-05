'use client';

import type { AppRouter } from '@codexcrm/server/src/root'; // Corrected tRPC client import path
import type { TRPCClientErrorLike } from '@trpc/client';
import type { TRPCClientError } from '@trpc/client';
import type { ParseError as PapaParseError } from 'papaparse';
import React, { useState } from 'react';
import type { FileWithPath } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { CsvUpload } from '@/components/ui/csv-upload';
import {
  parseCsvFile,
  validateCsvData,
  CsvValidationError,
  ValidatedContactData,
} from '@/lib/csv-utils'; // Removed ParsedCsvRow, Added ValidatedContactData
import { api } from '@/lib/trpc/client';

// Define the expected response structure from the importCsvData mutation (matching backend's importCsvDataOutputSchema)
interface ContactImportResult {
  originalIndex: number;
  email?: string | null;
  status: 'imported' | 'skipped' | 'error';
  message: string;
  contactData?: ValidatedContactData;
  errorDetails?: string;
}

interface ImportCsvDataResponse {
  overallStatus: string;
  successCount: number;
  skippedCount: number;
  errorCount: number;
  results: ContactImportResult[];
}

export default function CsvUploadTestPage() {
  const [uploadedFile, setUploadedFile] = useState<FileWithPath | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [parsedData, setParsedData] = useState<ValidatedContactData[] | null>(
    null
  );
  const [parsingErrors, setParsingErrors] = useState<Array<{
    message: string;
    code?: string;
    type?: string;
    row?: number;
  }> | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [csvValidationErrors, setCsvValidationErrors] = useState<
    CsvValidationError[] | null
  >(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importFeedback, setImportFeedback] = useState<string>('');
  const [importResult, setImportResult] = useState<
    ImportCsvDataResponse | { error: string } | null
  >(null); // To store backend response

  const handleFilesAccepted = async (files: FileWithPath[]) => {
    console.log('Files received in parent component:', files);
    setUploadedFile(null);
    setParsedData(null);
    setParsingErrors(null);
    setRowCount(null);
    setFeedbackMessage('');
    setCsvValidationErrors(null);
    setImportResult(null); // Reset import result on new file
    setImportFeedback(''); // Reset import feedback

    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setFeedbackMessage(`Processing "${file.name}"...`);
      try {
        const parsedResult = await parseCsvFile(file);
        console.log('Parsed CSV Result:', parsedResult);

        setParsingErrors(
          parsedResult.errors.length > 0
            ? parsedResult.errors.map((e) => ({ ...e, row: e.row ?? -1 }))
            : null
        ); // Ensure row is always number
        setRowCount(parsedResult.data.length);

        const validationResult = validateCsvData(parsedResult);
        setParsedData(validationResult.validatedData);
        setCsvValidationErrors(
          validationResult.errors.length > 0 ? validationResult.errors : null
        );

        let currentFeedback = `Successfully processed "${file.name}". Found ${parsedResult.data.length} data rows.`;
        if (parsedResult.errors.length > 0) {
          currentFeedback += ` Encountered ${parsedResult.errors.length} parsing error(s).`;
        }
        if (validationResult.errors.length > 0) {
          currentFeedback += ` Found ${validationResult.errors.length} validation issue(s). Please check below.`;
        } else if (
          parsedResult.errors.length === 0 &&
          validationResult.validatedData.length > 0
        ) {
          // Only add "looks good" if there were no parsing errors AND some data was actually validated.
          currentFeedback += ` CSV structure and required fields look good!`;
        } else if (
          parsedResult.errors.length === 0 &&
          validationResult.validatedData.length === 0 &&
          parsedResult.data.length > 0
        ) {
          // All rows were filtered out by validation, but no explicit validation errors (e.g. all rows invalid format but not header issues)
          currentFeedback += ` All ${parsedResult.data.length} data rows were filtered out during validation. Please check data format.`;
        }

        setFeedbackMessage(currentFeedback);
      } catch (error) {
        console.error('Error processing CSV in parent component:', error);
        setFeedbackMessage(
          `Error processing "${file.name}": ${(error as Error).message}`
        );
        setParsingErrors([
          {
            message: (error as Error).message,
            row: 0,
            code: 'ProcessingError',
            type: 'General',
          },
        ]);
        setParsedData(null);
        setCsvValidationErrors(null);
      }
    } else {
      setFeedbackMessage('File selection cancelled or no file provided.');
    }
  };

  /*
  const importMutation = api.contacts.importCsvData.useMutation({
    onMutate: () => {
      setIsImporting(true);
      setImportFeedback('Importing contacts...');
      setImportResult(null);
    },
    onSuccess: (data: ImportCsvDataResponse) => {
      setImportFeedback(data.overallStatus || 'Import completed.');
      setImportResult(data);
      // Optionally clear parsedData or file after successful import
      // setParsedData(null);
      // setUploadedFile(null);
      // setCsvValidationErrors(null);
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      // Use TRPCClientErrorLike
      setImportFeedback(`Import failed: ${error.message}`);
      setImportResult({ error: error.message });
    },
    onSettled: () => {
      setIsImporting(false);
    },
  });
  */

  const handleImportContacts = () => {
    if (
      parsedData &&
      (!csvValidationErrors || csvValidationErrors.length === 0)
    ) {
      // The backend expects an object { contacts: ParsedCsvRow[] }
      // Ensure parsedData matches the structure expected by csvContactInput Zod schema on backend
      // Keys in ParsedCsvRow should align with csvContactInput fields (e.g. 'company', not 'company_name')
      const contactsWithOriginalIndex = parsedData.map((contact, index) => ({
        ...contact,
        originalIndex: index,
      }));
      // importMutation.mutate({
      //   contacts: validatedContacts,
      //   fieldMapping: fieldMapping as Record<string, keyof ValidatedContactData>,
      // });
      console.warn('CSV import functionality is currently disabled.');
      setImportFeedback('CSV import functionality is currently disabled.');
    } else {
      setImportFeedback(
        'Cannot import: No valid data or validation errors exist.'
      );
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">CSV Upload Component Test</h1>

      <div className="max-w-xl mx-auto">
        <p className="mb-4 text-muted-foreground">
          This page demonstrates the integration of the <code>CsvUpload</code>{' '}
          component. Try uploading a CSV file (max 10MB).
        </p>
        <CsvUpload onFilesAccepted={handleFilesAccepted} />
      </div>

      {feedbackMessage && (
        <div className="mt-6 p-4 border rounded-md bg-secondary/50">
          <h2 className="text-lg font-semibold mb-2">
            Parent Component Feedback:
          </h2>
          <p>{feedbackMessage}</p>
          {uploadedFile && (
            <div className="mt-2 text-sm space-y-1">
              <p>
                <strong>File Name:</strong> {uploadedFile.name}
              </p>
              <p>
                <strong>File Size:</strong>{' '}
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
              <p>
                <strong>File Type:</strong> {uploadedFile.type}
              </p>
            </div>
          )}
          {rowCount !== null && (
            <p className="mt-2 text-sm">
              <strong>Rows Parsed (excluding header):</strong> {rowCount}
            </p>
          )}
          {parsingErrors && parsingErrors.length > 0 && (
            <div className="mt-3">
              <h3 className="text-md font-semibold text-destructive mb-1">
                Parsing Errors:
              </h3>
              <ul className="list-disc list-inside text-sm text-destructive/90 bg-destructive/10 p-2 rounded-md">
                {parsingErrors.map((err, index) => (
                  <li key={index}>
                    Row {err.row !== undefined ? err.row + 1 : 'N/A'}:{' '}
                    {err.message} {err.code && `(${err.code})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {parsedData && parsedData.length > 0 && (
            <div className="mt-3">
              <h3 className="text-md font-semibold mb-1">
                Parsed Data Preview (first 5 rows):
              </h3>
              <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                {JSON.stringify(parsedData.slice(0, 5), null, 2)}
              </pre>
            </div>
          )}

          {/* Display CSV Validation Issues */}
          {csvValidationErrors && csvValidationErrors.length > 0 && (
            <div className="mt-3">
              <h3 className="text-md font-semibold text-yellow-700 mb-1">
                CSV Validation Issues:
              </h3>
              <ul className="list-disc list-inside text-sm text-yellow-700 bg-yellow-50 p-2 rounded-md">
                {csvValidationErrors.map((err, index) => (
                  <li key={`val-${index}`}>
                    {err.type === 'header'
                      ? `Header Error: ${err.message}`
                      : `Row ${err.row !== undefined ? err.row : 'N/A'}${err.field ? ` (Field: ${err.field})` : ''}: ${err.message}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Import Button and Feedback */}
          {parsedData &&
            parsedData.length > 0 &&
            (!csvValidationErrors || csvValidationErrors.length === 0) && (
              <div className="mt-6">
                <Button
                  onClick={handleImportContacts}
                  disabled={
                    isImporting ||
                    !parsedData ||
                    (!!csvValidationErrors && csvValidationErrors.length > 0)
                  }
                >
                  {isImporting ? 'Importing...' : 'Import Contacts'}
                </Button>
              </div>
            )}
          {importFeedback && (
            <div
              className={`mt-4 p-3 rounded-md ${importResult && 'error' in importResult ? 'bg-destructive/20 text-destructive' : 'bg-green-100 text-green-700'}`}
            >
              <p className="font-semibold">Import Status:</p>
              <p>{importFeedback}</p>
              {importResult && (
                <div className="mt-4 p-3 border rounded-md bg-muted/50">
                  <h3 className="text-md font-semibold mb-1">
                    Import Results:
                  </h3>
                  {'error' in importResult ? (
                    <p className="text-sm text-red-600">
                      Error Detail: {importResult.error}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm">
                        Successfully imported: {importResult.successCount}{' '}
                        contacts.
                      </p>
                      <p className="text-sm">
                        Skipped: {importResult.skippedCount} contacts.
                      </p>
                      <p className="text-sm">
                        Failed to import (errors): {importResult.errorCount}{' '}
                        contacts.
                      </p>
                      {importResult.results &&
                        importResult.results.length > 0 && (
                          <details className="mt-2 text-xs">
                            <summary>
                              Show detailed results (
                              {importResult.results.length} rows processed)
                            </summary>
                            <ul className="max-h-40 overflow-y-auto list-disc pl-5 mt-1 space-y-1">
                              {importResult.results.map((item) => (
                                <li
                                  key={item.originalIndex}
                                  className={
                                    item.status === 'imported'
                                      ? 'text-green-700'
                                      : item.status === 'skipped'
                                        ? 'text-yellow-700'
                                        : item.status === 'error'
                                          ? 'text-red-700'
                                          : ''
                                  }
                                >
                                  Row {item.originalIndex + 1}:{' '}
                                  {item.status.toUpperCase()} - {item.message}
                                  {item.email && ` (Email: ${item.email})`}
                                  {item.errorDetails && (
                                    <span className="block text-red-500">
                                      Error: {item.errorDetails}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      {/* TODO: Display detailed errors per row if backend provides them */}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
