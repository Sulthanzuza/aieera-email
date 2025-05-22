import { Request, Response } from 'express';
import { SendTestEmailRequest, SendBulkEmailRequest } from '../types';
import { createTransporter, sendEmail } from '../utils/email';
import { extractEmailsFromExcel } from '../utils/excel';

let extractedEmails: string[] = [];
let currentExcelFile = '';

export const uploadExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    currentExcelFile = req.file.path;
    extractedEmails = extractEmailsFromExcel(currentExcelFile);
    
    res.json({
      success: true,
      emailCount: extractedEmails.length
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ 
      error: 'Failed to process the Excel file',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const sendTestEmail = async (req: Request, res: Response) => {
  try {
    const { credentials, template, testEmail } = req.body as SendTestEmailRequest;
    
    if (!credentials || !template || !testEmail) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const transporter = createTransporter(credentials);
    await sendEmail(transporter, credentials.email, testEmail, template);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const sendBulkEmails = async (req: Request, res: Response) => {
  try {
    const { credentials, template } = req.body as SendBulkEmailRequest;
    
    if (!credentials || !template || extractedEmails.length === 0) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const transporter = createTransporter(credentials);
    const total = extractedEmails.length;
    let sent = 0;
    let failed = 0;
    
    for (const email of extractedEmails) {
      try {
        await sendEmail(transporter, credentials.email, email, template);
        sent++;
      } catch (error) {
        console.error(`Failed to send to ${email}:`, error);
        failed++;
      }
    }
    
    res.json({
      success: true,
      total,
      sent,
      failed
    });
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    res.status(500).json({ 
      error: 'Failed to send bulk emails',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};