import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName?: string;
  contactEmail?: string;
  role: "seller" | "admin" | "superadmin";
  companyId?: Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String },
  lastName: { type: String },
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
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
