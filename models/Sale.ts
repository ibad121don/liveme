import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inventoryItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
  streamId: String, 
  price: Number,
  quantity: Number,
  type: { type: String, enum: ['sale', 'pyt'], default: 'sale' }, 
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' }
}, { timestamps: true });

export default mongoose.models.Sale || mongoose.model('Sale', saleSchema);
