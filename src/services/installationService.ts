import crypto from "crypto";
import { connectToDatabase } from "@/lib/db/connection";
import {
  Admin,
  Installation,
  Profile,
  About,
  SkillCategory,
  Skill,
  ProjectCategory,
  Project,
  SocialLink,
  SiteSettings,
  PortfolioType,
  InstallationType,
} from "@/models";
import { hashPassword } from "@/lib/auth/session";
import { getDummyData } from "@/lib/seed/dummyData";
import { INITIAL_SOCIAL_PLATFORMS } from "@/lib/constants";

export interface SetupPayload {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  portfolioType: PortfolioType;
  installationType: InstallationType;
  customProfile?: {
    professionalTitle?: string;
    heroHeadline?: string;
    heroIntroduction?: string;
    location?: string;
    phone?: string;
  };
  customAbout?: {
    biography?: string;
    interests?: string[];
  };
}

export async function getInstallationStatus(): Promise<{
  isInstalled: boolean;
  portfolioType?: PortfolioType;
  installedAt?: Date;
}> {
  if (!process.env.SKILLHUB_MONGODB_URI) {
    return { isInstalled: false };
  }

  try {
    await connectToDatabase();
    const installRecord = await Installation.findOne().lean();
    if (!installRecord || !installRecord.isInstalled) {
      return { isInstalled: false };
    }
    return {
      isInstalled: true,
      portfolioType: installRecord.portfolioType,
      installedAt: installRecord.installedAt,
    };
  } catch (error) {
    console.error("Error checking installation status:", error);
    return { isInstalled: false };
  }
}

