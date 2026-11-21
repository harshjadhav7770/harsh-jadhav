import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialLink extends Document {
  platform: string;
  url: string;
  iconName: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    iconName: { type: String, required: true, default: "Globe" },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SocialLink: Model<ISocialLink> =
  mongoose.models.SocialLink ||
  mongoose.model<ISocialLink>("SocialLink", SocialLinkSchema);
