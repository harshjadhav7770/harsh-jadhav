import { notFound } from "next/navigation";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db/connection";
import { Project } from "@/models/Project";
import { ProjectDetailsClient } from "@/components/portfolio/project-details-client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const project = await Project.findOne({ slug, isPublished: true }).lean();
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.seoTitle || `${project.title} | Case Study`,
    description: project.seoDescription || project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.heroImageUrl ? [{ url: project.heroImageUrl }] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();

  const project = await Project.findOne({ slug, isPublished: true })
    .populate("categoryId")
    .lean();

  if (!project) {
    notFound();
  }

  // Fetch related projects in same category
  const relatedProjects = await Project.find({
    categoryId: project.categoryId?._id || project.categoryId,
    _id: { $ne: project._id },
    isPublished: true,
  })
    .limit(2)
    .lean();

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-10">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs -ml-2 mb-4">
          <Link href="/projects">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all projects
          </Link>
        </Button>
      </div>

      <ProjectDetailsClient
        project={JSON.parse(JSON.stringify(project))}
        relatedProjects={JSON.parse(JSON.stringify(relatedProjects))}
      />
    </div>
  );
}
