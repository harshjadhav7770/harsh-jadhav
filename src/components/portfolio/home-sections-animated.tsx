"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Code2, Sparkles, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export interface SectionDisplayConfig {
  isVisible?: boolean;
  heading?: string;
  subheading?: string;
  buttonText?: string;
}

export function AnimatedAboutSection({
  about,
  config,
}: {
  about: any;
  config?: SectionDisplayConfig;
}) {
  if (!about?.biography) return null;

  const heading = config?.heading || "Bridging Design, Code, and Analytics";
  const subheading = config?.subheading || "About Me";
  const buttonText = config?.buttonText || "Read Full Story & Education";

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="container mx-auto max-w-6xl px-4 sm:px-6"
    >
      <div className="rounded-2xl border bg-card p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              {subheading}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {heading}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed line-clamp-4">
              {about.biography}
            </p>
            <div className="pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/about">
                    {buttonText} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {about.interests?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-3 w-full md:w-72 bg-muted/30 p-5 rounded-xl border"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Core Focus Areas
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {about.interests.map((interest: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-card border text-xs font-medium text-foreground shadow-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

export function AnimatedFeaturedProjects({
  projects,
  config,
}: {
  projects: any[];
  config?: SectionDisplayConfig;
}) {
  if (!projects || projects.length === 0) return null;

  const heading = config?.heading || "Featured Case Studies";
  const subheading = config?.subheading || "Selected Works";
  const buttonText = config?.buttonText || "View All Projects";

  return (
    <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            {subheading}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {heading}
          </h2>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button asChild variant="outline" className="gap-1.5">
            <Link href="/projects">
              {buttonText} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj: any, idx: number) => (
          <motion.div
            key={proj._id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 border-border flex flex-col h-full">
              <div className="aspect-video w-full bg-muted relative overflow-hidden">
                {proj.heroImageUrl ? (
                  <img
                    src={proj.heroImageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <FolderGit2 className="h-12 w-12 opacity-30" />
                  </div>
                )}
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs shadow">
                  {proj.categoryId?.name || "Project"}
                </Badge>
              </div>

              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  <Link href={`/projects/${proj.slug}`}>{proj.title}</Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm mt-1">
                  {proj.shortDescription}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between">
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(proj.technologies || []).slice(0, 4).map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-6 flex items-center justify-between border-t mt-6">
                  <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
                    <Link href={`/projects/${proj.slug}`}>
                      Case Study <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>

                  <div className="flex items-center gap-2">
                    {proj.liveUrl && (
                      <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs">
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer">
                          Live Demo <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function AnimatedSkillsSection({
  categories,
  skills,
  config,
}: {
  categories: any[];
  skills: any[];
  config?: SectionDisplayConfig;
}) {
  if (!categories || categories.length === 0) return null;

  const heading = config?.heading || "Technical Mastery";
  const subheading = config?.subheading || "Competencies";
  const buttonText = config?.buttonText || "Explore All Skills";

  return (
    <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            {subheading}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {heading}
          </h2>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button asChild variant="outline" className="gap-1.5">
            <Link href="/skills">
              {buttonText} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
        {categories.map((cat: any, idx: number) => {
          const catSkills = skills.filter(
            (s: any) => s.categoryId?.toString() === cat._id.toString()
          );
          return (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.45 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="break-inside-avoid mb-6 p-5 sm:p-6 rounded-2xl border bg-card hover:border-primary/50 transition-colors space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-sm tracking-tight text-foreground">{cat.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border text-muted-foreground font-medium">
                  {catSkills.length} {catSkills.length === 1 ? "skill" : "skills"}
                </span>
              </div>
              <div className="space-y-2">
                {catSkills.map((sk: any) => (
                  <div
                    key={sk._id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/70 border border-border/50 hover:border-primary/40 transition-colors text-xs"
                  >
                    <span className="font-semibold text-foreground">{sk.name}</span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-medium px-2 py-0.5 bg-background border text-foreground/80 shadow-2xs"
                    >
                      {sk.proficiencyLevel || "Proficient"}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function AnimatedContactCta({
  config,
}: {
  config?: SectionDisplayConfig;
}) {
  const heading = config?.heading || "Interested in Collaborating?";
  const description =
    config?.subheading ||
    "Whether you have a job opportunity, consulting engagement, or technical inquiry, my inbox is always open.";
  const buttonText = config?.buttonText || "Send a Message";

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="container mx-auto max-w-6xl px-4 sm:px-6"
    >
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {heading}
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
          {description}
        </p>
        <div className="pt-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg">
              <Link href="/contact">
                {buttonText} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
