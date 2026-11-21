"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Share2, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    platform: "",
    url: "",
    iconName: "Globe",
    order: 0,
  });

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/admin/social-links");
      const json = await res.json();
      setLinks(json.links || []);
    } catch (err) {
      console.error("Failed to load social links:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreate = async () => {
    if (!newLink.platform || !newLink.url) {
      toast.error("Please provide platform name and URL");
      return;
    }
    try {
      const res = await fetch("/api/admin/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newLink, order: links.length + 1 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
      toast.success("Social link added!");
      setIsModalOpen(false);
      setNewLink({ platform: "", url: "", iconName: "Globe", order: 0 });
      fetchLinks();
    } catch (err: any) {
      toast.error(err.message || "Failed to add link");
    }
  };

  const handleToggle = async (link: any) => {
    try {
      const res = await fetch("/api/admin/social-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: link._id, isVisible: !link.isVisible }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      fetchLinks();
    } catch (err: any) {
      toast.error(err.message || "Update error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/social-links?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Link deleted");
      fetchLinks();
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
          <h1 className="text-2xl font-bold tracking-tight">Social Media & Profiles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage links to LinkedIn, GitHub, X, personal portfolio, or custom external platforms.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Platform
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>New Social Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label className="text-xs">Platform Name *</Label>
                <Input
                  placeholder="e.g. LinkedIn, GitHub, Kaggle"
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Profile URL *</Label>
                <Input
                  placeholder="https://..."
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Save Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configured Platforms ({links.length})</CardTitle>
          <CardDescription>Social icons rendered on your header and footer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y border rounded-md">
            {links.map((link) => (
              <div key={link._id} className="p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-semibold text-sm truncate">{link.platform}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 truncate"
                    >
                      {link.url} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={link.isVisible}
                      onCheckedChange={() => handleToggle(link)}
                    />
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {link.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={() => handleDelete(link._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
