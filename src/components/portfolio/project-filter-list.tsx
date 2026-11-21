"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, ArrowRight, FolderGit2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function ProjectFilterList({
  initialCategories,
  initialProjects,
}: {
  initialCategories: any[];
  initialProjects: any[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProjects = initialProjects.filter((project) => {
    const matchesCategory =
      selectedCategory === "all" ||
      project.categoryId?._id === selectedCategory ||
      project.categoryId === selectedCategory;

    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.technologies || []).some((t: string) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Category Pills and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Dynamic Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="rounded-full text-xs"
            >
              All Projects ({initialProjects.length})
            </Button>
          </motion.div>

          {initialCategories.map((cat) => (
            <motion.div key={cat._id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={selectedCategory === cat._id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat._id)}
                className="rounded-full text-xs"
              >
                {cat.name}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Animated Projects Grid */}
      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center border rounded-xl bg-card text-muted-foreground space-y-2"
        >
          <FolderGit2 className="h-10 w-10 mx-auto opacity-40" />
          <p className="font-semibold text-foreground text-sm">No matching projects found</p>
          <p className="text-xs">Try selecting a different category or clearing the search query.</p>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card className="flex flex-col h-full overflow-hidden group hover:shadow-xl transition-shadow duration-300 border-border">
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
                    {proj.isFeatured && (
                      <Badge className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] gap-1 shadow">
                        <Star className="h-3 w-3 fill-current" /> Featured
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      <Link href={`/projects/${proj.slug}`}>{proj.title}</Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs mt-1">
                      {proj.shortDescription}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between">
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(proj.technologies || []).slice(0, 4).map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-muted text-[11px] font-medium text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {(proj.technologies || []).length > 4 && (
                        <span className="text-[10px] text-muted-foreground self-center">
                          +{(proj.technologies || []).length - 4}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t mt-4">
                      <Button asChild variant="ghost" size="sm" className="gap-1 text-primary text-xs h-8">
                        <Link href={`/projects/${proj.slug}`}>
                          Details <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>

                      <div className="flex items-center gap-1.5">
                        {proj.sourceUrl && (
                          <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1">
                            <a href={proj.sourceUrl} target="_blank" rel="noreferrer">
                              Code
                            </a>
                          </Button>
                        )}
                        {proj.liveUrl && (
                          <Button asChild variant="default" size="sm" className="h-8 text-xs gap-1">
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer">
                              Live <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
