import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEducation extends Document {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gradeOrCgpa?: string;
  description?: string;
  achievements: string[];
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    isCurrent: { type: Boolean, default: false },
    gradeOrCgpa: { type: String, trim: true },
    description: { type: String },
    achievements: [{ type: String }],
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Education: Model<IEducation> =
  mongoose.models.Education ||
  mongoose.model<IEducation>("Education", EducationSchema);
