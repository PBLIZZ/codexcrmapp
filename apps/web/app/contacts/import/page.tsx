'use client';

import { useState } from 'react';
import { processCsvImport } from '@/lib/csv-import-service';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/trpc';
import { ArrowLeft, Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ImportContactsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // tRPC mutation for importing contacts
  const importContactsMutation = api.import.contacts.useMutation();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setUploadSuccess(false);
    setUploadError(null);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }

    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'csv') {
      setUploadError('Please upload a CSV file');
      return;
    }

    // Check file size (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      setUploadError('File size must be less than 1MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setValidationErrors([]);

    try {
      // Process CSV file
      const result = await processCsvImport(file);

      if (!result.success) {
        if (result.errors) {
          setValidationErrors(result.errors);
        }
        return;
      }

      // Import the validated data using tRPC
      try {
        if (!result.data) {
          throw new Error('No data to import');
        }
        const importResult = await importContactsMutation.mutateAsync(result.data);
        
        if (importResult.success) {
          toast.success(`Successfully imported ${importResult.imported} contacts!`, {
            duration: 4000,
          });
          
          setUploadSuccess(true);
          setFile(null);

          // Reset the file input
          const fileInput = document.getElementById('file-upload') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }

          // Redirect to contacts page after a short delay
          setTimeout(() => {
            router.push('/contacts');
          }, 1500);
        } else {
          setValidationErrors(importResult.errors);
          toast.error('Import failed. Please check the errors below.', {
            duration: 4000,
          });
        }
      } catch (importError) {
        const errorMessage = importError instanceof Error 
          ? importError.message 
          : 'Failed to import contacts to database';
        setUploadError(errorMessage);
        toast.error('Import failed', { duration: 4000 });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while processing the file. Please try again.';
      setUploadError(errorMessage);
      toast.error('Failed to process CSV file', {
        duration: 4000, // Show for 4 seconds
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='container mx-auto p-6 max-w-7xl'>
      <div className='mb-6'>
        <Link href='/contacts' className='flex items-center text-teal-600 hover:text-teal-800'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Contacts
        </Link>
      </div>

      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-teal-500'>Import Contacts</h1>
        <p className='text-gray-600 mt-2'>Upload a CSV file to import your contacts.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        <Card className='p-8 col-span-1 md:col-span-1 lg:col-span-1 bg-gradient-to-br from-teal-50 to-white border-teal-100'>
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold text-teal-500 mb-4'>Upload File</h2>

              <div className='space-y-4'>
                <div className='border-2 border-dashed border-teal-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors'>
                  <Input
                    id='file-upload'
                    type='file'
                    accept='.csv'
                    onChange={handleFileChange}
                    className='hidden'
                  />
                  <Label
                    htmlFor='file-upload'
                    className='flex flex-col items-center justify-center cursor-pointer'
                  >
                    <Upload className='h-12 w-12 text-gray-400 mb-2' />
                    <span className='text-sm font-medium text-gray-700'>
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </span>
                    <span className='text-xs text-teal-600 mt-1'>CSV files up to 1MB</span>
                  </Label>
                </div>

                {file && (
                  <div className='flex items-center p-3 bg-gray-50 rounded-md'>
                    <FileSpreadsheet className='h-5 w-5 text-teal-600 mr-2' />
                    <span className='text-sm font-medium text-gray-700 flex-1 truncate'>
                      {file.name}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                )}

                {uploadSuccess && (
                  <div className='flex items-center p-3 bg-green-50 text-green-700 rounded-md'>
                    <Check className='h-5 w-5 mr-2' />
                    <span>File uploaded successfully! Your contacts are being processed.</span>
                  </div>
                )}

                {uploadError && (
                  <div className='flex items-center p-3 bg-red-50 text-red-700 rounded-md'>
                    <AlertCircle className='h-5 w-5 mr-2' />
                    <span>{uploadError}</span>
                  </div>
                )}

                {validationErrors.length > 0 && (
                  <div className='p-4 bg-red-50 text-red-700 rounded-md'>
                    <div className='flex items-center mb-2'>
                      <AlertCircle className='h-5 w-5 mr-2' />
                      <span className='font-medium'>Validation Errors:</span>
                    </div>
                    <ul className='text-sm space-y-1 max-h-40 overflow-y-auto'>
                      {validationErrors.map((error, index) => (
                        <li key={index} className='ml-4'>
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  onClick={() => {
                    void handleUpload();
                  }}
                  disabled={!file || isUploading}
                  className='w-full'
                >
                  {' '}
                  {/* Prepend with void */}
                  {isUploading ? 'Uploading...' : 'Upload and Process'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className='p-8 col-span-3 bg-gradient-to-br from-teal-50 to-white border-teal-100'>
          <h2 className='text-xl font-semibold text-teal-500 mb-4'>Import Tips</h2>
          <ul className='space-y-3 text-sm text-gray-600'>
            <li className='flex items-start'>
              <span className='text-gray-600 font-bold mr-2'>•</span>
              <span>Make sure your CSV has headers for each column</span>
            </li>
            <li className='flex items-start'>
              <span className='text-red-600 font-bold mr-2'>⚠️</span>
              <span className='text-red-700 font-medium'>
                IMPORTANT: Remove all commas from your data before uploading! Commas are used to separate columns in CSV files. 
                Replace any commas in names, addresses, or notes with semicolons (;) or spaces to avoid breaking the CSV structure.
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-gray-600 font-bold mr-2'>•</span>
              <span>
                Required fields: Full Name. If your contact list uses First Name and Last Name, you
                need to combine them into a Full Name using CONCATENATE or CONCATENATE function in
                your spreadsheet software.
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-gray-600 font-bold mr-2'>•</span>
              <span>
                Recommended fields: Email, Phone, Social Handles, Notes (if you have notes on your
                clients for e.g. session history or treatment notes, you can upload them within this
                csv and they will be available on your new contact card for each contact), You need
                at least one contact method (email, phone, social handles - if you know the profile
                name of the contact on socials you can add it in the social handles column, if there
                are more than one use semicolons (;) to separate them - do not use commas as they
                will break the CSV format)
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-gray-600 font-bold mr-2'>•</span>
              <span>Maximum file size: 1024KB</span>
            </li>
            <li className='flex items-start'>
              <span className='text-gray-600 font-bold mr-2'>•</span>
              <span>
                For multiple values in Social Handles or Tags columns, separate them with semicolons
                (;) not commas
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-gray-600 font-bold mr-2'>•</span>
              <span>Supported formats: CSV</span>
            </li>
          </ul>

          <div className='mt-6 pt-6 border-t border-teal-300'>
            <h3 className='font-medium text-teal-500 mb-2'>Need a template?</h3>
            <Button
              variant='outline'
              size='sm'
              className='text-white bg-teal-800 border-teal-900 hover:text-amber-100 hover:border-amber-100'
              onClick={() => {
                // Create CSV content with headers
                const headers = [
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
                  'Job Title',
                ];

                // Create CSV content
                const csvContent = headers.join(',') + '\n';

                // Create a Blob with the CSV content
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

                // Create a download link
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);

                // Set link properties
                link.setAttribute('href', url);
                link.setAttribute('download', 'contacts_import_template.csv');

                // Append to body, click and remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className='h-4 w-4 mr-2' />
              Download Template
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
