import { connectToDatabase } from "@/lib/db/connection";
import { Profile, About, Education } from "@/models";
import { MapPin, Mail, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await connectToDatabase();
  const [profile, about, educationList] = await Promise.all([
    Profile.findOne().lean(),
    About.findOne().lean(),
    Education.find({ isVisible: true }).sort({ order: 1, startDate: -1 }).lean(),
  ]);

  const toggles = about?.publicFieldToggles || {
    showEmail: true,
    showPhone: false,
    showLocation: true,
    showExperienceYears: true,
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-12">
      {/* Page Header */}
      <div className="space-y-2 border-b pb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          Biography & Qualifications
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          About {profile?.name || "Me"}
        </h1>
        <p className="text-muted-foreground text-base">
          {profile?.professionalTitle} &bull; Personal story, learning philosophy, and credentials
        </p>
      </div>

      {/* Main Biography */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="prose dark:prose-invert max-w-none text-base leading-relaxed space-y-4">
            <p className="text-lg font-medium text-foreground">
              {about?.biography || "Passionate engineer and analytical thinker dedicated to excellence."}
            </p>
            {about?.secondaryBio && (
              <p className="text-muted-foreground">{about.secondaryBio}</p>
            )}
          </div>

          {/* Interests */}
          {Boolean(about?.interests && about.interests.length > 0) && (
            <div className="pt-4 space-y-2">
              <h3 className="font-semibold text-sm text-foreground">Professional Interests:</h3>
              <div className="flex flex-wrap gap-2">
                {about?.interests?.map((interest: string, i: number) => (
                  <Badge key={i} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Personal Info Card & Profile Photo */}
        <div className="space-y-4">
          {(about?.profileImageUrl || profile?.profileImageUrl) && (
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-border shadow-sm bg-muted group">
              <img
                src={about?.profileImageUrl || profile?.profileImageUrl}
                alt={profile?.name || "Candidate portrait"}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {toggles.showLocation && profile?.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
              {toggles.showEmail && profile?.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:underline text-foreground">
                    {profile.email}
                  </a>
                </div>
              )}
              {toggles.showPhone && profile?.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {toggles.showExperienceYears && profile?.yearsOfExperience !== undefined && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>{profile.yearsOfExperience} Years Experience</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Education Timeline */}
      {educationList.length > 0 && (
        <section className="space-y-6 pt-6 border-t">
          <h2 className="text-2xl font-bold tracking-tight">Education & Degrees</h2>

          <div className="space-y-4">
            {educationList.map((edu: any) => (
              <div key={edu._id} className="p-5 rounded-xl border bg-card space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-bold text-base">{edu.degree} &mdash; {edu.fieldOfStudy}</h3>
                  <span className="text-xs text-muted-foreground">
                    {edu.startDate} &ndash; {edu.isCurrent ? "Present" : edu.endDate || "Present"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {edu.institution} {edu.gradeOrCgpa ? `(${edu.gradeOrCgpa})` : ""}
                </p>
                {edu.description && (
                  <p className="text-xs text-muted-foreground pt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My Learning Approach */}
      {about?.learningApproach && (
        <section className="space-y-6 pt-6 border-t">
          <h2 className="text-2xl font-bold tracking-tight">My Learning Approach</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {about.learningApproach.philosophy && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">1. Learning Philosophy</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {about.learningApproach.philosophy}
                </CardContent>
              </Card>
            )}

            {about.learningApproach.practicalProcess && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">2. Practical Implementation</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {about.learningApproach.practicalProcess}
                </CardContent>
              </Card>
            )}

            {about.learningApproach.problemSolving && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">3. Problem-Solving Rigor</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {about.learningApproach.problemSolving}
                </CardContent>
              </Card>
            )}

            {about.learningApproach.continuousLearning && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">4. Continuous Evolution</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {about.learningApproach.continuousLearning}
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
