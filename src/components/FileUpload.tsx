import React, { useState } from 'react';
import { Upload, Check, X, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUpload: (success: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Check if file is Excel
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.spreadsheet'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      setUploadError('Please upload a valid Excel file (.xlsx, .xls)');
      return;
    }
    
    setFile(selectedFile);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Replace with your actual backend endpoint
      await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploadSuccess(true);
      onUpload(true);
      toast.success('Excel file uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file. Please try again.');
      onUpload(false);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadSuccess(false);
    setUploadError(null);
    onUpload(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Upload an Excel file (.xlsx, .xls) containing email addresses. The first column with email addresses will be used.
      </p>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${uploadSuccess ? 'bg-green-50 border-green-300' : ''} ${uploadError ? 'bg-red-50 border-red-300' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900">
                Drag and drop your Excel file here, or{' '}
                <label className="relative cursor-pointer text-blue-600 hover:text-blue-500">
                  <span>browse</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".xlsx,.xls,.ods"
                    onChange={handleFileChange}
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Excel files only (.xlsx, .xls)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileSpreadsheet className="h-10 w-10 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {uploadSuccess ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check size={14} className="mr-1" />
                  Uploaded
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {uploadError && (
        <p className="text-sm text-red-600 mt-2 flex items-center">
          <X size={16} className="mr-1" />
          {uploadError}
        </p>
      )}
    </div>
  );
};

export default FileUpload;