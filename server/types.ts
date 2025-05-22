export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface EmailCredentials {
  email: string;
  password: string;
}

export interface SendTestEmailRequest {
  credentials: EmailCredentials;
  template: EmailTemplate;
  testEmail: string;
}

export interface SendBulkEmailRequest {
  credentials: EmailCredentials;
  template: EmailTemplate;
}