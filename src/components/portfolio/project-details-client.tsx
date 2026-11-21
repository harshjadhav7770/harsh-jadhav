"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Github,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Maximize2,
  X,
  ArrowRight,
  FolderGit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function ProjectDetailsClient({
  project,
  relatedProjects = [],
}: {
  project: any;
  relatedProjects?: any[];
}) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<any | null>(null);

  const hasLiveUrl = !!project.liveUrl;
  const hasSourceUrl = !!project.sourceUrl;

  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="text-xs">
            {project.categoryId?.name || "General"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {project.projectType || "Personal Project"}
          </Badge>
          {project.isFeatured && (
            <Badge className="bg-amber-500 text-white text-xs">Featured</Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {project.title}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Action Buttons (Strictly displayed only if URLs exist) */}
        {(hasLiveUrl || hasSourceUrl) && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {hasLiveUrl && (
              <Button asChild size="lg" className="gap-2 shadow">
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> Live Project Demo
                </a>
              </Button>
            )}
            {hasSourceUrl && (
              <Button asChild variant="outline" size="lg" className="gap-2">
                <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" /> View Source Code
                </a>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Hero Media Banner */}
      {project.heroImageUrl && (
        <div className="rounded-2xl overflow-hidden border bg-muted shadow-md aspect-video sm:aspect-[21/9] w-full">
          <img
            src={project.heroImageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Overview & Problem / Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Complete Description */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">Project Overview</h2>
            <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {project.fullDescription}
            </div>
          </section>

          {/* Problem Statement & Proposed Solution */}
          {(project.problemStatement || project.solutionStatement) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {project.problemStatement && (
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-destructive/90">
                      The Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    {project.problemStatement}
                  </CardContent>
                </Card>
              )}

              {project.solutionStatement && (
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-primary">
                      The Engineered Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    {project.solutionStatement}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Key Features */}
          {project.keyFeatures?.length > 0 && (
            <section className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-bold tracking-tight">Key Features & Architecture</h2>
              <ul className="space-y-2">
                {project.keyFeatures.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Challenges & Learnings */}
          {project.challengesAndLearnings && (
            <section className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-bold tracking-tight">Challenges & Takeaways</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.challengesAndLearnings}
              </p>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Stack & Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <p className="font-semibold text-foreground mb-1.5">Technologies Used</p>
                <div className="flex flex-wrap gap-1.5">
                  {(project.technologies || []).map((t: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              {project.startDate && (
                <div className="border-t pt-3">
                  <p className="font-semibold text-foreground mb-1">Timeline</p>
                  <p className="text-muted-foreground">
                    {project.startDate} {project.endDate ? `– ${project.endDate}` : ""}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Screenshots Gallery with Lightbox */}
      {project.screenshots?.length > 0 && (
        <section className="space-y-4 pt-8 border-t">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Screenshots & Gallery</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Click any screenshot below to inspect high-resolution details.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.screenshots.map((s: any, idx: number) => (
              <div
                key={idx}
                onClick={() => setSelectedScreenshot(s)}
                className="group relative rounded-xl border overflow-hidden bg-card cursor-pointer hover:shadow-md transition-all"
              >
                <div className="aspect-video w-full bg-muted overflow-hidden relative">
                  <img
                    src={s.imageUrl}
                    alt={s.caption || `Screenshot ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-xs truncate">{s.caption}</p>
                  {s.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {s.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Dialog */}
          <Dialog
            open={!!selectedScreenshot}
            onOpenChange={(open) => !open && setSelectedScreenshot(null)}
          >
            <DialogContent className="max-w-4xl p-2 bg-background/95 backdrop-blur border">
              {selectedScreenshot && (
                <div className="space-y-2">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={selectedScreenshot.imageUrl}
                      alt={selectedScreenshot.caption}
                      className="max-h-[70vh] w-auto object-contain mx-auto"
                    />
                  </div>
                  <div className="p-2">
                    <h4 className="font-bold text-sm">{selectedScreenshot.caption}</h4>
                    {selectedScreenshot.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedScreenshot.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="space-y-6 pt-8 border-t">
          <h2 className="text-xl font-bold tracking-tight">Related Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProjects.map((rel: any) => (
              <Card key={rel._id} className="p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base hover:text-primary transition-colors">
                    <Link href={`/projects/${rel.slug}`}>{rel.title}</Link>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {rel.shortDescription}
                  </p>
                </div>
                <div className="pt-4 mt-2 border-t">
                  <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-primary p-0">
                    <Link href={`/projects/${rel.slug}`}>
                      View Case Study <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
