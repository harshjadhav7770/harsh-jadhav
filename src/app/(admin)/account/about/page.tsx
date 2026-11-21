"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  GraduationCap,
  BookOpen,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminAboutPage() {
  const [about, setAbout] = useState<any>(null);
  const [educationList, setEducationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New education modal state
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [newEdu, setNewEdu] = useState({
    degree: "",
    fieldOfStudy: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    gradeOrCgpa: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const [aboutRes, eduRes] = await Promise.all([
        fetch("/api/admin/about"),
        fetch("/api/admin/education"),
      ]);
      const aboutJson = await aboutRes.json();
      const eduJson = await eduRes.json();
      setAbout(aboutJson.about || {});
      setEducationList(eduJson.education || []);
    } catch (err) {
      console.error("Failed to load about data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
      toast.success("About details updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateEducation = async () => {
    if (!newEdu.degree || !newEdu.institution || !newEdu.startDate) {
      toast.error("Please fill in degree, institution, and start date.");
      return;
    }
    try {
      const res = await fetch("/api/admin/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEdu),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to add education");
      toast.success("Education entry added!");
      setIsEduModalOpen(false);
      setNewEdu({
        degree: "",
        fieldOfStudy: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        gradeOrCgpa: "",
        description: "",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Error adding education");
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/education?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Education entry removed");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Error deleting");
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
        <h1 className="text-2xl font-bold tracking-tight">About, Education & Learning Approach</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your biography, learning philosophy, education credentials, and public visibility controls.
        </p>
      </div>

      <form onSubmit={handleSaveAbout} className="space-y-6">
        {/* Biography */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Professional Biography</CardTitle>
            <CardDescription>Main biography and secondary narrative shown on the About page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio-main">Primary Biography *</Label>
              <Textarea
                id="bio-main"
                rows={4}
                value={about?.biography || ""}
                onChange={(e) => setAbout({ ...about, biography: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio-sec">Secondary Story / Interests Note</Label>
              <Textarea
                id="bio-sec"
                rows={2}
                value={about?.secondaryBio || ""}
                onChange={(e) => setAbout({ ...about, secondaryBio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio-interests">Interests (comma-separated)</Label>
              <Input
                id="bio-interests"
                value={about?.interests ? about.interests.join(", ") : ""}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    interests: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Public Field Visibility Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information Privacy Controls</CardTitle>
            <CardDescription>
              Control which personal details are publicly visible on the About and Contact sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show Email Address Publicly</p>
                <p className="text-xs text-muted-foreground">Expose email link in contact & about</p>
              </div>
              <Switch
                checked={about?.publicFieldToggles?.showEmail ?? true}
                onCheckedChange={(checked) =>
                  setAbout({
                    ...about,
                    publicFieldToggles: { ...about.publicFieldToggles, showEmail: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show Mobile / Phone Number Publicly</p>
                <p className="text-xs text-muted-foreground">Expose phone number publicly</p>
              </div>
              <Switch
                checked={about?.publicFieldToggles?.showPhone ?? false}
                onCheckedChange={(checked) =>
                  setAbout({
                    ...about,
                    publicFieldToggles: { ...about.publicFieldToggles, showPhone: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show Geographic Location</p>
                <p className="text-xs text-muted-foreground">Display city / state / country</p>
              </div>
              <Switch
                checked={about?.publicFieldToggles?.showLocation ?? true}
                onCheckedChange={(checked) =>
                  setAbout({
                    ...about,
                    publicFieldToggles: { ...about.publicFieldToggles, showLocation: checked },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Learning Approach */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Learning Approach</CardTitle>
            <CardDescription>Describe your engineering mindset and practical continuous learning methodology</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Learning Philosophy</Label>
              <Textarea
                rows={2}
                value={about?.learningApproach?.philosophy || ""}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    learningApproach: {
                      ...about.learningApproach,
                      philosophy: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Practical Learning Process</Label>
              <Textarea
                rows={2}
                value={about?.learningApproach?.practicalProcess || ""}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    learningApproach: {
                      ...about.learningApproach,
                      practicalProcess: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Problem-Solving Approach</Label>
              <Textarea
                rows={2}
                value={about?.learningApproach?.problemSolving || ""}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    learningApproach: {
                      ...about.learningApproach,
                      problemSolving: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Project-Based Learning & Continuous Growth</Label>
              <Textarea
                rows={2}
                value={about?.learningApproach?.projectBased || ""}
                onChange={(e) =>
                  setAbout({
                    ...about,
                    learningApproach: {
                      ...about.learningApproach,
                      projectBased: e.target.value,
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
            Save Biography & Learning Approach
          </Button>
        </div>
      </form>

      {/* Education Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Education History</CardTitle>
            <CardDescription>Academic degrees, certifications, and institutions</CardDescription>
          </div>

          <Dialog open={isEduModalOpen} onOpenChange={setIsEduModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Degree
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Education Credential</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1">
                  <Label className="text-xs">Degree / Certification *</Label>
                  <Input
                    placeholder="e.g. Bachelor of Technology (B.Tech)"
                    value={newEdu.degree}
                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Field of Study *</Label>
                  <Input
                    placeholder="e.g. Computer Science and Engineering"
                    value={newEdu.fieldOfStudy}
                    onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Institution *</Label>
                  <Input
                    placeholder="e.g. Pune University"
                    value={newEdu.institution}
                    onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Start Date *</Label>
                    <Input
                      placeholder="e.g. Aug 2020"
                      value={newEdu.startDate}
                      onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End Date</Label>
                    <Input
                      placeholder="e.g. Jun 2024"
                      value={newEdu.endDate}
                      onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Grade / CGPA (Optional)</Label>
                  <Input
                    placeholder="e.g. 8.8 CGPA or First Class"
                    value={newEdu.gradeOrCgpa}
                    onChange={(e) => setNewEdu({ ...newEdu, gradeOrCgpa: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEduModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEducation}>Save Credential</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {educationList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No education entries added yet.
            </p>
          ) : (
            <div className="divide-y border rounded-md">
              {educationList.map((edu) => (
                <div key={edu._id} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm">{edu.degree} - {edu.fieldOfStudy}</p>
                    <p className="text-xs text-muted-foreground">
                      {edu.institution} &bull; {edu.startDate} - {edu.endDate || "Present"}
                      {edu.gradeOrCgpa ? ` (${edu.gradeOrCgpa})` : ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteEducation(edu._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
