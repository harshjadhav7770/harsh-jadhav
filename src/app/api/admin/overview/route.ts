import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/connection";
import {
  Project,
  Skill,
  Experience,
  ContactMessage,
  Profile,
  About,
} from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const [
    totalProjects,
    publishedProjects,
    totalSkills,
    totalExperience,
    totalMessages,
    unreadMessages,
    profile,
    about,
    recentMessages,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ isPublished: true }),
    Skill.countDocuments(),
    Experience.countDocuments(),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ isRead: false }),
    Profile.findOne().lean(),
    About.findOne().lean(),
    ContactMessage.find().sort({ submittedAt: -1 }).limit(5).lean(),
  ]);

  // Calculate completeness score
  let completeness = 20; // Base from installation
  if (profile?.profileImageUrl) completeness += 15;
  if (profile?.resumeUrl) completeness += 10;
  if (about?.biography) completeness += 15;
  if (totalProjects >= 2) completeness += 20;
  if (totalSkills >= 5) completeness += 10;
  if (totalExperience >= 1 || about?.learningApproach?.philosophy) completeness += 10;

  return NextResponse.json({
    metrics: {
      totalProjects,
      publishedProjects,
      totalSkills,
      totalExperience,
      totalMessages,
      unreadMessages,
      completeness: Math.min(100, completeness),
    },
    recentMessages,
  });
}
