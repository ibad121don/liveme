import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  website: String,
  subscriptionPlan: {
    type: String,
    enum: ['plan_a', 'plan_b', 'plan_c'],
    default: 'plan_a'
  },
  password: String,
  purchaseDate: Date,
  expiryDate: Date,
  isActive: { type: Boolean, default: true },

  superAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', companySchema);
