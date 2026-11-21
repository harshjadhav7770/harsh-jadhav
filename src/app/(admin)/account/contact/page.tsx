"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Loader2, Mail, Trash2, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminContactInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const json = await res.json();
      setMessages(json.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success(currentStatus ? "Marked as unread" : "Marked as read");
      fetchMessages();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Message deleted");
      fetchMessages();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete message");
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
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact Inquiries</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review visitor messages sent through your portfolio contact form.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inbox ({messages.length})</CardTitle>
          <CardDescription>All submitted inquiries ordered by most recent</CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No inquiries received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-4 rounded-lg border transition-colors ${
                    msg.isRead ? "bg-card" : "bg-primary/5 border-primary/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{msg.senderName}</span>
                      <a
                        href={`mailto:${msg.senderEmail}`}
                        className="text-xs text-primary hover:underline"
                      >
                        {msg.senderEmail}
                      </a>
                      {msg.senderMobile && (
                        <span className="text-xs text-muted-foreground">&bull; {msg.senderMobile}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(msg.submittedAt)}</span>
                      {!msg.isRead && (
                        <Badge variant="default" className="text-[10px] py-0 px-1.5 h-4">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-semibold">{msg.subject}</p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => toggleReadStatus(msg._id, msg.isRead)}
                    >
                      {msg.isRead ? "Mark as Unread" : "Mark as Read"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 h-7 w-7"
                      onClick={() => handleDelete(msg._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
