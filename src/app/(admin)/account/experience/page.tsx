"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    employmentType: "Full-time" as any,
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    responsibilitiesText: "",
    technologiesText: "",
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/experience");
      const json = await res.json();
      setExperiences(json.experiences || []);
    } catch (err) {
      console.error("Failed to load experience:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!form.companyName || !form.jobTitle || !form.startDate) {
      toast.error("Please fill in company name, job title, and start date.");
      return;
    }

    const responsibilities = form.responsibilitiesText
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const technologies = form.technologiesText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName,
          jobTitle: form.jobTitle,
          employmentType: form.employmentType,
          location: form.location,
          startDate: form.startDate,
          endDate: form.isCurrent ? undefined : form.endDate,
          isCurrent: form.isCurrent,
          responsibilities,
          technologies,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      toast.success("Experience record added!");
      setIsModalOpen(false);
      setForm({
        companyName: "",
        jobTitle: "",
        employmentType: "Full-time",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        responsibilitiesText: "",
        technologiesText: "",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add experience");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/experience?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Experience removed");
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Experience & Career History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage professional roles, achievements, and responsibilities.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Career Experience</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label className="text-xs">Company / Organization *</Label>
                <Input
                  placeholder="e.g. Acme Corporation"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Job Title *</Label>
                <Input
                  placeholder="e.g. Data Analyst or Frontend Engineer"
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Employment Type</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.employmentType}
                    onChange={(e) => setForm({ ...form, employmentType: e.target.value as any })}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Location</Label>
                  <Input
                    placeholder="e.g. Remote / Bangalore"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Start Date *</Label>
                  <Input
                    placeholder="e.g. Jan 2023"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End Date</Label>
                  <Input
                    placeholder="e.g. Present"
                    disabled={form.isCurrent}
                    value={form.isCurrent ? "Present" : form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Switch
                  checked={form.isCurrent}
                  onCheckedChange={(checked) => setForm({ ...form, isCurrent: checked })}
                />
                <Label className="text-xs">I am currently working here</Label>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Responsibilities (one per line)</Label>
                <Textarea
                  rows={3}
                  placeholder="Designed automated ETL pipelines...&#10;Mentored junior analysts in Power BI modeling..."
                  value={form.responsibilitiesText}
                  onChange={(e) => setForm({ ...form, responsibilitiesText: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Technologies Used (comma-separated)</Label>
                <Input
                  placeholder="Python, SQL, Power BI, Docker"
                  value={form.technologiesText}
                  onChange={(e) => setForm({ ...form, technologiesText: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Save Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fresher Adaptive Notice */}
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="p-4 flex items-start gap-3 text-xs text-blue-800 dark:text-blue-300">
          <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
          <div>
            <p className="font-semibold">Fresher-Friendly Adaptive Public Page Enabled</p>
            <p className="mt-0.5 opacity-90">
              If you haven&apos;t added any corporate employment records, your public <strong>/experience</strong> page will automatically present your academic projects, practical certifications, technical achievements, and learning journey so your profile never looks empty!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Experience List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Employment Records ({experiences.length})</CardTitle>
          <CardDescription>Roles shown on your public Experience timeline</CardDescription>
        </CardHeader>
        <CardContent>
          {experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No corporate experience added yet. The public page will show your fresher project milestones.
            </p>
          ) : (
            <div className="divide-y border rounded-md">
              {experiences.map((exp) => (
                <div key={exp._id} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{exp.jobTitle}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {exp.employmentType}
                      </Badge>
                    </div>
                    <p className="text-xs font-medium text-foreground">
                      {exp.companyName} {exp.location ? `&bull; ${exp.location}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate || "Present"}
                    </p>
                    {exp.responsibilities?.length > 0 && (
                      <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-0.5 pt-1">
                        {exp.responsibilities.slice(0, 3).map((r: string, i: number) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => handleDelete(exp._id)}
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
