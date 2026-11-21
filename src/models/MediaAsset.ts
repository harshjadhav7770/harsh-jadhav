import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMediaAsset extends Document {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  bytes: number;
  folder: string;
  assetType: "profile" | "project" | "hero" | "document";
  originalFilename?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    format: { type: String, required: true },
    bytes: { type: Number, required: true },
    folder: { type: String, default: "skillhub-portfolio" },
    assetType: {
      type: String,
      enum: ["profile", "project", "hero", "document"],
      default: "project",
    },
    originalFilename: { type: String },
  },
  { timestamps: true }
);

export const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset ||
  mongoose.model<IMediaAsset>("MediaAsset", MediaAssetSchema);
