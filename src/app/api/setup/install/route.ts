import { NextRequest, NextResponse } from "next/server";
import { performInstallation } from "@/services/installationService";
import { AdminSetupSchema } from "@/lib/validation";
import { setAdminSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = AdminSetupSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || "Invalid setup input";
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const data = parseResult.data;

    const result = await performInstallation({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      portfolioType: data.portfolioType,
      installationType: data.installationType,
      customProfile: body.customProfile,
      customAbout: body.customAbout,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Automatically establish first admin session cookie
    if (result.adminId) {
      await setAdminSessionCookie({
        adminId: result.adminId,
        email: data.email.toLowerCase().trim(),
        name: data.name.trim(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio initialized successfully!",
    });
  } catch (error: any) {
    console.error("Installation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during installation.",
      },
      { status: 500 }
    );
  }
}
