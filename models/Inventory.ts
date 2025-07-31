import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: String,
  sku: String,
  quantity: Number,
  totalCost: Number, 
  averagePrice: Number
}, { timestamps: true });

export default mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
