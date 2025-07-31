import mongoose, { Document, Schema, models, model } from "mongoose";

export interface IUnifiedSaleStream extends Document {
  streamTitle: string;
  streamDate: string;
  streamingPlatform: string;
  sellerId: mongoose.Types.ObjectId;
  sellerOnline: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UnifiedSaleStreamSchema = new Schema<IUnifiedSaleStream>(
  {
    streamTitle: { type: String, required: true },
    streamDate: { type: String, required: true },
    streamingPlatform: { type: String, required: true },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UnifiedSaleStream =
  models.UnifiedSaleStream ||
  model<IUnifiedSaleStream>("UnifiedSaleStream", UnifiedSaleStreamSchema);
