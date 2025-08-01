import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  contactEmail?: string;
  role: "seller" | "admin" | "superadmin";
  companyId?: Types.ObjectId;
  paymentType?: "Commission" | "Hourly" | "Salary";
  rate?: string;
  status?: "Active" | "Inactive";
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  companyName: { type: String },
  contactEmail: { type: String },
  role: {
    type: String,
    enum: ["seller", "admin", "superadmin"],
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
  paymentType: {
    type: String,
    enum: ["Commission", "Hourly", "Salary"],
  },
  rate: { type: String },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);