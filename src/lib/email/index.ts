import nodemailer from "nodemailer";
import { SKILLHUB_META } from "../constants";

interface SendContactEmailParams {
  senderName: string;
  senderEmail: string;
  senderMobile?: string;
  subject: string;
  message: string;
  adminEmail: string;
  candidateName: string;
}

export function isEmailConfigured(): boolean {
  return !!(
    process.env.SKILLHUB_GMAIL_USER && process.env.SKILLHUB_GMAIL_APP_PASSWORD
  );
}

export function createEmailTransporter() {
  const user = process.env.SKILLHUB_GMAIL_USER;
  const pass = process.env.SKILLHUB_GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendContactNotificationEmails(params: SendContactEmailParams): Promise<{
  adminSent: boolean;
  visitorSent: boolean;
  error?: string;
}> {
  const transporter = createEmailTransporter();
  if (!transporter) {
    return { adminSent: false, visitorSent: false, error: "SMTP credentials not configured" };
  }

  const user = process.env.SKILLHUB_GMAIL_USER!;
  const submissionDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // 1. Template: Notification for Admin / Candidate
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: #2563eb; color: #ffffff; padding: 24px; }
        .header h2 { margin: 0; font-size: 20px; }
        .content { padding: 24px; line-height: 1.6; }
        .field { margin-bottom: 16px; }
        .label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px; }
        .value { font-size: 15px; color: #0f172a; margin-top: 4px; }
        .msg-box { background: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb; white-space: pre-wrap; }
        .footer { background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; text-align: center; }
        .footer a { color: #2563eb; text-decoration: none; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2>New Portfolio Inquiry Received</h2>
          <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">Inquiry via ${SKILLHUB_META.brandCredit}</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Sender Name</div>
            <div class="value">${params.senderName}</div>
          </div>
          <div class="field">
            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${params.senderEmail}" style="color: #2563eb;">${params.senderEmail}</a></div>
          </div>
          ${
            params.senderMobile
              ? `<div class="field"><div class="label">Phone / Mobile</div><div class="value">${params.senderMobile}</div></div>`
              : ""
          }
          <div class="field">
            <div class="label">Subject</div>
            <div class="value"><strong>${params.subject}</strong></div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="value msg-box">${params.message}</div>
          </div>
          <div class="field">
            <div class="label">Date & Time</div>
            <div class="value">${submissionDate}</div>
          </div>
        </div>
        <div class="footer">
          Powered by <a href="${SKILLHUB_META.website}">${SKILLHUB_META.organization}</a> &bull; Portfolio System by ${SKILLHUB_META.author}
        </div>
      </div>
    </body>
    </html>
  `;

  // 2. Template: Confirmation for Visitor
  const visitorHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: #0f172a; color: #ffffff; padding: 24px; }
        .header h2 { margin: 0; font-size: 20px; }
        .content { padding: 24px; line-height: 1.6; }
        .msg-box { background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 12px; font-style: italic; }
        .footer { background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; text-align: center; }
        .footer a { color: #2563eb; text-decoration: none; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2>Thank You for Reaching Out!</h2>
          <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">Message received by ${params.candidateName}</p>
        </div>
        <div class="content">
          <p>Hello <strong>${params.senderName}</strong>,</p>
          <p>Thank you for visiting my portfolio and sending a message regarding "<strong>${params.subject}</strong>".</p>
          <p>I have received your inquiry and will review it and get back to you as soon as possible.</p>
          <div class="msg-box">"${params.message}"</div>
          <p style="margin-top: 20px;">Best regards,<br/><strong>${params.candidateName}</strong></p>
        </div>
        <div class="footer">
          ${SKILLHUB_META.brandCredit} &bull; <a href="${SKILLHUB_META.website}">${SKILLHUB_META.website}</a>
        </div>
      </div>
    </body>
    </html>
  `;

  let adminSent = false;
  let visitorSent = false;

  try {
    await transporter.sendMail({
      from: `"${params.senderName} (Portfolio)" <${user}>`,
      to: params.adminEmail || user,
      replyTo: params.senderEmail,
      subject: `[Portfolio Inquiry] ${params.subject}`,
      html: adminHtml,
    });
    adminSent = true;
  } catch (err) {
    console.error("Failed to send admin notification email:", err);
  }

  try {
    await transporter.sendMail({
      from: `"${params.candidateName}" <${user}>`,
      to: params.senderEmail,
      subject: `Thank you for contacting ${params.candidateName}`,
      html: visitorHtml,
    });
    visitorSent = true;
  } catch (err) {
    console.error("Failed to send visitor confirmation email:", err);
  }

  return { adminSent, visitorSent };
}
