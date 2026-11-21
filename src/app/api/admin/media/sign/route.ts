import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { generateSignedUploadParams, isCloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary credentials are not configured in environment variables." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const folder = body.folder || "skillhub-portfolio";
    const signedParams = generateSignedUploadParams(folder);

    return NextResponse.json({ success: true, ...signedParams });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
