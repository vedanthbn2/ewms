import mongoose, { Schema, Model } from 'mongoose';

export interface IRecyclingRequest {
  userId: string;
  userEmail: string;
  recycleItem: string;
  pickupDate: string;
  pickupTime: string;
  deviceCondition: string;
  status: string;
  fullName?: string;
  category?: string;
  deviceImageUrl?: string;
  preferredContactNumber?: string;
  alternateContactNumber?: string;
  assignedReceiver: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverName: string;
  address?: string;
  createdAt: Date;
  model?: string | undefined;
  specialInstructions?: string | undefined;
  accessories?: string[] | undefined;
}

const RecyclingRequestSchema: Schema<IRecyclingRequest> = new Schema({
  userId: { type: String, required: true, trim: true },
  userEmail: { type: String, required: true, trim: true },
  recycleItem: { type: String, required: true, trim: true },
  pickupDate: { type: String, required: true, trim: true },
  pickupTime: { type: String, required: true, trim: true },
  deviceCondition: { type: String, required: true, trim: true },
  status: { type: String, required: true, trim: true },
  fullName: { type: String, required: false, trim: true },
  category: { type: String, required: false, trim: true },
  deviceImageUrl: { type: String, required: false, trim: true },
  preferredContactNumber: { type: String, required: false, trim: true },
  alternateContactNumber: { type: String, required: false, trim: true },
  assignedReceiver: { type: String, required: true, trim: true },
  receiverEmail: { type: String, required: true, trim: true },
  receiverPhone: { type: String, required: true, trim: true },
  receiverName: { type: String, required: true, trim: true },
  address: { type: String, required: false, trim: true },
  createdAt: { type: Date, default: Date.now },
  model: { type: String, required: false, trim: true },
  specialInstructions: { type: String, required: false, trim: true },
  accessories: { type: [String], required: false },
});

const RecyclingRequest: Model<IRecyclingRequest> =
  mongoose.models.RecyclingRequest || mongoose.model<IRecyclingRequest>('RecyclingRequest', RecyclingRequestSchema);

export default RecyclingRequest;
