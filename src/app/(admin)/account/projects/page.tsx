"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  FolderGit2,
  ExternalLink,
  Layers,
  Star,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CloudinaryUploader } from "@/components/ui/cloudinary-uploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminProjectsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // New/Edit Project Modal
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [projForm, setProjForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    problemStatement: "",
    solutionStatement: "",
    technologiesText: "",
    categoryId: "",
    projectType: "Personal" as any,
    heroImageUrl: "",
    liveUrl: "",
    sourceUrl: "",
    isFeatured: false,
    isPublished: true,
    screenshotsText: "", // JSON or line-separated imageUrl|caption
  });

  const fetchData = async () => {
    try {
      const [catRes, projRes] = await Promise.all([
        fetch("/api/admin/project-categories"),
        fetch("/api/admin/projects"),
      ]);
      const catJson = await catRes.json();
      const projJson = await projRes.json();
      setCategories(catJson.categories || []);
      setProjects(projJson.projects || []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const res = await fetch("/api/admin/project-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), order: categories.length + 1 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to add category");
      toast.success("Project category created!");
      setNewCatName("");
      setIsCatModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add category");
    }
  };

  const handleSaveProject = async () => {
    if (!projForm.title.trim() || !projForm.shortDescription || !projForm.fullDescription) {
      toast.error("Please fill in project title and descriptions.");
      return;
    }
    if (!projForm.categoryId && categories.length > 0) {
      projForm.categoryId = categories[0]._id;
    }

    const technologies = projForm.technologiesText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Parse screenshots
    const screenshots = projForm.screenshotsText
      ? projForm.screenshotsText
          .split("\n")
          .map((line, idx) => {
            const parts = line.split("|");
            return {
              imageUrl: parts[0]?.trim() || "",
              caption: parts[1]?.trim() || `Screenshot ${idx + 1}`,
              order: idx + 1,
            };
          })
          .filter((s) => s.imageUrl.length > 0)
      : [];

    const payload: any = {
      title: projForm.title,
      slug: projForm.slug || slugify(projForm.title),
      shortDescription: projForm.shortDescription,
      fullDescription: projForm.fullDescription,
      problemStatement: projForm.problemStatement || undefined,
      solutionStatement: projForm.solutionStatement || undefined,
      technologies,
      categoryId: projForm.categoryId || categories[0]?._id,
      projectType: projForm.projectType,
      heroImageUrl: projForm.heroImageUrl || undefined,
      liveUrl: projForm.liveUrl || undefined,
      sourceUrl: projForm.sourceUrl || undefined,
      isFeatured: projForm.isFeatured,
      isPublished: projForm.isPublished,
      screenshots,
    };

    try {
      let res;
      if (editingProjId) {
        res = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editingProjId, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      toast.success(editingProjId ? "Project updated!" : "Project created!");
      setIsProjModalOpen(false);
      resetProjForm();
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save project");
    }
  };

  const resetProjForm = () => {
    setEditingProjId(null);
    setProjForm({
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      problemStatement: "",
      solutionStatement: "",
      technologiesText: "",
      categoryId: categories[0]?._id || "",
      projectType: "Personal",
      heroImageUrl: "",
      liveUrl: "",
      sourceUrl: "",
      isFeatured: false,
      isPublished: true,
      screenshotsText: "",
    });
  };

  const openEditModal = (proj: any) => {
    setEditingProjId(proj._id);
    const screenshotsText = (proj.screenshots || [])
      .map((s: any) => `${s.imageUrl}|${s.caption}`)
      .join("\n");

    setProjForm({
      title: proj.title,
      slug: proj.slug,
      shortDescription: proj.shortDescription,
      fullDescription: proj.fullDescription,
      problemStatement: proj.problemStatement || "",
      solutionStatement: proj.solutionStatement || "",
      technologiesText: (proj.technologies || []).join(", "),
      categoryId: proj.categoryId?._id || proj.categoryId,
      projectType: proj.projectType || "Personal",
      heroImageUrl: proj.heroImageUrl || "",
      liveUrl: proj.liveUrl || "",
      sourceUrl: proj.sourceUrl || "",
      isFeatured: proj.isFeatured || false,
      isPublished: proj.isPublished ?? true,
      screenshotsText,
    });
    setIsProjModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Project deleted");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Error deleting project");
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
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, organize case studies, screenshots, live demos, and dynamic categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Category Dialog */}
          <Dialog open={isCatModalOpen} onOpenChange={setIsCatModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>New Project Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label className="text-xs">Category Name *</Label>
                <Input
                  placeholder="e.g. Power BI, Full Stack, Mobile"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCatModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add/Edit Project Dialog */}
          <Dialog
            open={isProjModalOpen}
            onOpenChange={(open) => {
              setIsProjModalOpen(open);
              if (!open) resetProjForm();
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProjId ? "Edit Project Details" : "Create New Case Study"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Project Title *</Label>
                    <Input
                      placeholder="e.g. Sales Performance Dashboard"
                      value={projForm.title}
                      onChange={(e) =>
                        setProjForm({
                          ...projForm,
                          title: e.target.value,
                          slug: editingProjId ? projForm.slug : slugify(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">URL Slug *</Label>
                    <Input
                      placeholder="e.g. sales-performance-dashboard"
                      value={projForm.slug}
                      onChange={(e) => setProjForm({ ...projForm, slug: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Category *</Label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                      value={projForm.categoryId}
                      onChange={(e) => setProjForm({ ...projForm, categoryId: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Project Type</Label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                      value={projForm.projectType}
                      onChange={(e) =>
                        setProjForm({ ...projForm, projectType: e.target.value as any })
                      }
                    >
                      <option value="Personal">Personal</option>
                      <option value="Client">Client</option>
                      <option value="Open Source">Open Source</option>
                      <option value="Academic">Academic</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Technologies (comma-separated) *</Label>
                  <Input
                    placeholder="e.g. Power BI, DAX, SQL, Python"
                    value={projForm.technologiesText}
                    onChange={(e) =>
                      setProjForm({ ...projForm, technologiesText: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Short Summary (Listing Card) *</Label>
                  <Textarea
                    rows={2}
                    placeholder="Brief 1-2 sentence overview of the project"
                    value={projForm.shortDescription}
                    onChange={(e) =>
                      setProjForm({ ...projForm, shortDescription: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Complete Description (Case Study Page) *</Label>
                  <Textarea
                    rows={4}
                    placeholder="In-depth narrative of objectives, architectural approach, and features..."
                    value={projForm.fullDescription}
                    onChange={(e) =>
                      setProjForm({ ...projForm, fullDescription: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Problem Statement</Label>
                    <Textarea
                      rows={2}
                      placeholder="What business challenge was addressed?"
                      value={projForm.problemStatement}
                      onChange={(e) =>
                        setProjForm({ ...projForm, problemStatement: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Proposed Solution</Label>
                    <Textarea
                      rows={2}
                      placeholder="How did your implementation solve it?"
                      value={projForm.solutionStatement}
                      onChange={(e) =>
                        setProjForm({ ...projForm, solutionStatement: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Hero Image</Label>
                    <CloudinaryUploader
                      accept="image/*"
                      buttonText="Upload Hero to Cloudinary"
                      icon="image"
                      assetType="hero"
                      onUploadComplete={(url) => {
                        setProjForm({ ...projForm, heroImageUrl: url });
                        toast.success("Hero image uploaded!");
                      }}
                    />
                  </div>
                  <Input
                    placeholder="https://res.cloudinary.com/..."
                    value={projForm.heroImageUrl}
                    onChange={(e) => setProjForm({ ...projForm, heroImageUrl: e.target.value })}
                  />
                  {projForm.heroImageUrl && (
                    <div className="relative w-28 h-16 rounded border overflow-hidden mt-1 group">
                      <img
                        src={projForm.heroImageUrl}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setProjForm({ ...projForm, heroImageUrl: "" })}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">
                      Screenshots (One per line: <code>imageUrl|caption</code>)
                    </Label>
                    <CloudinaryUploader
                      accept="image/*"
                      buttonText="Upload Screenshot"
                      icon="image"
                      assetType="project"
                      onUploadComplete={(url) => {
                        const newText = projForm.screenshotsText
                          ? `${projForm.screenshotsText}\n${url}|Screenshot`
                          : `${url}|Screenshot`;
                        setProjForm({ ...projForm, screenshotsText: newText });
                        toast.success("Screenshot added to project!");
                      }}
                    />
                  </div>
                  <Textarea
                    rows={3}
                    placeholder="https://res.cloudinary.com/...|Executive Overview&#10;https://res.cloudinary.com/...|Drill-down Analytics"
                    value={projForm.screenshotsText}
                    onChange={(e) =>
                      setProjForm({ ...projForm, screenshotsText: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Live URL (Optional)</Label>
                    <Input
                      placeholder="https://..."
                      value={projForm.liveUrl}
                      onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Source Code URL (Optional)</Label>
                    <Input
                      placeholder="https://github.com/..."
                      value={projForm.sourceUrl}
                      onChange={(e) => setProjForm({ ...projForm, sourceUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={projForm.isFeatured}
                      onCheckedChange={(checked) =>
                        setProjForm({ ...projForm, isFeatured: checked })
                      }
                    />
                    <Label className="text-xs">Feature on Homepage</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={projForm.isPublished}
                      onCheckedChange={(checked) =>
                        setProjForm({ ...projForm, isPublished: checked })
                      }
                    />
                    <Label className="text-xs">Published Publicly</Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsProjModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProject}>Save Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-16 text-center border rounded-lg bg-card text-muted-foreground">
            <FolderGit2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-foreground">No projects found</p>
            <p className="text-xs mt-1">Click &quot;Add Project&quot; above to create your first case study.</p>
          </div>
        ) : (
          projects.map((proj) => (
            <Card key={proj._id} className="flex flex-col overflow-hidden">
              <div className="aspect-video w-full bg-muted relative overflow-hidden">
                {proj.heroImageUrl ? (
                  <img
                    src={proj.heroImageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                  </div>
                )}
                {proj.isFeatured && (
                  <Badge className="absolute top-2 right-2 gap-1 bg-amber-500 text-white">
                    <Star className="h-3 w-3 fill-current" /> Featured
                  </Badge>
                )}
                {proj.isSampleData && (
                  <Badge variant="secondary" className="absolute top-2 left-2 text-[10px]">
                    Demo Data
                  </Badge>
                )}
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                    {proj.categoryId?.name || "General"}
                  </span>
                  <Badge variant={proj.isPublished ? "outline" : "secondary"} className="text-[10px]">
                    {proj.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                <CardTitle className="text-base line-clamp-1 mt-1">{proj.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {proj.shortDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-1 flex-1">
                <div className="flex flex-wrap gap-1 mt-2">
                  {(proj.technologies || []).slice(0, 4).map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {(proj.technologies || []).length > 4 && (
                    <span className="text-[10px] text-muted-foreground self-center">
                      +{(proj.technologies || []).length - 4} more
                    </span>
                  )}
                </div>
              </CardContent>
              <div className="p-4 pt-0 border-t flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => openEditModal(proj)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 h-8 w-8"
                  onClick={() => handleDeleteProject(proj._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
