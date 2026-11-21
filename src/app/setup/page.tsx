"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Database,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
  Globe,
  Terminal,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { SKILLHUB_META } from "@/lib/constants";
import { toast } from "sonner";

export default function SetupWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [dbError, setDbError] = useState<string>("");

  // Setup Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    portfolioType: "both" as "data-analytics" | "full-stack" | "both",
    installationType: "express" as "express" | "full",
    // Full setup optional overrides
    customProfile: {
      professionalTitle: "",
      heroHeadline: "",
      heroIntroduction: "",
      location: "",
      phone: "",
    },
    customAbout: {
      biography: "",
      interestsText: "",
    },
  });

  // Fetch initial setup status
  useEffect(() => {
    async function checkStatus() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/setup/status");
        const data = await res.json();

        if (data.isInstalled) {
          toast.info("Portfolio is already configured.");
          router.replace("/");
          return;
        }

        setEnvStatus(data.envCheck);
      } catch (err) {
        console.error("Failed to load setup status:", err);
      } finally {
        setIsLoading(false);
      }
    }
    checkStatus();
  }, [router]);

  // Test Database Connection
  const testDatabase = async () => {
    setDbStatus("testing");
    setDbError("");
    try {
      const res = await fetch("/api/setup/test-db", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setDbStatus("success");
        toast.success("MongoDB connected successfully!");
      } else {
        setDbStatus("error");
        setDbError(data.error || "Connection failed. Please check credentials.");
        toast.error("Database connection failed");
      }
    } catch {
      setDbStatus("error");
      setDbError("Network error while connecting to database.");
      toast.error("Database connection error");
    }
  };

  // Launch Installation
  const handleLaunch = async () => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        portfolioType: formData.portfolioType,
        installationType: formData.installationType,
      };

      if (formData.installationType === "full") {
        payload.customProfile = {
          professionalTitle: formData.customProfile.professionalTitle || undefined,
          heroHeadline: formData.customProfile.heroHeadline || undefined,
          heroIntroduction: formData.customProfile.heroIntroduction || undefined,
          location: formData.customProfile.location || undefined,
          phone: formData.customProfile.phone || undefined,
        };

        const interests = formData.customAbout.interestsText
          ? formData.customAbout.interestsText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined;

        payload.customAbout = {
          biography: formData.customAbout.biography || undefined,
          interests,
        };
      }

      const res = await fetch("/api/setup/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Installation failed");
      }

      toast.success("Portfolio successfully initialized!");
      setCurrentStep(8);
    } catch (err: any) {
      toast.error(err.message || "Failed to complete setup");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking setup environment...</p>
        </div>
      </div>
    );
  }

  const totalSteps = 8;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-foreground py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{SKILLHUB_META.organization}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Portfolio Installation Wizard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build your professional portfolio in a few simple steps &bull; Built by{" "}
            <a
              href={SKILLHUB_META.website}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {SKILLHUB_META.author}
            </a>
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        {/* ================= STEP 1: WELCOME ================= */}
        {currentStep === 1 && (
          <Card className="shadow-lg border-border">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <Layers className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Welcome to Your Portfolio Setup</CardTitle>
              <CardDescription>
                Designed exclusively for SKILLHUB candidates. Launch your dynamic, fully customizable portfolio CMS in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="p-4 rounded-lg bg-muted/60 text-sm space-y-2 border">
                <h4 className="font-semibold text-foreground">What this wizard does:</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Validates your MongoDB connection and environment secrets</li>
                  <li>Configures your specialization (Data Analytics, Full Stack, or Both)</li>
                  <li>Initializes your sole secure Administrator credentials</li>
                  <li>Seeds intelligent starter projects, skills, and case-studies</li>
                  <li>Locks setup permanently to protect your deployment</li>
                </ul>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                <span>Credit: {SKILLHUB_META.brandCredit}</span>
                <a
                  href={SKILLHUB_META.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold hover:underline"
                >
                  Visit SKILLHUB <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-4">
              <Button onClick={() => setCurrentStep(2)} className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ================= STEP 2: ENVIRONMENT CONFIG ================= */}
        {currentStep === 2 && (
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Environment Configuration
              </CardTitle>
              <CardDescription>
                We verify that your local or server environment variables are correctly loaded. Secrets are never exposed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-md border text-sm">
                  <div>
                    <p className="font-medium">SKILLHUB_MONGODB_URI</p>
                    <p className="text-xs text-muted-foreground">Database connection string</p>
                  </div>
                  {envStatus?.mongoUri ? (
                    <Badge variant="default" className="bg-emerald-600 gap-1 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Configured
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Missing
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border text-sm">
                  <div>
                    <p className="font-medium">SKILLHUB_AUTH_SECRET</p>
                    <p className="text-xs text-muted-foreground">JWT Session key (32+ chars)</p>
                  </div>
                  {envStatus?.authSecret ? (
                    <Badge variant="default" className="bg-emerald-600 gap-1 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Configured
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Missing
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border text-sm">
                  <div>
                    <p className="font-medium">SKILLHUB_CLOUDINARY_*</p>
                    <p className="text-xs text-muted-foreground">Cloudinary Media Storage (Mandatory)</p>
                  </div>
                  {envStatus?.cloudinary ? (
                    <Badge variant="default" className="bg-emerald-600 gap-1 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Configured
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Missing
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border text-sm">
                  <div>
                    <p className="font-medium">SKILLHUB_GMAIL_*</p>
                    <p className="text-xs text-muted-foreground">Contact Form Email SMTP (Optional)</p>
                  </div>
                  {envStatus?.email ? (
                    <Badge variant="default" className="bg-emerald-600 gap-1 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Configured
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Optional</Badge>
                  )}
                </div>
              </div>

              {(!envStatus?.mongoUri || !envStatus?.authSecret || !envStatus?.cloudinary) && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-semibold mb-1">Missing Required Variables!</p>
                  <p>
                    In local development, configure your <code>.env.local</code> file or run the interactive helper:
                  </p>
                  <code className="block mt-2 p-2 bg-black/10 dark:bg-black/30 rounded font-mono text-xs">
                    npm run setup:env
                  </code>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={!envStatus?.mongoUri || !envStatus?.authSecret || !envStatus?.cloudinary}
                className="gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ================= STEP 3: DATABASE CONNECTION ================= */}
        {currentStep === 3 && (
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Database Connectivity Test
              </CardTitle>
              <CardDescription>
                We test real-time communication with your MongoDB cluster before proceeding with data initialization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border flex flex-col items-center justify-center text-center py-8">
                {dbStatus === "idle" && (
                  <>
                    <Database className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium">Ready to test MongoDB connection</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                      Click the button below to ping your database instance.
                    </p>
                    <Button onClick={testDatabase} className="mt-4 gap-2">
                      Test Connection
                    </Button>
                  </>
                )}

                {dbStatus === "testing" && (
                  <>
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                    <p className="text-sm font-medium">Connecting to MongoDB...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Verifying authentication, cluster state, and network socket...
                    </p>
                  </>
                )}

                {dbStatus === "success" && (
                  <>
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 mb-3" />
                    <p className="text-sm font-semibold text-emerald-600">Connection Successful!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Database cluster is healthy and ready for initialization.
                    </p>
                    <Button variant="outline" size="sm" onClick={testDatabase} className="mt-3 gap-1">
                      <RefreshCw className="h-3.5 w-3.5" /> Re-test
                    </Button>
                  </>
                )}

                {dbStatus === "error" && (
                  <>
                    <AlertCircle className="h-10 w-10 text-destructive mb-3" />
                    <p className="text-sm font-semibold text-destructive">Connection Failed</p>
                    <p className="text-xs text-destructive/90 mt-1 max-w-sm">{dbError}</p>
                    <div className="mt-4 flex gap-2">
                      <Button onClick={testDatabase} variant="default" size="sm">
                        Retry Connection
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={() => setCurrentStep(4)}
                disabled={dbStatus !== "success"}
                className="gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ================= STEP 4: SELECT PORTFOLIO TYPE ================= */}
        {currentStep === 4 && (
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="text-lg">Select Portfolio Specialization</CardTitle>
              <CardDescription>
                What type of professional portfolio are you creating? This determines your initial starter projects and skill categories.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  id: "data-analytics",
                  title: "1. Data Analytics",
                  desc: "Focus on Power BI, SQL, Python, ETL, EDA, and business dashboards.",
                  badge: "Power BI & Analytics",
                },
                {
                  id: "full-stack",
                  title: "2. Full Stack Development",
                  desc: "Focus on Next.js, React, Node.js, TypeScript, REST APIs, and modern databases.",
                  badge: "Web & SaaS",
                },
                {
                  id: "both",
                  title: "3. Both (Full Stack & Data Analytics)",
                  desc: "Combines modern software engineering with end-to-end data analytics and dashboards.",
                  badge: "Comprehensive",
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() =>
                    setFormData({ ...formData, portfolioType: opt.id as any })
                  }
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.portfolioType === opt.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{opt.title}</h4>
                    <Badge variant={formData.portfolioType === opt.id ? "default" : "outline"}>
                      {opt.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setCurrentStep(5)} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ================= STEP 5: ADMINISTRATOR ACCOUNT ================= */}
        {currentStep === 5 && (
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Create Administrator Account
              </CardTitle>
              <CardDescription>
                This account will be the sole administrator with exclusive access to the portfolio CMS dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Full Name *</Label>
                <Input
                  id="admin-name"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email Address *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-mobile">Mobile Number</Label>
                  <Input
                    id="admin-mobile"
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-pass">Password *</Label>
                  <Input
                    id="admin-pass"
                    type="password"
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-confirm-pass">Confirm Password *</Label>
                  <Input
                    id="admin-confirm-pass"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="p-3 bg-muted/60 rounded-md text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Security Requirements:</p>
                <p>&bull; Password must be 8+ characters with uppercase, lowercase, and numeric digits.</p>
                <p>&bull; No public registration will be allowed after setup completes.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(4)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={() => {
                  if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
                    toast.error("Please fill in all required fields.");
                    return;
                  }
                  if (formData.password !== formData.confirmPassword) {
                    toast.error("Passwords do not match.");
                    return;
                  }
                  if (formData.password.length < 8) {
                    toast.error("Password must be at least 8 characters long.");
                    return;
                  }
                  setCurrentStep(6);
                }}
                className="gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ================= STEP 6: CHOOSE INSTALLATION TYPE ================= */}
        {currentStep === 6 && (
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="text-lg">Choose Installation Method</CardTitle>
              <CardDescription>
                Select how you would like to initialize your initial portfolio content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onClick={() =>
                  setFormData({ ...formData, installationType: "express" })
                }
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.installationType === "express"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Option A: Express Setup (Recommended)</h4>
                  <Badge variant={formData.installationType === "express" ? "default" : "outline"}>
                    Instant Launch
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically populates your portfolio with realistic, professional dummy projects, categories, and case studies tailored to your selection. You can customize or delete them anytime in the admin dashboard.
                </p>
              </div>

              <div
                onClick={() =>
                  setFormData({ ...formData, installationType: "full" })
                }
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.installationType === "full"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Option B: Full Setup</h4>
                  <Badge variant={formData.installationType === "full" ? "default" : "outline"}>
                    Custom Entry
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Optionally customize your personal headline, biography, and professional interests now before launching.
                </p>
              </div>

              {formData.installationType === "full" && (
                <div className="p-4 rounded-lg border bg-muted/40 space-y-3 mt-3 animate-in fade-in-50">
                  <h5 className="text-sm font-semibold">Custom Information (Optional - Skip if desired)</h5>
                  <div className="space-y-2">
                    <Label className="text-xs">Professional Title</Label>
                    <Input
                      placeholder="e.g. Senior Data Analyst"
                      value={formData.customProfile.professionalTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customProfile: {
                            ...formData.customProfile,
                            professionalTitle: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Location</Label>
                    <Input
                      placeholder="e.g. Pune, India"
                      value={formData.customProfile.location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customProfile: {
                            ...formData.customProfile,
                            location: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Professional Biography</Label>
                    <Textarea
                      placeholder="Share a short summary about your background and passion..."
                      rows={3}
                      value={formData.customAbout.biography}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customAbout: {
                            ...formData.customAbout,
                            biography: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Interests (comma-separated)</Label>
                    <Input
                      placeholder="Data Analytics, Cloud Architecture, Machine Learning"
                      value={formData.customAbout.interestsText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customAbout: {
                            ...formData.customAbout,
                            interestsText: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(5)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setCurrentStep(7)} className="gap-2">
                Review Summary <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ================= STEP 7: REVIEW INSTALLATION ================= */}
        {currentStep === 7 && (
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="text-lg">Review Setup Summary</CardTitle>
              <CardDescription>
                Confirm your configuration parameters before initializing your portfolio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 rounded-lg border divide-y text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Database Status:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Administrator:</span>
                  <span className="font-semibold">{formData.name} ({formData.email})</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Portfolio Track:</span>
                  <span className="font-semibold capitalize">
                    {formData.portfolioType.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Installation Mode:</span>
                  <span className="font-semibold capitalize">
                    {formData.installationType} Setup
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Initial Seed Data:</span>
                  <span className="font-semibold text-primary">Smart Demo Content Enabled</span>
                </div>
              </div>

              <div className="p-3 bg-muted/60 rounded-md text-xs text-muted-foreground">
                <p>
                  <strong>Note:</strong> Once you click &quot;Launch My Portfolio&quot;, the database lock will be applied, your admin account will be created, and this setup wizard will be permanently disabled.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(6)} disabled={isSubmitting}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleLaunch}
                disabled={isSubmitting}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Initializing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Launch My Portfolio
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ================= STEP 8: LAUNCH SUCCESS ================= */}
        {currentStep === 8 && (
          <Card className="shadow-lg border-border text-center py-6">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">Congratulations!</CardTitle>
              <CardDescription>
                Your professional portfolio is initialized and live.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md mx-auto text-sm text-muted-foreground">
              <p>
                Your portfolio CMS has been populated with intelligent starter content. You can manage, update, or remove any project, skill, or biography directly from the admin dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button
                  onClick={() => router.push("/account/dashboard")}
                  className="gap-2"
                >
                  <Shield className="h-4 w-4" /> Go to Admin Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="gap-2"
                >
                  <Globe className="h-4 w-4" /> View Public Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer attribution */}
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>
          {SKILLHUB_META.brandCredit} &bull; Author: {SKILLHUB_META.author} &bull;{" "}
          <a
            href={SKILLHUB_META.website}
            target="_blank"
            rel="noreferrer"
            className="hover:underline font-medium text-foreground"
          >
            {SKILLHUB_META.website}
          </a>
        </p>
      </footer>
    </div>
  );
}
