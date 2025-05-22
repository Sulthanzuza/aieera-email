import xlsx from 'xlsx';
import { isValidEmail } from './email';

export const extractEmailsFromExcel = (filePath: string): string[] => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  
  const extractedEmails: string[] = [];
  
  for (const row of data) {
    const rowValues = Object.values(row);
    for (const value of rowValues) {
      if (typeof value === 'string' && isValidEmail(value)) {
        extractedEmails.push(value);
        break; // Only take one email per row
      }
    }
  }
  
  return extractedEmails;
};