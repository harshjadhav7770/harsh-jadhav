"use client";

import * as React from "react";
import { useState } from "react";
import { Send, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function ContactFormClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
    honeypot: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit message");
      }

      setSubmitted(true);
      toast.success("Message dispatched successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-border text-center py-12 px-6">
        <CardContent className="space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold">Thank You!</h3>
          <p className="text-sm text-muted-foreground">
            Your message has been safely delivered. An email confirmation has been dispatched, and I will review and reply as soon as possible.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "",
                email: "",
                mobile: "",
                subject: "",
                message: "",
                honeypot: "",
              });
            }}
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Send a Direct Message</CardTitle>
        <CardDescription>
          Fill out the form below. Client & server validation with spam rate-limiting is active.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot Anti-Spam (Hidden from real users) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={form.honeypot}
              onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-xs">
                Your Name *
              </Label>
              <Input
                id="contact-name"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-xs">
                Email Address *
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-mobile" className="text-xs">
                Mobile Number (Optional)
              </Label>
              <Input
                id="contact-mobile"
                placeholder="+91 98765 43210"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-subject" className="text-xs">
                Subject *
              </Label>
              <Input
                id="contact-subject"
                placeholder="e.g. Project Consultation / Job Opening"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-msg" className="text-xs">
              Your Message *
            </Label>
            <Textarea
              id="contact-msg"
              rows={5}
              placeholder="Please describe your project, timeline, or requirements..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Dispatching...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
