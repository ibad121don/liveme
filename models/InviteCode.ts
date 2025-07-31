import mongoose from 'mongoose';

const inviteCodeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  role: { type: String, enum: ['company_admin', 'seller'], required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  used: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.InviteCode || mongoose.model('InviteCode', inviteCodeSchema);
