"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Wrench,
  Briefcase,
  Mail,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await fetch("/api/admin/overview");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load dashboard overview:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const recentMessages = data?.recentMessages || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back. Monitor your portfolio status, update content, and review inquiries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4" /> View Live Site
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/account/projects">
              <PlusCircle className="h-4 w-4" /> Add Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Completeness Meter */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Portfolio Completeness</span>
            </div>
            <span className="font-bold text-sm text-primary">{metrics.completeness}%</span>
          </div>
          <Progress value={metrics.completeness} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {metrics.completeness >= 80
              ? "Great job! Your portfolio profile and project assets are comprehensive."
              : "Enhance your portfolio: upload your resume, add screenshots, and link your live projects."}
          </p>
        </CardContent>
      </Card>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Projects
            </CardTitle>
            <FolderGit2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProjects || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.publishedProjects || 0} published publicly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Skills Catalog
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSkills || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Categorized & displayed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Experience Entries
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalExperience || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Career & milestone roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Inquiries
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalMessages || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-semibold text-primary">{metrics.unreadMessages || 0}</span> unread messages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Inquiries</CardTitle>
              <CardDescription>Messages received via your public contact form</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/account/contact">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No contact messages received yet.
              </div>
            ) : (
              <div className="divide-y border rounded-md">
                {recentMessages.map((msg: any) => (
                  <div key={msg._id} className="p-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{msg.senderName}</span>
                        {!msg.isRead && (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-medium text-foreground truncate">{msg.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{msg.message}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {formatDate(msg.submittedAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Shortcuts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Shortcuts</CardTitle>
            <CardDescription>Common customization tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Button asChild variant="outline" className="w-full justify-start text-xs gap-2">
              <Link href="/account/profile">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Edit Hero Headline & Intro
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-xs gap-2">
              <Link href="/account/about">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Update Biography & Education
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-xs gap-2">
              <Link href="/account/skills">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Reorder & Add Skills
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-xs gap-2">
              <Link href="/account/media">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Upload New Project Screenshots
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-xs gap-2">
              <Link href="/account/settings">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Configure Themes & SEO
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
