import { AdminLayout } from "@/components/dashboard/admin-layout";
import { connectToDatabase } from "@/lib/db/connection";
import { SiteSettings } from "@/models/SiteSettings";
import { DynamicThemeInjector } from "@/components/theme/dynamic-theme-injector";

export const dynamic = "force-dynamic";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let accentColor = "#2563eb";
  try {
    if (process.env.SKILLHUB_MONGODB_URI) {
      await connectToDatabase();
      const settings = await SiteSettings.findOne().select("accentColor").lean();
      if (settings?.accentColor) {
        accentColor = settings.accentColor;
      }
    }
  } catch (err) {
    // fallback to default
  }

  return (
    <>
      <DynamicThemeInjector color={accentColor} />
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
