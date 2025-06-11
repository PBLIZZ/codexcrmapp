'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/trpc';

export default function ImportContactsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
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
    if (!['csv', 'xlsx', 'xls'].includes(fileType || '')) {
      setUploadError('Please upload a CSV or Excel file');
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Here you would implement the actual file upload and processing
      // For now, we'll just simulate a successful upload after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadSuccess(true);
      setFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      setUploadError('An error occurred while uploading the file. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/contacts" className="flex items-center text-teal-600 hover:text-teal-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Import Contacts</h1>
        <p className="text-gray-600 mt-2">
          Upload a CSV or Excel file to import contacts into your database.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload File</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      CSV, Excel files up to 10MB
                    </span>
                  </Label>
                </div>
                
                {file && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <FileSpreadsheet className="h-5 w-5 text-teal-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                )}
                
                {uploadSuccess && (
                  <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md">
                    <Check className="h-5 w-5 mr-2" />
                    <span>File uploaded successfully! Your contacts are being processed.</span>
                  </div>
                )}
                
                {uploadError && (
                  <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-md">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{uploadError}</span>
                  </div>
                )}
                
                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="w-full"
                >
                  {isUploading ? 'Uploading...' : 'Upload and Process'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Import Tips</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-teal-600 font-bold mr-2">•</span>
              <span>Make sure your CSV has headers for each column</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 font-bold mr-2">•</span>
              <span>Required fields: Name or First Name/Last Name</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 font-bold mr-2">•</span>
              <span>Recommended fields: Email, Phone, Company, Job Title</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 font-bold mr-2">•</span>
              <span>Maximum file size: 10MB</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 font-bold mr-2">•</span>
              <span>Supported formats: CSV, Excel (.xlsx, .xls)</span>
            </li>
          </ul>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Need a template?</h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                // Create CSV content with headers
                const headers = [
                  "First Name",
                  "Last Name",
                  "Email",
                  "Phone",
                  "Company",
                  "Job Title",
                  "Notes",
                  "Source"
                ];
                
                // Create CSV content
                const csvContent = headers.join(",") + "\n";
                
                // Create a Blob with the CSV content
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                
                // Create a download link
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                
                // Set link properties
                link.setAttribute("href", url);
                link.setAttribute("download", "contacts_import_template.csv");
                
                // Append to body, click and remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download Template
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}