import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/connection";
import { MediaAsset } from "@/models/MediaAsset";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const assets = await MediaAsset.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await connectToDatabase();
    const asset = await MediaAsset.create(body);
    return NextResponse.json({ success: true, asset });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to register media asset" }, { status: 500 });
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
    const asset = await MediaAsset.findById(id);
    if (asset) {
      await deleteCloudinaryAsset(asset.publicId);
      await MediaAsset.findByIdAndDelete(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete media asset" }, { status: 500 });
  }
}
