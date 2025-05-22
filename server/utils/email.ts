import nodemailer from 'nodemailer';
import { EmailCredentials, EmailTemplate } from '../types';

export const createTransporter = (credentials: EmailCredentials) => {
  return nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  service: 'gmail',
    auth: {
      user: credentials.email,
      pass: credentials.password
    }
  });
};

export const sendEmail = async (
  transporter: nodemailer.Transporter,
  from: string,
  to: string,
  template: EmailTemplate
) => {
  await transporter.sendMail({
    from,
    to,
    subject: template.subject,
    html: template.body
  });
};

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};