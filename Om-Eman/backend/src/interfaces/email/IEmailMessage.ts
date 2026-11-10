export interface IEmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}
