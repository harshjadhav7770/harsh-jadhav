"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Loader2,
  Save,
  Sparkles,
  User,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Trash2,
  Plus,
  BarChart3,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CloudinaryUploader } from "@/components/ui/cloudinary-uploader";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        const json = await res.json();
        setProfile(json.profile || {});
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Error saving profile");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile & Hero Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your personal details, upload photo and resume to Cloudinary, and adjust display settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Core Information</CardTitle>
            <CardDescription>Your name, professional title, and primary contact info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prof-name">Full Name *</Label>
                <Input
                  id="prof-name"
                  value={profile?.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prof-title">Professional Title *</Label>
                <Input
                  id="prof-title"
                  value={profile?.professionalTitle || ""}
                  onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prof-email">Contact Email</Label>
                <Input
                  id="prof-email"
                  type="email"
                  value={profile?.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prof-phone">Phone / Mobile</Label>
                <Input
                  id="prof-phone"
                  value={profile?.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prof-loc">Location</Label>
                <Input
                  id="prof-loc"
                  value={profile?.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prof-status">Availability Status</Label>
                <Input
                  id="prof-status"
                  placeholder="e.g. Available for full-time roles"
                  value={profile?.availabilityStatus || ""}
                  onChange={(e) => setProfile({ ...profile, availabilityStatus: e.target.value })}
                />
              </div>

              {/* Resume Document Upload Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prof-resume">Resume (PDF / Document)</Label>
                  <CloudinaryUploader
                    accept=".pdf,.doc,.docx"
                    buttonText="Upload Resume PDF"
                    icon="file"
                    assetType="document"
                    onUploadComplete={(url) => {
                      setProfile({ ...profile, resumeUrl: url });
                      toast.success("Resume uploaded! Click Save to apply.");
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="prof-resume"
                    placeholder="https://..."
                    value={profile?.resumeUrl || ""}
                    onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                  />
                  {profile?.resumeUrl && (
                    <Button asChild variant="outline" size="icon" className="shrink-0 h-9 w-9">
                      <a href={profile.resumeUrl} target="_blank" rel="noreferrer" title="Preview Resume">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section & Profile Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Homepage Hero Customization & Photo</CardTitle>
            <CardDescription>Headline, introduction, typing words, and Cloudinary profile photo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prof-headline">Hero Main Headline *</Label>
              <Input
                id="prof-headline"
                value={profile?.heroHeadline || ""}
                onChange={(e) => setProfile({ ...profile, heroHeadline: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prof-intro">Hero Introduction Paragraph *</Label>
              <Textarea
                id="prof-intro"
                rows={3}
                value={profile?.heroIntroduction || ""}
                onChange={(e) => setProfile({ ...profile, heroIntroduction: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prof-typing">Typing Effect Words (comma-separated)</Label>
              <Input
                id="prof-typing"
                placeholder="Full-Stack Developer, Data Analyst, React & Next.js"
                value={profile?.typingWords ? profile.typingWords.join(", ") : ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    typingWords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </div>

            {/* Profile Photo Upload to Cloudinary */}
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profile Picture</Label>
                  <p className="text-xs text-muted-foreground">Upload your portrait photo directly to Cloudinary</p>
                </div>
                <CloudinaryUploader
                  accept="image/*"
                  buttonText="Upload Photo to Cloudinary"
                  icon="image"
                  assetType="profile"
                  onUploadComplete={(url, publicId) => {
                    setProfile({
                      ...profile,
                      profileImageUrl: url,
                      profileImagePublicId: publicId,
                    });
                    toast.success("Profile photo uploaded! Click Save to apply.");
                  }}
                />
              </div>

              <div className="flex items-center gap-4">
                {profile?.profileImageUrl ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border shadow-sm shrink-0 group">
                    <img
                      src={profile.profileImageUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          profileImageUrl: "",
                          profileImagePublicId: "",
                        })
                      }
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      title="Remove Photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border border-dashed flex items-center justify-center text-muted-foreground shrink-0 bg-muted/20">
                    <ImageIcon className="h-6 w-6 opacity-40" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="https://res.cloudinary.com/..."
                    value={profile?.profileImageUrl || ""}
                    onChange={(e) => setProfile({ ...profile, profileImageUrl: e.target.value })}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Or paste any existing Cloudinary image URL above.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs">Image Placement Position</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={profile?.heroImagePosition || "right"}
                    onChange={(e) =>
                      setProfile({ ...profile, heroImagePosition: e.target.value as any })
                    }
                  >
                    <option value="right">Right (Standard Layout)</option>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-5">
                  <div className="space-y-0.5">
                    <Label className="text-xs">Show Photo in Hero</Label>
                    <p className="text-[11px] text-muted-foreground">Toggle visibility of photo</p>
                  </div>
                  <Switch
                    checked={profile?.isHeroImageVisible ?? true}
                    onCheckedChange={(checked) =>
                      setProfile({ ...profile, isHeroImageVisible: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics & Highlight Statistics */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Key Metrics & Highlight Statistics</CardTitle>
                <CardDescription>
                  Prominent counters displayed on your homepage hero (e.g. 10+ Completed Projects, 15+ Technologies Mastered, 99% Code Quality)
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const defaults = [
                      { label: "Completed Projects", value: "10+", order: 1 },
                      { label: "Technologies Mastered", value: "15+", order: 2 },
                      { label: "Code Quality & Tests", value: "99%", order: 3 },
                    ];
                    setProfile({ ...profile, highlightStats: defaults });
                    toast.info("Reset metrics to standard portfolio defaults");
                  }}
                  className="gap-1.5 text-xs h-8"
                  title="Reset to standard defaults"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Defaults
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const current = profile?.highlightStats || [];
                    setProfile({
                      ...profile,
                      highlightStats: [
                        ...current,
                        {
                          label: "New Metric",
                          value: "100%",
                          order: current.length + 1,
                        },
                      ],
                    });
                  }}
                  className="gap-1.5 text-xs h-8"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Metric
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!profile?.highlightStats || profile.highlightStats.length === 0) ? (
              <div className="text-center py-6 border border-dashed rounded-lg text-sm text-muted-foreground space-y-2">
                <p>No highlight metrics configured. Click &quot;Add Metric&quot; or &quot;Reset Defaults&quot; to show counters on your homepage hero.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.highlightStats.map((stat: any, index: number) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-lg border bg-card/60 hover:bg-card transition-colors flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                  >
                    <div className="w-full sm:w-32 space-y-1">
                      <Label className="text-[11px] text-muted-foreground uppercase font-semibold">
                        Value (Number)
                      </Label>
                      <Input
                        value={stat.value || ""}
                        placeholder="e.g. 10+, 99%"
                        onChange={(e) => {
                          const updated = [...profile.highlightStats];
                          updated[index] = { ...updated[index], value: e.target.value };
                          setProfile({ ...profile, highlightStats: updated });
                        }}
                        className="font-bold text-base h-9"
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <Label className="text-[11px] text-muted-foreground uppercase font-semibold">
                        Metric Description / Label
                      </Label>
                      <Input
                        value={stat.label || ""}
                        placeholder="e.g. Completed Projects, Technologies Mastered"
                        onChange={(e) => {
                          const updated = [...profile.highlightStats];
                          updated[index] = { ...updated[index], label: e.target.value };
                          setProfile({ ...profile, highlightStats: updated });
                        }}
                        className="h-9"
                      />
                    </div>

                    <div className="w-20 space-y-1">
                      <Label className="text-[11px] text-muted-foreground uppercase font-semibold">
                        Order
                      </Label>
                      <Input
                        type="number"
                        value={stat.order ?? index + 1}
                        onChange={(e) => {
                          const updated = [...profile.highlightStats];
                          updated[index] = { ...updated[index], order: parseInt(e.target.value) || 0 };
                          setProfile({ ...profile, highlightStats: updated });
                        }}
                        className="h-9 text-center"
                      />
                    </div>

                    <div className="sm:pt-5 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive hover:bg-destructive/10"
                        title="Remove Metric"
                        onClick={() => {
                          const updated = profile.highlightStats.filter((_: any, i: number) => i !== index);
                          setProfile({ ...profile, highlightStats: updated });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Live Preview on Admin Page */}
            {profile?.highlightStats?.length > 0 && (
              <div className="mt-4 pt-4 border-t space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Hero Section Live Preview
                </span>
                <div className="p-4 rounded-xl border bg-muted/30 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {profile.highlightStats.map((st: any, idx: number) => (
                    <div key={idx} className="space-y-0.5">
                      <p className="text-2xl font-extrabold text-foreground">{st.value || "-"}</p>
                      <p className="text-xs text-muted-foreground">{st.label || "Untitled Metric"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
