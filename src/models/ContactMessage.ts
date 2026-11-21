import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactMessage extends Document {
  senderName: string;
  senderEmail: string;
  senderMobile?: string;
  subject: string;
  message: string;
  isRead: boolean;
  ipAddress?: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    senderName: { type: String, required: true, trim: true },
    senderEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    senderMobile: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    ipAddress: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
