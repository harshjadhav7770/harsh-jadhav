"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Wrench,
  Layers,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // New Skill Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    categoryId: "",
    proficiencyLevel: "Advanced",
    proficiencyPercent: 85,
    yearsOfExperience: 2,
    iconName: "Code",
  });

  const fetchData = async () => {
    try {
      const [catRes, skillRes] = await Promise.all([
        fetch("/api/admin/skill-categories"),
        fetch("/api/admin/skills"),
      ]);
      const catJson = await catRes.json();
      const skillJson = await skillRes.json();
      setCategories(catJson.categories || []);
      setSkills(skillJson.skills || []);
    } catch (err) {
      console.error("Failed to load skills data:", err);
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
      const res = await fetch("/api/admin/skill-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), order: categories.length + 1 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create category");
      toast.success("Category added!");
      setNewCatName("");
      setIsCatModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? Deleting this category will not delete skills assigned to it, but may hide them from that group.")) return;
    try {
      const res = await fetch(`/api/admin/skill-categories?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Category deleted");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Error deleting category");
    }
  };

  const handleCreateSkill = async () => {
    if (!newSkill.name.trim() || !newSkill.categoryId) {
      toast.error("Please provide skill name and select a category.");
      return;
    }
    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to add skill");
      toast.success("Skill added successfully!");
      setIsSkillModalOpen(false);
      setNewSkill({
        name: "",
        categoryId: categories[0]?._id || "",
        proficiencyLevel: "Advanced",
        proficiencyPercent: 85,
        yearsOfExperience: 2,
        iconName: "Code",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add skill");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Skill removed");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Error deleting skill");
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
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills & Categories Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Group technologies by dynamic categories, configure proficiency levels, and manage ordering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* New Category Button */}
          <Dialog open={isCatModalOpen} onOpenChange={setIsCatModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>New Skill Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label className="text-xs">Category Name *</Label>
                <Input
                  placeholder="e.g. Cloud & DevOps"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCatModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory}>Create Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* New Skill Button */}
          <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Technology
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Technology / Skill</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1">
                  <Label className="text-xs">Technology Name *</Label>
                  <Input
                    placeholder="e.g. Next.js, Python, Power BI"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Category *</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={newSkill.categoryId}
                    onChange={(e) => setNewSkill({ ...newSkill, categoryId: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Proficiency Level</Label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                      value={newSkill.proficiencyLevel}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, proficiencyLevel: e.target.value })
                      }
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Proficiency % (0-100)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={newSkill.proficiencyPercent}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, proficiencyPercent: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Years of Experience</Label>
                  <Input
                    type="number"
                    min={0}
                    value={newSkill.yearsOfExperience}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, yearsOfExperience: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSkillModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSkill}>Save Technology</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Skills Grouped by Category */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categorySkills = skills.filter((s) => s.categoryId?._id === category._id || s.categoryId === category._id);
          return (
            <Card key={category._id}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold">{category.name}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {categorySkills.length} skills
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {categorySkills.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2 italic">
                    No skills assigned to this category yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categorySkills.map((sk) => (
                      <div
                        key={sk._id}
                        className="p-3 rounded-md border bg-card flex items-center justify-between gap-3 shadow-sm"
                      >
                        <div className="space-y-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{sk.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{sk.proficiencyLevel}</span>
                            <span>&bull;</span>
                            <span>{sk.proficiencyPercent}%</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteSkill(sk._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
