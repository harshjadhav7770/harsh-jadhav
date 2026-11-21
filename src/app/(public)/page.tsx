import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db/connection";
import { getInstallationStatus } from "@/services/installationService";
import {
  Profile,
  About,
  Project,
  Skill,
  SkillCategory,
  SiteSettings,
} from "@/models";
import { HeroSection } from "@/components/portfolio/hero-section";
import {
  AnimatedAboutSection,
  AnimatedFeaturedProjects,
  AnimatedSkillsSection,
  AnimatedContactCta,
} from "@/components/portfolio/home-sections-animated";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!process.env.SKILLHUB_MONGODB_URI) {
    redirect("/setup");
  }

  const status = await getInstallationStatus();
  if (!status.isInstalled) {
    redirect("/setup");
  }

  await connectToDatabase();

  const [profile, about, featuredProjects, skillCategories, skills, settings] =
    await Promise.all([
      Profile.findOne().lean(),
      About.findOne().lean(),
      Project.find({ isPublished: true, isFeatured: true })
        .populate("categoryId")
        .sort({ order: 1 })
        .limit(4)
        .lean(),
      SkillCategory.find({ isActive: true }).sort({ order: 1 }).limit(4).lean(),
      Skill.find({ isVisible: true }).lean(),
      SiteSettings.findOne().lean(),
    ]);

  const secConfig: any = settings?.sectionsConfig || {
    hero: { isVisible: true },
    about: { isVisible: true },
    skills: { isVisible: true },
    projects: { isVisible: true },
    experience: { isVisible: true },
    contact: { isVisible: true },
  };

  // Plain JSON objects for Client Components
  const serializedProfile = profile ? JSON.parse(JSON.stringify(profile)) : null;
  const serializedAbout = about ? JSON.parse(JSON.stringify(about)) : null;
  const serializedProjects = featuredProjects ? JSON.parse(JSON.stringify(featuredProjects)) : [];
  const serializedCategories = skillCategories ? JSON.parse(JSON.stringify(skillCategories)) : [];
  const serializedSkills = skills ? JSON.parse(JSON.stringify(skills)) : [];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      {secConfig.hero?.isVisible && <HeroSection profile={serializedProfile} />}

      {/* 2. ABOUT ME PREVIEW */}
      {secConfig.about?.isVisible && (
        <AnimatedAboutSection
          about={serializedAbout}
          config={secConfig.about}
        />
      )}

      {/* 3. FEATURED PROJECTS */}
      {secConfig.projects?.isVisible && (
        <AnimatedFeaturedProjects
          projects={serializedProjects}
          config={secConfig.projects}
        />
      )}

      {/* 4. FEATURED SKILLS */}
      {secConfig.skills?.isVisible && (
        <AnimatedSkillsSection
          categories={serializedCategories}
          skills={serializedSkills}
          config={secConfig.skills}
        />
      )}

      {/* 5. CONTACT CTA */}
      {secConfig.contact?.isVisible && (
        <AnimatedContactCta config={secConfig.contact} />
      )}
    </div>
  );
}
