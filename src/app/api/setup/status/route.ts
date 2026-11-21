import { NextResponse } from "next/server";
import { getInstallationStatus } from "@/services/installationService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await getInstallationStatus();

    const envCheck = {
      appName: !!process.env.SKILLHUB_APP_NAME,
      authorName: !!process.env.SKILLHUB_APP_AUTHOR,
      appUrl: !!process.env.SKILLHUB_APP_URL,
      mongoUri: !!process.env.SKILLHUB_MONGODB_URI,
      authSecret:
        !!process.env.SKILLHUB_AUTH_SECRET &&
        process.env.SKILLHUB_AUTH_SECRET.length >= 32,
      cloudinary:
        !!process.env.SKILLHUB_CLOUDINARY_CLOUD_NAME &&
        !!process.env.SKILLHUB_CLOUDINARY_API_KEY &&
        !!process.env.SKILLHUB_CLOUDINARY_API_SECRET,
      email:
        !!process.env.SKILLHUB_GMAIL_USER &&
        !!process.env.SKILLHUB_GMAIL_APP_PASSWORD,
    };

    return NextResponse.json({
      isInstalled: status.isInstalled,
      portfolioType: status.portfolioType,
      installedAt: status.installedAt,
      envCheck,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve setup status" },
      { status: 500 }
    );
  }
}
