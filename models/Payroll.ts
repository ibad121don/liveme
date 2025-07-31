// models/Payroll.ts

import mongoose, { Schema, model, models } from "mongoose";

const payrollSchema = new Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["hourly", "commission"],
    required: true,
  },
  rate: Number,
  approvedSales: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sale" }],
  hoursWorked: Number,
  totalPay: Number,
});

const Payroll = models.Payroll || model("Payroll", payrollSchema);

export default Payroll;
