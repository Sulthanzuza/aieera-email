import React, { useState } from 'react';
import { SendHorizonal, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Template } from '../types';

interface BulkSendProps {
  credentials: { email: string; password: string };
  template: Template | null;
  fileUploaded: boolean;
  isSending: boolean;
  setIsSending: (isSending: boolean) => void;
}

const BulkSend: React.FC<BulkSendProps> = ({
  credentials,
  template,
  fileUploaded,
  isSending,
  setIsSending
}) => {
  const [error, setError] = useState<string | null>(null);
  const [sendingProgress, setSendingProgress] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    inProgress: false
  });

  const validateForm = () => {
    if (!fileUploaded) {
      setError('Please upload an Excel file first');
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

  const handleSendBulk = async () => {
    if (!validateForm()) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to send emails to all recipients in the uploaded Excel file?'
    );
    
    if (!confirmed) return;
    
    setIsSending(true);
    setSendingProgress({
      total: 0,
      sent: 0,
      failed: 0,
      inProgress: true
    });
    
    const loadingToast = toast.loading('Sending bulk emails...');
    
    try {
      // Replace with your actual backend endpoint
      const response = await axios.post('https://aieera-email.onrender.com/api/send-bulk', {
        credentials,
        template
      });
      
      setSendingProgress({
        total: response.data.total,
        sent: response.data.sent,
        failed: response.data.failed,
        inProgress: false
      });
      
      if (response.data.sent === response.data.total) {
        toast.success(`Successfully sent ${response.data.sent} emails!`);
      } else {
        toast.success(`Sent ${response.data.sent} emails, ${response.data.failed} failed`);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      setError('Failed to send bulk emails. Please check your credentials and try again.');
      toast.error('Failed to send bulk emails');
      setSendingProgress({
        ...sendingProgress,
        inProgress: false
      });
    } finally {
      toast.dismiss(loadingToast);
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Send emails to all recipients in the uploaded Excel file using the selected template.
      </p>
      
      <div>
        <button
          type="button"
          onClick={handleSendBulk}
          disabled={isSending || !fileUploaded || !template}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <SendHorizonal size={16} className="mr-2" />
              Send to All Recipients
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle size={16} className="mr-1" />
          {error}
        </div>
      )}
      
      {(sendingProgress.inProgress || sendingProgress.total > 0) && (
        <div className="border rounded-md p-4">
          <h3 className="font-medium text-gray-900 mb-2">Sending Progress</h3>
          
          {sendingProgress.inProgress ? (
            <div className="flex items-center text-sm text-blue-600">
              <Loader2 size={16} className="mr-2 animate-spin" />
              Sending emails...
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total recipients:</span>
                <span className="font-medium">{sendingProgress.total}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Successfully sent:</span>
                <span className="flex items-center text-green-600 font-medium">
                  <CheckCircle size={16} className="mr-1" />
                  {sendingProgress.sent}
                </span>
              </div>
              
              {sendingProgress.failed > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Failed:</span>
                  <span className="flex items-center text-red-600 font-medium">
                    <XCircle size={16} className="mr-1" />
                    {sendingProgress.failed}
                  </span>
                </div>
              )}
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(sendingProgress.sent / sendingProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkSend;