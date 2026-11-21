import { connectToDatabase } from "@/lib/db/connection";
import { Profile, About, SocialLink } from "@/models";
import { ContactFormClient } from "@/components/portfolio/contact-form-client";
import { Mail, Phone, MapPin, Sparkles, Share2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  await connectToDatabase();
  const [profile, about, socialLinks] = await Promise.all([
    Profile.findOne().lean(),
    About.findOne().lean(),
    SocialLink.find({ isVisible: true }).sort({ order: 1 }).lean(),
  ]);

  const toggles = about?.publicFieldToggles || {
    showEmail: true,
    showPhone: false,
    showLocation: true,
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-2 border-b pb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          Direct Contact
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Get in Touch</h1>
        <p className="text-muted-foreground text-base">
          Have an inquiry, project, or full-time opportunity? Send a message and I will respond promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Direct Info & Social Channels */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-bold text-base">Contact Information</h2>

              <div className="space-y-3 text-sm">
                {toggles.showEmail && profile?.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a href={`mailto:${profile.email}`} className="font-medium hover:underline">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {toggles.showPhone && profile?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone / WhatsApp</p>
                      <span className="font-medium">{profile.phone}</span>
                    </div>
                  </div>
                )}

                {toggles.showLocation && profile?.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-primary" /> Follow & Connect
                </h3>
                <div className="flex flex-col gap-2 pt-1 text-xs">
                  {socialLinks.map((s: any) => (
                    <a
                      key={s._id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="font-medium">{s.platform}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-2">
          <ContactFormClient />
        </div>
      </div>
    </div>
  );
}
