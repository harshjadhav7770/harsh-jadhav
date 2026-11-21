import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import { ContactMessage } from "@/models/ContactMessage";
import { Profile } from "@/models/Profile";
import { ContactFormSchema } from "@/lib/validation";
import { checkRateLimit, sanitizeString } from "@/lib/security";
import { sendContactNotificationEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 1. Rate limiting: 3 submissions per 10 minutes per IP
    const rateCheck = checkRateLimit(ip, "contact_form", 3, 10 * 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many messages sent. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Honeypot anti-spam check
    if (body.honeypot && body.honeypot.length > 0) {
      // Silently accept without processing spam
      return NextResponse.json({ success: true, message: "Message sent!" });
    }

    // 3. Zod validation
    const parseResult = ContactFormSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors[0]?.message || "Invalid contact form input",
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 4. Sanitize strings
    const name = sanitizeString(data.name.trim());
    const email = data.email.toLowerCase().trim();
    const mobile = data.mobile ? sanitizeString(data.mobile.trim()) : undefined;
    const subject = sanitizeString(data.subject.trim());
    const message = sanitizeString(data.message.trim());

    await connectToDatabase();

    // 5. Save message to MongoDB
    const savedMsg = await ContactMessage.create({
      senderName: name,
      senderEmail: email,
      senderMobile: mobile,
      subject,
      message,
      ipAddress: ip,
      submittedAt: new Date(),
    });

    // 6. Fetch candidate profile for email delivery
    const profile = await Profile.findOne().lean();
    const candidateName = profile?.name || "Portfolio Owner";
    const adminEmail = process.env.SKILLHUB_ADMIN_EMAIL || process.env.SKILLHUB_GMAIL_USER || "";

    // 7. Dispatch background notification emails via Nodemailer
    sendContactNotificationEmails({
      senderName: name,
      senderEmail: email,
      senderMobile: mobile,
      subject,
      message,
      adminEmail,
      candidateName,
    }).catch((err) => {
      console.error("Background email sending error:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received.",
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred while sending your message.",
      },
      { status: 500 }
    );
  }
}
