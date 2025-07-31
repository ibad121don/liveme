
import mongoose, { Schema, Document } from "mongoose";

export interface IProfileUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  contactEmail: string;
}

const ProfileUserSchema = new Schema<IProfileUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
  contactEmail: { type: String, required: true },
});

export default mongoose.models.ProfileUser ||
  mongoose.model<IProfileUser>("ProfileUser", ProfileUserSchema);
