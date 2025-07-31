import mongoose, { Document, Schema } from "mongoose";

export interface IUnifiedSaleStream extends Document {
  companyId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  inventoryItemId?: mongoose.Types.ObjectId;
  streamId?: string;
  price?: number;
  quantity?: number;
  type?: "sale" | "pyt";
  saleStatus?: "pending" | "approved";
  streamTitle?: string;
  date: string;
  platform: string;
  sales: number;
  revenue: number | string;
  profit: number | string;
  user_id?: mongoose.Types.ObjectId;
  sale_id?: mongoose.Types.ObjectId;
  streamStatus?:
    | "Active"
    | "Completed"
    | "draft"
    | "denied"
    | "in-review"
    | "approved";

  salesBreak: { type: [] };
  directSale: { type: [] };

  // From Allsale.ts

  sellerName?: string;
  year?: string;
  adminStatus?: "Pending" | "Approved" | "Rejected";
}

const UnifiedSaleStreamSchema: Schema = new Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    inventoryItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
    streamId: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    type: { type: String, enum: ["sale", "pyt"], default: "sale" },
    saleStatus: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },

    streamTitle: { type: String },
    date: { type: String, required: false },
    platform: { type: String, required: false },
    sales: { type: Number, required: false },
    revenue: { type: mongoose.Schema.Types.Mixed, required: false }, // can be number or string
    profit: { type: mongoose.Schema.Types.Mixed, required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" },
    salesBreak: { type: [] },
    directSale: { type: [] },
    streamStatus: {
      type: String,
      enum: ["Active", "Completed", "draft", "denied", "in-review", "approved"],
    },

    // From Allsale.ts
    sellerName: { type: String },
    year: { type: String },
    adminStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.UnifiedSaleStream ||
  mongoose.model<IUnifiedSaleStream>(
    "UnifiedSaleStream",
    UnifiedSaleStreamSchema
  );
