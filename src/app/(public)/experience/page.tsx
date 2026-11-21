import { connectToDatabase } from "@/lib/db/connection";
import { Experience, Education, Project, About } from "@/models";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  await connectToDatabase();

  const [experiences, educations, projects, about] = await Promise.all([
    Experience.find({ isVisible: true }).sort({ order: 1, startDate: -1 }).lean(),
    Education.find({ isVisible: true }).sort({ order: 1, startDate: -1 }).lean(),
    Project.find({ isPublished: true }).sort({ order: 1 }).limit(3).lean(),
    About.findOne().lean(),
  ]);

  const hasCorporateExperience = experiences.length > 0;

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b pb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          Professional Trajectory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Experience & Milestones
        </h1>
        <p className="text-muted-foreground text-base">
          {hasCorporateExperience
            ? "Track record of employment roles, deliverables, and engineering contributions."
            : "Practical project-based milestones, certifications, and technical accomplishments."}
        </p>
      </div>

      {/* Corporate Experience Mode */}
      {hasCorporateExperience ? (
        <div className="space-y-6">
          {experiences.map((exp: any) => (
            <Card key={exp._id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <h2 className="text-lg font-bold">{exp.jobTitle}</h2>
                  <p className="text-sm font-semibold text-primary">
                    {exp.companyName} {exp.location ? `&bull; ${exp.location}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {exp.employmentType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {exp.startDate} &ndash; {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                  </span>
                </div>
              </div>

              {exp.responsibilities?.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Responsibilities & Contributions:
                  </h4>
                  <ul className="space-y-1.5">
                    {exp.responsibilities.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {exp.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.technologies.map((tech: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        /* Fresher-Friendly Adaptive Experience Mode */
        <div className="space-y-10">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
            <div className="text-primary font-semibold text-sm">
              Project-Based & Practical Apprenticeship Focus
            </div>
            <p className="text-xs text-muted-foreground">
              Trained through rigorous hands-on project implementations with SKILLHUB IT SOLUTION. Demonstrated mastery through working architectures, case studies, and structured technical milestones.
            </p>
          </div>

          {/* 1. Practical Learning Experience */}
          {about?.learningApproach && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold">
                Practical Learning & Execution
              </h2>
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground space-y-3 leading-relaxed">
                  <p>
                    {about.learningApproach.practicalProcess ||
                      "Developed end-to-end applications adhering to enterprise software engineering standards, modular design patterns, and continuous testing."}
                  </p>
                  <p>
                    {about.learningApproach.projectBased ||
                      "Built full-stack solutions and analytical models from ground zero, tackling data modeling, state persistence, API security, and deployment."}
                  </p>
                </CardContent>
              </Card>
            </section>
          )}

          {/* 2. Highlight Projects as Practical Experience */}
          {projects.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold">
                Key Practical Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((proj: any) => (
                  <Card key={proj._id} className="p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base hover:text-primary transition-colors">
                        <Link href={`/projects/${proj.slug}`}>{proj.title}</Link>
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {proj.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(proj.technologies || []).slice(0, 3).map((t: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* 3. Education Foundations */}
          {educations.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold">
                Academic Foundations
              </h2>
              <div className="space-y-3">
                {educations.map((edu: any) => (
                  <div key={edu._id} className="p-4 rounded-xl border bg-card">
                    <h3 className="font-bold text-sm">{edu.degree} - {edu.fieldOfStudy}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {edu.institution} &bull; {edu.startDate} – {edu.endDate || "Present"}
                      {edu.gradeOrCgpa ? ` (${edu.gradeOrCgpa})` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
