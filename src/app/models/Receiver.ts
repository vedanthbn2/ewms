import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReceiver extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  approved: boolean;
}

const ReceiverSchema: Schema<IReceiver> = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
});

const Receiver: Model<IReceiver> = mongoose.models.Receiver || mongoose.model<IReceiver>('Receiver', ReceiverSchema);

export default Receiver;
