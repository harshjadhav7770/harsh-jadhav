import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db/connection";
import { Profile, SocialLink, SiteSettings, Admin } from "@/models";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { getInstallationStatus } from "@/services/installationService";
import { DynamicThemeInjector } from "@/components/theme/dynamic-theme-injector";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.SKILLHUB_MONGODB_URI) {
    redirect("/setup");
  }

  const installStatus = await getInstallationStatus();
  if (!installStatus.isInstalled) {
    redirect("/setup");
  }
  let profileName = "";
  let professionalTitle = "";
  let socialLinks: any[] = [];
  let attribution: any = null;
  let accentColor = "#2563eb";

  try {
    await connectToDatabase();
    const [p, links, settings, admin] = await Promise.all([
      Profile.findOne().select("name professionalTitle").lean(),
      SocialLink.find({ isVisible: true }).sort({ order: 1 }).lean(),
      SiteSettings.findOne().select("footerAttribution accentColor").lean(),
      Admin.findOne().select("name").lean(),
    ]);

    if (p && p.name) {
      profileName = p.name;
      professionalTitle = p.professionalTitle || "";
    } else if (admin && admin.name) {
      profileName = admin.name;
    }
    if (links) socialLinks = JSON.parse(JSON.stringify(links));
    if (settings) {
      if (settings.footerAttribution) {
        attribution = JSON.parse(JSON.stringify(settings.footerAttribution));
      }
      if (settings.accentColor) {
        accentColor = settings.accentColor;
      }
    }
  } catch (err) {
    // Graceful fallback during pre-initialization
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <DynamicThemeInjector color={accentColor} />
      <PublicNavbar candidateName={profileName} />
      <main className="flex-1">{children}</main>
      <PublicFooter
        candidateName={profileName}
        professionalTitle={professionalTitle}
        socialLinks={socialLinks}
        attribution={attribution}
      />
    </div>
  );
}
