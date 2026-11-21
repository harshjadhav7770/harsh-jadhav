"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Loader2, Save, Settings, Sparkles, Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ui/color-picker";
import { DynamicThemeInjector } from "@/components/theme/dynamic-theme-injector";
import { SKILLHUB_META } from "@/lib/constants";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        setSettings(json.settings || {});
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
      toast.success("Website settings updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Website Settings & SEO</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure site metadata, section visibility, theme defaults, and SKILLHUB branding preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Meta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Website Metadata & Branding</CardTitle>
            <CardDescription>Title, tagline, and SEO description for search engines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site-title">Website Title</Label>
                <Input
                  id="site-title"
                  value={settings?.siteTitle || ""}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-tagline">Tagline</Label>
                <Input
                  id="site-tagline"
                  value={settings?.siteTagline || ""}
                  onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-desc">SEO Meta Description</Label>
              <Textarea
                id="site-desc"
                rows={3}
                value={settings?.siteDescription || ""}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section Visibility & Heading Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Homepage Sections & Custom Titles</CardTitle>
            <CardDescription>
              Toggle homepage sections and dynamically rename their headings, badge titles, and banner copy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: "hero",
                label: "Hero Section",
                desc: "Profile photo, headline, introduction, and dynamic highlight metrics",
                hasCustomText: false,
              },
              {
                id: "about",
                label: "About Me Teaser",
                desc: "Short story summary and core focus tags",
                hasCustomText: true,
                defaultHeading: "Bridging Design, Code, and Analytics",
                defaultSubheading: "About Me",
              },
              {
                id: "skills",
                label: "Featured Skills Matrix",
                desc: "Top skill categories and animated proficiency meters",
                hasCustomText: true,
                defaultHeading: "Technical Mastery",
                defaultSubheading: "Competencies",
              },
              {
                id: "projects",
                label: "Featured Projects Grid",
                desc: "Selected case study cards with live preview demo links",
                hasCustomText: true,
                defaultHeading: "Featured Case Studies",
                defaultSubheading: "Selected Works",
              },
              {
                id: "experience",
                label: "Experience & Timeline Section",
                desc: "Employment track or adaptive practical learning milestones",
                hasCustomText: true,
                defaultHeading: "Professional Milestones",
                defaultSubheading: "Career Track",
              },
              {
                id: "contact",
                label: "Bottom Contact CTA Banner",
                desc: "Eye-catching collaboration invitation banner",
                hasCustomText: true,
                defaultHeading: "Interested in Collaborating?",
                defaultSubheading:
                  "Whether you have a job opportunity, consulting engagement, or technical inquiry, my inbox is always open.",
              },
            ].map((sec) => {
              const secConf = settings?.sectionsConfig?.[sec.id] || { isVisible: true };
              const isVisible = secConf.isVisible ?? true;

              return (
                <div
                  key={sec.id}
                  className="p-3.5 rounded-lg border bg-card/60 space-y-3 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{sec.label}</p>
                      <p className="text-xs text-muted-foreground">{sec.desc}</p>
                    </div>
                    <Switch
                      checked={isVisible}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          sectionsConfig: {
                            ...settings.sectionsConfig,
                            [sec.id]: {
                              ...secConf,
                              isVisible: checked,
                            },
                          },
                        })
                      }
                    />
                  </div>

                  {isVisible && sec.hasCustomText && (
                    <div className="pt-2 border-t grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground uppercase font-semibold">
                          Custom Section Heading
                        </Label>
                        <Input
                          placeholder={sec.defaultHeading}
                          value={secConf.heading || ""}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              sectionsConfig: {
                                ...settings.sectionsConfig,
                                [sec.id]: {
                                  ...secConf,
                                  heading: e.target.value,
                                },
                              },
                            })
                          }
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground uppercase font-semibold">
                          Badge Text / Subtitle
                        </Label>
                        <Input
                          placeholder={sec.defaultSubheading}
                          value={secConf.subheading || ""}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              sectionsConfig: {
                                ...settings.sectionsConfig,
                                [sec.id]: {
                                  ...secConf,
                                  subheading: e.target.value,
                                },
                              },
                            })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Theme & Styling */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Theme Preferences & Accent Colors</CardTitle>
            <CardDescription>
              Dynamically customize the global brand accent color, default theme mode, and animations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Picker Component */}
            <DynamicThemeInjector color={settings?.accentColor || "#2563eb"} />
            <ColorPicker
              value={settings?.accentColor || "#2563eb"}
              onChange={(hex) => setSettings({ ...settings, accentColor: hex })}
              label="Primary Accent Color"
              description="Pick from curated presets or specify any custom HEX code. Updates buttons, highlights, badges, and focus rings."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-2">
                <Label>Default Theme</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={settings?.defaultTheme || "system"}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultTheme: e.target.value as any })
                  }
                >
                  <option value="system">System Preference</option>
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-sm font-medium">Enable Subtle Animations</p>
                  <p className="text-xs text-muted-foreground">Framer motion transitions</p>
                </div>
                <Switch
                  checked={settings?.enableAnimations ?? true}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableAnimations: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SKILLHUB Attribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SKILLHUB Platform Attribution</CardTitle>
            <CardDescription>
              Organization: {SKILLHUB_META.organization} &bull; Author: {SKILLHUB_META.author}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Display Footer Credit</p>
                <p className="text-xs text-muted-foreground">
                  Displays &quot;{SKILLHUB_META.brandCredit}&quot; in privacy/about footer
                </p>
              </div>
              <Switch
                checked={settings?.footerAttribution?.showBrandCredit ?? true}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    footerAttribution: {
                      ...settings.footerAttribution,
                      showBrandCredit: checked,
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
