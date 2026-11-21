import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/connection";
import { About } from "@/models/About";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const about = await About.findOne().lean();
  return NextResponse.json({ about });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await connectToDatabase();
    const updated = await About.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, about: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update about" }, { status: 500 });
  }
}
