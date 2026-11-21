"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Loader2, Upload, Trash2, Copy, Image as ImageIcon, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      setAssets(json.assets || []);
    } catch (err) {
      console.error("Failed to load assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Upload file directly using server-signed parameters
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Get signed signature from backend
      const signRes = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "skillhub-portfolio" }),
      });
      const signData = await signRes.json();

      if (!signRes.ok || !signData.success) {
        throw new Error(signData.error || "Cloudinary is not configured in .env");
      }

      // 2. Upload file directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("signature", signData.signature);
      formData.append("folder", signData.folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
        { method: "POST", body: formData }
      );
      const cloudData = await cloudRes.json();

      if (!cloudRes.ok) throw new Error(cloudData.error?.message || "Cloudinary upload failed");

      // 3. Register asset in MongoDB
      await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: cloudData.public_id,
          url: cloudData.url,
          secureUrl: cloudData.secure_url,
          format: cloudData.format || "img",
          bytes: cloudData.bytes,
          folder: signData.folder,
          originalFilename: file.name,
        }),
      });

      toast.success("Media uploaded successfully!");
      fetchAssets();
    } catch (err: any) {
      toast.error(err.message || "Upload error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the asset from Cloudinary and database.")) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Media deleted");
      fetchAssets();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
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
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media Management (Cloudinary)</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload and organize profile images, project screenshots, and assets with signed uploads.
          </p>
        </div>

        <div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button asChild size="sm" className="gap-2" disabled={uploading}>
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Upload Image
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Media Assets ({assets.length})</CardTitle>
          <CardDescription>
            Stored securely on Cloudinary CDN. Click copy to grab the URL for any project or profile field.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground border rounded-lg">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-foreground">No media uploaded yet</p>
              <p className="text-xs mt-1">Upload screenshots and photos using the button above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div key={asset._id} className="group relative rounded-lg border overflow-hidden bg-card">
                  <div className="aspect-video w-full bg-muted overflow-hidden">
                    <img
                      src={asset.secureUrl || asset.url}
                      alt={asset.originalFilename || "Asset"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-2.5 space-y-1">
                    <p className="text-xs font-semibold truncate">
                      {asset.originalFilename || asset.publicId}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {Math.round(asset.bytes / 1024)} KB &bull; {asset.format?.toUpperCase()}
                    </p>
                  </div>
                  <div className="p-2 pt-0 flex items-center justify-between border-t bg-muted/20">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleCopyUrl(asset.secureUrl || asset.url, asset._id)}
                    >
                      {copiedId === asset._id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy URL
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(asset._id)}
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
