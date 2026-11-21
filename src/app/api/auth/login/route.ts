import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import { Admin } from "@/models/Admin";
import { verifyPassword, setAdminSessionCookie } from "@/lib/auth/session";
import { AdminLoginSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 1. Rate limiting: 5 attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(ip, "admin_login", 5, 15 * 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again after 15 minutes.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = AdminLoginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors[0]?.message || "Invalid credentials" },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    await connectToDatabase();
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLoginAt = new Date();
    await admin.save();

    // Set encrypted session cookie
    await setAdminSessionCookie({
      adminId: admin._id.toString(),
      email: admin.email,
      name: admin.name,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: { name: admin.name, email: admin.email },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication service error" },
      { status: 500 }
    );
  }
}
