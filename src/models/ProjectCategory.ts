import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProjectCategory extends Document {
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectCategorySchema = new Schema<IProjectCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProjectCategory: Model<IProjectCategory> =
  mongoose.models.ProjectCategory ||
  mongoose.model<IProjectCategory>("ProjectCategory", ProjectCategorySchema);
