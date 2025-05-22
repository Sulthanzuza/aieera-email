import React, { useState } from 'react';
import UserCredentials from '../components/UserCredentials';
import TemplateManager from '../components/TemplateManager';
import FileUpload from '../components/FileUpload';
import TestEmail from '../components/TestEmail';
import BulkSend from '../components/BulkSend';
import { Template } from '../types';

const Dashboard: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleCredentialsChange = (newCredentials: { email: string; password: string }) => {
    setCredentials(newCredentials);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleFileUpload = (success: boolean) => {
    setFileUploaded(success);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">User Credentials</h2>
        <UserCredentials onChange={handleCredentialsChange} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Email Templates</h2>
        <TemplateManager onSelect={handleTemplateSelect} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Upload Recipients</h2>
        <FileUpload onUpload={handleFileUpload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Send Test Email</h2>
          <TestEmail 
            credentials={credentials}
            template={selectedTemplate}
            isSending={isSending}
            setIsSending={setIsSending}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Send Bulk Emails</h2>
          <BulkSend 
            credentials={credentials}
            template={selectedTemplate}
            fileUploaded={fileUploaded}
            isSending={isSending}
            setIsSending={setIsSending}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;