import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Template } from '../types';

interface TestEmailProps {
  credentials: { email: string; password: string };
  template: Template | null;
  isSending: boolean;
  setIsSending: (isSending: boolean) => void;
}

const TestEmail: React.FC<TestEmailProps> = ({ 
  credentials, 
  template,
  isSending,
  setIsSending
}) => {
  const [testEmail, setTestEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!testEmail) {
      setError('Please enter a test email address');
      return false;
    }
    
    if (!template) {
      setError('Please select a template first');
      return false;
    }
    
    if (!template.subject || !template.body) {
      setError('The selected template is empty');
      return false;
    }
    
    if (!credentials.email || !credentials.password) {
      setError('Please enter your email credentials');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSendTest = async () => {
    if (!validateForm()) return;
    
    setIsSending(true);
    const loadingToast = toast.loading('Sending test email...');
    
    try {
      // Replace with your actual backend endpoint
      await axios.post('http://localhost:3001/api/send-test', {
        credentials,
        template,
        testEmail
      });
      
      toast.success('Test email sent successfully!');
      setError(null);
    } catch (error) {
      console.error('Error sending test email:', error);
      setError('Failed to send test email. Please check your credentials and try again.');
      toast.error('Failed to send test email');
    } finally {
      toast.dismiss(loadingToast);
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Send a test email to verify your template and credentials before sending in bulk.
      </p>
      
      <div>
        <label htmlFor="test-email" className="block text-sm font-medium text-gray-700">
          Test Email Address
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="email"
            name="test-email"
            id="test-email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="test@example.com"
            disabled={isSending}
          />
          <button
            type="button"
            onClick={handleSendTest}
            disabled={isSending || !testEmail}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} className="mr-2" />
            {isSending ? 'Sending...' : 'Send Test'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle size={16} className="mr-1" />
          {error}
        </div>
      )}
      
      <div className="text-sm">
        <h3 className="font-medium text-gray-900">Selected Template Preview:</h3>
        {template ? (
          <div className="mt-2 border rounded-md p-3 bg-gray-50">
            {template.subject ? (
              <p className="font-medium">Subject: {template.subject}</p>
            ) : (
              <p className="italic text-gray-500">No subject</p>
            )}
            {template.body ? (
              <div className="mt-2 prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: template.body }} />
              </div>
            ) : (
              <p className="italic text-gray-500 mt-2">No body content</p>
            )}
          </div>
        ) : (
          <p className="italic text-gray-500 mt-2">No template selected</p>
        )}
      </div>
    </div>
  );
};

export default TestEmail;