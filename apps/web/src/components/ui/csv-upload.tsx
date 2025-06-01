'use client';

import { UploadCloud, AlertTriangle, Loader2 } from 'lucide-react'; // Added AlertTriangle for errors and Loader2 for processing
import React, { useCallback, useState } from 'react';
import { useDropzone, FileWithPath, FileRejection } from 'react-dropzone';

const TEN_MB_IN_BYTES = 10 * 1024 * 1024;

interface CsvUploadProps {
  onFilesAccepted: (files: FileWithPath[]) => void;
  maxSize?: number; // Optional prop for max file size in bytes
}

export function CsvUpload({ onFilesAccepted, maxSize = TEN_MB_IN_BYTES }: CsvUploadProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedUploadFiles: FileWithPath[], fileRejections: FileRejection[]) => {
    setIsHovering(false);
    setRejectionError(null); // Clear previous errors
    setIsProcessing(false); // Reset processing state

    if (fileRejections.length > 0) {
      const firstRejection = fileRejections[0];
      if (firstRejection.errors.some(err => err.code === 'file-too-large')) {
        setRejectionError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
      } else if (firstRejection.errors.some(err => err.code === 'file-invalid-type')) {
        setRejectionError('Invalid file type. Only .csv files are accepted.');
      } else {
        setRejectionError('File rejected. Please try another file.');
      }
      // Clear accepted files if there were rejections, as we only allow one file
      // and react-dropzone might still populate acceptedFiles if one file is good and another is bad (if multiple=true)
      // Though with multiple=false, this is more of a safeguard.
      onFilesAccepted([]);
      setIsProcessing(false);
      return;
    }

    if (acceptedUploadFiles.length > 0) {
      console.log('Accepted files in CsvUpload:', acceptedUploadFiles);
      setIsProcessing(true);
      // Simulate processing delay
      setTimeout(() => {
        onFilesAccepted(acceptedUploadFiles);
        setIsProcessing(false);
      }, 1500); // Simulate 1.5 seconds processing time
    } else {
      // Handle cases where no files are accepted and no rejections (e.g., user cancels dialog)
      onFilesAccepted([]);
      setIsProcessing(false);
    }
  }, [onFilesAccepted, maxSize]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
    maxSize, // Use the maxSize prop
    onDragEnter: () => { setIsHovering(true); setRejectionError(null); }, // Clear error on new drag
    onDragLeave: () => setIsHovering(false),
    onDropAccepted: () => setIsHovering(false), // Handled in onDrop
    // onDropRejected is not strictly needed as onDrop receives fileRejections
  });

  const selectedFile = acceptedFiles.length > 0 && !rejectionError && !isProcessing ? acceptedFiles[0] : null;
  const isError = !!rejectionError;

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200 ease-in-out
        ${isError ? 'border-destructive bg-destructive/10' : 
          (isDragActive || isHovering ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70')}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        {isError ? (
          <AlertTriangle className="w-12 h-12 mb-2 text-destructive" />
        ) : isProcessing ? (
          <Loader2 className="w-12 h-12 mb-2 text-primary animate-spin" />
        ) : (
          <UploadCloud className={`w-12 h-12 mb-2 ${isDragActive || isHovering ? 'text-primary' : 'text-muted-foreground'}`} />
        )}
        
        {isError ? (
          <p className="text-destructive font-semibold">{rejectionError}</p>
        ) : isProcessing ? (
          <p className="text-lg font-semibold text-primary">Processing file...</p>
        ) : isDragActive ? (
          <p className="text-lg font-semibold text-primary">Drop the CSV file here ...</p>
        ) : (
          <p className="text-muted-foreground">
            Drag 'n' drop a CSV file here, or click to select file
          </p>
        )}

        {selectedFile && !isDragActive && !isError && !isProcessing && (
          <div className="mt-3 text-sm text-muted-foreground">
            Selected file: {selectedFile.name}
          </div>
        )}
        {!isError && !isProcessing && (
           <p className="text-xs text-muted-foreground mt-2">
             Maximum file size: {maxSize / (1024 * 1024)}MB. Accepted format: .csv
           </p>
        )}
      </div>
    </div>
  );
}
