import mongoose, { Schema, Document, Model } from "mongoose";

export type PortfolioType = "data-analytics" | "full-stack" | "both";
export type InstallationType = "express" | "full";

export interface IInstallation extends Document {
  isInstalled: boolean;
  installedAt?: Date;
  portfolioType: PortfolioType;
  installationType: InstallationType;
  setupVersion: string;
  lockToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const InstallationSchema = new Schema<IInstallation>(
  {
    isInstalled: { type: Boolean, default: false, index: true },
    installedAt: { type: Date },
    portfolioType: {
      type: String,
      enum: ["data-analytics", "full-stack", "both"],
      default: "both",
    },
    installationType: {
      type: String,
      enum: ["express", "full"],
      default: "express",
    },
    setupVersion: { type: String, default: "1.0.0" },
    lockToken: { type: String, required: true },
  },
  { timestamps: true }
);

export const Installation: Model<IInstallation> =
  mongoose.models.Installation ||
  mongoose.model<IInstallation>("Installation", InstallationSchema);
