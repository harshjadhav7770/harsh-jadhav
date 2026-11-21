import { connectToDatabase } from "@/lib/db/connection";
import { Skill, SkillCategory, About } from "@/models";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  await connectToDatabase();
  const [categories, skills, about] = await Promise.all([
    SkillCategory.find({ isActive: true }).sort({ order: 1 }).lean(),
    Skill.find({ isVisible: true }).sort({ order: 1 }).lean(),
    About.findOne().lean(),
  ]);

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-2 border-b pb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          Technical Arsenal
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Technologies & Competencies
        </h1>
        <p className="text-muted-foreground text-base">
          Categorized frameworks, core languages, analytical toolsets, and platforms.
        </p>
      </div>

      {/* Skills Grouped by Category in Responsive Masonry Column Layout */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
        {categories.map((category: any) => {
          const categorySkills = skills.filter(
            (s: any) => s.categoryId?.toString() === category._id.toString()
          );
          if (categorySkills.length === 0) return null;

          return (
            <div
              key={category._id}
              className="break-inside-avoid mb-6 rounded-2xl border bg-card p-5 sm:p-6 shadow-xs hover:border-primary/50 transition-colors space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-base font-bold text-foreground tracking-tight">
                  {category.name}
                </h2>
                <Badge variant="outline" className="text-[11px] font-semibold bg-muted/50">
                  {categorySkills.length} {categorySkills.length === 1 ? "skill" : "skills"}
                </Badge>
              </div>

              <div className="space-y-2.5">
                {categorySkills.map((sk: any) => (
                  <div
                    key={sk._id}
                    className="p-3 rounded-xl border bg-muted/30 hover:bg-muted/70 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-foreground">{sk.name}</span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-medium px-2 py-0.5 bg-background border text-foreground/80 shadow-2xs"
                      >
                        {sk.proficiencyLevel || "Practiced"}
                      </Badge>
                    </div>

                    {sk.yearsOfExperience !== undefined && sk.yearsOfExperience > 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        {sk.yearsOfExperience} {sk.yearsOfExperience === 1 ? "year" : "years"} practical experience
                      </p>
                    )}

                    {sk.description && (
                      <p className="text-[11px] text-muted-foreground/90 pt-0.5 leading-relaxed">
                        {sk.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Learning Philosophy Summary */}
      {about?.learningApproach?.philosophy && (
        <section className="pt-8 border-t space-y-4">
          <h2 className="text-xl font-bold">Continuous Learning Framework</h2>
          <Card className="bg-muted/40">
            <CardContent className="p-6 text-sm text-muted-foreground leading-relaxed space-y-2">
              <p className="font-semibold text-foreground">How I master new tools:</p>
              <p>{about.learningApproach.philosophy}</p>
              {about.learningApproach.projectBased && (
                <p className="pt-2">{about.learningApproach.projectBased}</p>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
