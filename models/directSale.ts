
import mongoose from "mongoose";

const DirectSaleSchema = new mongoose.Schema({
  livestreamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LiveStream",
    required: true,
  },
  product: String,
  price: Number,
  quantity: Number,
  buyer: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.DirectSale || mongoose.model("DirectSale", DirectSaleSchema);
