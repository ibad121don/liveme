import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
