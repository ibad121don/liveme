import mongoose from "mongoose";

const SellerSettingsSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
    },
    email: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
    },
    companyName: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    role: {
      type: String,
      enum: ["seller", "admin", "superadmin"],
      default: "seller",
    },
  },
  {
    timestamps: true,
    strict: true, // This is true by default, you can omit this
  }
);

export default mongoose.models.SellerSettings ||
  mongoose.model("SellerSettings", SellerSettingsSchema);
