import { connectToDatabase } from "@/lib/db/connection";
import { Project, ProjectCategory } from "@/models";
import { ProjectFilterList } from "@/components/portfolio/project-filter-list";
import { FolderGit2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await connectToDatabase();

  // Fetch dynamic categories and published projects directly from MongoDB
  const [categories, projects] = await Promise.all([
    ProjectCategory.find({ isActive: true }).sort({ order: 1 }).lean(),
    Project.find({ isPublished: true })
      .populate("categoryId")
      .sort({ order: 1, createdAt: -1 })
      .lean(),
  ]);

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b pb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          Case Studies & Implementations
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Projects</h1>
        <p className="text-muted-foreground text-base">
          Explore technical solutions, analytics dashboards, web systems, and open source repositories.
        </p>
      </div>

      {/* Dynamic Project Filter & Grid */}
      <ProjectFilterList
        initialCategories={JSON.parse(JSON.stringify(categories))}
        initialProjects={JSON.parse(JSON.stringify(projects))}
      />
    </div>
  );
}
