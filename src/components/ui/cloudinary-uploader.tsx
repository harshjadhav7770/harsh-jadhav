"use client";

import * as React from "react";
import { useState } from "react";
import { Upload, Loader2, Image as ImageIcon, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface CloudinaryUploaderProps {
  onUploadComplete: (url: string, publicId?: string) => void;
  folder?: string;
  accept?: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  icon?: "image" | "file";
  assetType?: "profile" | "project" | "hero" | "document";
  className?: string;
}

export function CloudinaryUploader({
  onUploadComplete,
  folder = "skillhub-portfolio",
  accept = "image/*",
  buttonText = "Upload File",
  buttonVariant = "outline",
  buttonSize = "sm",
  icon = "image",
  assetType = "project",
  className,
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${file.name} to Cloudinary...`);

    try {
      // 1. Fetch signed upload token
      const signRes = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });

      const signData = await signRes.json();
      if (!signRes.ok || !signData.success) {
        throw new Error(
          signData.error || "Cloudinary is not configured. Please check your environment variables."
        );
      }

      // 2. Perform direct upload to Cloudinary CDN
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("signature", signData.signature);
      formData.append("folder", signData.folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();
      if (!cloudRes.ok) {
        throw new Error(cloudData.error?.message || "Cloudinary upload failed");
      }

      const fileUrl = cloudData.secure_url || cloudData.url;

      // 3. Register asset in database
      await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: cloudData.public_id,
          url: cloudData.url,
          secureUrl: fileUrl,
          format: cloudData.format || file.name.split(".").pop() || "bin",
          bytes: cloudData.bytes || file.size,
          folder: signData.folder,
          assetType,
          originalFilename: file.name,
        }),
      });

      toast.success(`${file.name} uploaded successfully!`, { id: toastId });
      onUploadComplete(fileUrl, cloudData.public_id);
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      toast.error(err.message || "Failed to upload file to Cloudinary", { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const IconComponent = icon === "file" ? FileText : ImageIcon;

  return (
    <label className={`inline-block cursor-pointer ${className || ""}`}>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <Button
        type="button"
        variant={buttonVariant}
        size={buttonSize}
        disabled={isUploading}
        className="gap-1.5 pointer-events-none"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <IconComponent className="h-3.5 w-3.5" />
            <span>{buttonText}</span>
          </>
        )}
      </Button>
    </label>
  );
}
