import nodemailer, { type Transporter } from "nodemailer";
import { env } from "./env.js";
import { logger } from "../utils/logger/index.js";
import type { IEmailMessage } from "../interfaces/email/IEmailMessage.js";

export const isEmailConfigured = Boolean(
  env.EMAIL_ENABLED && env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS,
);

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }

  return transporter;
}

export async function sendEmail(message: IEmailMessage): Promise<boolean> {
  if (!isEmailConfigured) {
    logger.warn("Email not configured; message skipped", {
      subject: message.subject,
    });
    return false;
  }

  try {
    const info = await getTransporter().sendMail({
      from: env.SMTP_FROM,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });

    logger.info("Email sent", {
      subject: message.subject,
      messageId: info.messageId,
    });
    return true;
  } catch (error) {
    logger.error("Email send failed", {
      subject: message.subject,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
