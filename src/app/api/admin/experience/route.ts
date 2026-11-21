import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/connection";
import { Experience } from "@/models/Experience";
import { ExperienceSchemaValidation } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const experiences = await Experience.find().sort({ order: 1, startDate: -1 }).lean();
  return NextResponse.json({ experiences });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parseResult = ExperienceSchemaValidation.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const entry = await Experience.create(parseResult.data);
    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create experience" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { _id, ...updateData } = body;
    await connectToDatabase();
    const updated = await Experience.findByIdAndUpdate(_id, { $set: updateData }, { new: true });
    return NextResponse.json({ success: true, entry: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await connectToDatabase();
    await Experience.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete experience" }, { status: 500 });
  }
}
