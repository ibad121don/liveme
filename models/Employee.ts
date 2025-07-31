import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  companyId: mongoose.Types.ObjectId; // Optional if company context needed
  // _id: string;
  name: string;
  paymentType: "Commission" | "Hourly" | "Salary";
  role: "Seller" | "Admin" | "Super Admin";
  rate: string; // Can be "20%", "$25/hr", etc.
  status: "Active" | "Inactive";
}

const EmployeeSchema: Schema = new Schema(
  {
    companyId: { type: mongoose.Types.ObjectId, ref: "Company" },
    // _id: { type: String, required: true },
    name: { type: String, required: true },
    paymentType: {
      type: String,
      enum: ["Commission", "Hourly", "Salary"],
      required: true,
    },
    role: {
      type: String,
      enum: ["Seller", "Admin", "Super Admin"],
      required: true,
    },
    rate: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.Employee ||
  mongoose.model<IEmployee>("Employee", EmployeeSchema);
