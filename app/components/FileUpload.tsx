'use client';

import { useState, useRef } from 'react';
import { parseFileToRows } from '../utils/fileParser';

interface FileUploadProps {
  onParsedData: (rows: string[]) => void;
}

export default function FileUpload({ onParsedData }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };
  
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };
  
  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const rows = await parseFileToRows(file);
      onParsedData(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    // Only set isDragging to false if we're leaving the container (not entering a child element)
    const container = event.currentTarget;
    const relatedTarget = event.relatedTarget as Node;
    
    if (!relatedTarget || !container.contains(relatedTarget)) {
      setIsDragging(false);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="mb-6">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-300 bg-gray-800
          ${isDragging ? 'border-cyan-400 bg-gray-700/70' : 'border-gray-600 hover:border-cyan-400/50'}
          ${isLoading ? 'opacity-70 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        
        <div className="flex flex-col items-center justify-center">
          <svg 
            className={`w-12 h-12 mb-3 ${isDragging ? 'text-cyan-400' : 'text-gray-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          {isLoading ? (
            <div className="text-gray-300 font-medium">
              <svg className="animate-spin h-5 w-5 text-white inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing file...
            </div>
          ) : (
            <>
              <p className="mb-2 text-lg font-medium text-gray-200">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-400">
                CSV, Excel files supported
              </p>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-3 text-red-400 text-sm bg-red-400/10 p-3 rounded border border-red-400/20">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
} 