export async function performInstallation(payload: SetupPayload): Promise<{
  success: boolean;
  adminId?: string;
  error?: string;
}> {
  await connectToDatabase();

  // 1. Guard against reinstallation or concurrent initialization
  const existingInstall = await Installation.findOne();
  if (existingInstall && existingInstall.isInstalled) {
    return {
      success: false,
      error: "Application is already initialized and configured. Setup is permanently locked.",
    };
  }

  const existingAdmin = await Admin.findOne();
  if (existingAdmin) {
    return {
      success: false,
      error: "An administrator account already exists. Setup cannot be re-run.",
    };
  }

  // 2. Lock token generation
  const lockToken = crypto.randomBytes(32).toString("hex");

  // 3. Hash administrator password
  const passwordHash = await hashPassword(payload.password);

  // 4. Create the sole administrator
  const admin = await Admin.create({
    name: payload.name.trim(),
    email: payload.email.toLowerCase().trim(),
    mobile: payload.mobile?.trim(),
    passwordHash,
  });

  // 5. Generate dummy data according to selected portfolio type
  const dummyData = getDummyData(payload.portfolioType, payload.name);

  // 6. Create Profile
  await Profile.create({
    name: payload.name.trim(),
    professionalTitle:
      payload.customProfile?.professionalTitle || dummyData.profile.professionalTitle,
    heroHeadline:
      payload.customProfile?.heroHeadline || dummyData.profile.heroHeadline,
    heroSubheadline: dummyData.profile.heroSubheadline,
    heroIntroduction:
      payload.customProfile?.heroIntroduction || dummyData.profile.heroIntroduction,
    location: payload.customProfile?.location || "India",
    email: payload.email.toLowerCase().trim(),
    phone: payload.customProfile?.phone || payload.mobile || "",
    availabilityStatus: "Available for new opportunities",
    yearsOfExperience: dummyData.profile.yearsOfExperience,
    highlightStats: dummyData.profile.highlightStats,
    isHeroImageVisible: true,
    heroImagePosition: "right",
    enableTypingEffect: true,
    typingWords: dummyData.profile.typingWords,
  });

  // 7. Create About
  await About.create({
    biography: payload.customAbout?.biography || dummyData.about.biography,
    secondaryBio: dummyData.about.secondaryBio,
    interests: payload.customAbout?.interests || dummyData.about.interests,
    learningApproach: dummyData.about.learningApproach,
    publicFieldToggles: {
      showEmail: true,
      showPhone: false,
      showLocation: true,
      showExperienceYears: true,
    },
    isVisible: true,
  });

  // 8. Create Skill Categories & Skills
  const categoryMap = new Map<string, string>();
  for (const cat of dummyData.skillCategories) {
    const createdCat = await SkillCategory.create({
      name: cat.name,
      slug: cat.slug,
      order: cat.order,
      isActive: true,
    });
    categoryMap.set(cat.slug, createdCat._id.toString());
  }

  for (const sk of dummyData.skills) {
    const catId = categoryMap.get(sk.categorySlug);
    if (catId) {
      await Skill.create({
        name: sk.name,
        categoryId: catId,
        proficiencyLevel: sk.proficiencyLevel,
        proficiencyPercent: sk.proficiencyPercent,
        yearsOfExperience: sk.yearsOfExperience,
        iconName: sk.iconName,
        order: sk.order,
        isVisible: true,
      });
    }
  }

  // 9. Create Project Categories & Projects
  const projectCatMap = new Map<string, string>();
  for (const pCat of dummyData.projectCategories) {
    const createdPCat = await ProjectCategory.create({
      name: pCat.name,
      slug: pCat.slug,
      order: pCat.order,
      isActive: true,
    });
    projectCatMap.set(pCat.slug, createdPCat._id.toString());
  }

  for (const proj of dummyData.projects) {
    const catId = projectCatMap.get(proj.categorySlug);
    if (catId) {
      await Project.create({
        title: proj.title,
        slug: proj.slug,
        shortDescription: proj.shortDescription,
        fullDescription: proj.fullDescription,
        problemStatement: proj.problemStatement,
        solutionStatement: proj.solutionStatement,
        keyFeatures: proj.keyFeatures,
        technologies: proj.technologies,
        categoryId: catId,
        projectType: proj.projectType,
        heroImageUrl: proj.heroImageUrl,
        screenshots: proj.screenshots,
        liveUrl: proj.liveUrl,
        sourceUrl: proj.sourceUrl,
        isFeatured: proj.isFeatured,
        isPublished: true,
        order: proj.order,
        isSampleData: true,
      });
    }
  }

  // 10. Create initial Social Links
  for (let i = 0; i < INITIAL_SOCIAL_PLATFORMS.length; i++) {
    const platform = INITIAL_SOCIAL_PLATFORMS[i];
    await SocialLink.create({
      platform: platform.platform,
      url:
        platform.platform === "LinkedIn"
          ? "https://linkedin.com"
          : platform.platform === "GitHub"
          ? "https://github.com"
          : "https://www.skillhubdev.com",
      iconName: platform.iconName,
      order: i + 1,
      isVisible: true,
    });
  }

  // 11. Create Site Settings
  await SiteSettings.create({
    siteTitle: `${payload.name} | Portfolio`,
    siteTagline: dummyData.profile.professionalTitle,
    siteDescription: dummyData.profile.heroIntroduction,
    defaultTheme: "system",
    accentColor: "#2563eb",
    enableAnimations: true,
    sectionsConfig: {
      hero: { isVisible: true, order: 1 },
      about: { isVisible: true, order: 2 },
      skills: { isVisible: true, order: 3 },
      projects: { isVisible: true, order: 4 },
      experience: { isVisible: true, order: 5 },
      contact: { isVisible: true, order: 6 },
    },
    footerAttribution: {
      showBrandCredit: true,
      brandText: "Built with SKILLHUB",
      authorText: "Akash Dhone",
      websiteUrl: "https://www.skillhubdev.com",
    },
  });

  // 12. Record Installation Status
  await Installation.create({
    isInstalled: true,
    installedAt: new Date(),
    portfolioType: payload.portfolioType,
    installationType: payload.installationType,
    setupVersion: "1.0.0",
    lockToken,
  });

  return {
    success: true,
    adminId: admin._id.toString(),
  };
}
