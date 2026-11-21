import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/connection";
import { Project } from "@/models/Project";
import { ProjectSchemaValidation } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const projects = await Project.find().populate("categoryId").sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.slug && body.title) {
      body.slug = slugify(body.title);
    }

    const parseResult = ProjectSchemaValidation.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check unique slug
    const existing = await Project.findOne({ slug: parseResult.data.slug });
    if (existing) {
      return NextResponse.json({ error: "Project slug already exists" }, { status: 400 });
    }

    const project = await Project.create(parseResult.data);
    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { _id, ...updateData } = body;
    if (!updateData.slug && updateData.title) {
      updateData.slug = slugify(updateData.title);
    }

    await connectToDatabase();
    const updated = await Project.findByIdAndUpdate(_id, { $set: updateData }, { new: true });
    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
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
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete project" }, { status: 500 });
  }
}
