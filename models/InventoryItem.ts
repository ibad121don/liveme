import mongoose, { Document, Schema, Model } from "mongoose";

interface IInventoryItem extends Document {
  companyId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  name: string;
  sportCategory: string;
  manufacturer: string;
  year: number;
  price: number;
  currentStock: number;
  status: "In stock" | "Out of stock";
  sku?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    sellerId: { type: Schema.Types.ObjectId, ref: "User" },
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    sportCategory: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 5,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["In stock", "Out of stock"],
      default: "Out of stock",
    },
    sku: {
      type: String,
      trim: true,
      unique: false,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
InventoryItemSchema.index({ companyId: 1, name: 1 }, { unique: true });
InventoryItemSchema.index(
  { companyId: 1, sku: 1 },
  { unique: true, sparse: true }
);

// Auto update status based on stock
InventoryItemSchema.pre<IInventoryItem>("save", function (next) {
  if (this.isModified("currentStock") || this.isNew) {
    this.status = this.currentStock > 0 ? "In stock" : "Out of stock";
  }
  next();
});

// Safe model registration to prevent OverwriteModelError
const InventoryItem: Model<IInventoryItem> =
  mongoose.models.InventoryItem ||
  mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);

export default InventoryItem;
