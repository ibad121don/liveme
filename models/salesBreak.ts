import mongoose from "mongoose";

const SalesBreakSchema = new mongoose.Schema({
  livestreamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UnifiedSaleStream",
    required: true,
  },
  title: String,
  description: String,
  items: [String],
  buyer: String,
  sale_platform: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.SalesBreak ||
  mongoose.model("SalesBreak", SalesBreakSchema);
