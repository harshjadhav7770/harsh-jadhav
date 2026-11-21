import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await clearAdminSessionCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to log out" },
      { status: 500 }
    );
  }
}
