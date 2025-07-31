import mongoose, { Schema, Document } from "mongoose";

export interface IDashboard extends Document {
  date: string;
  platform: string;
  item: string;
  price: string;
  commission: string;
  status: "Completed" | "On Review" | "In Queue";
}

const DashboardSchema: Schema = new Schema(
  {
    date: { type: String, required: true },
    platform: { type: String, required: true },
    item: { type: String, required: true },
    price: { type: String, required: true },
    commission: { type: String, required: true },
    status: {
      type: String,
      enum: ["Completed", "On Review", "In Queue"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Dashboard || mongoose.model<IDashboard>("Dashboard", DashboardSchema);
