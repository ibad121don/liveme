import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema(
  {
    inviteCodeSettings: {
      defaultExpirationDays: { type: Number, default: 7 },
      maxUsagePerCode: { type: Number, default: 5 },
      prefixRule: { type: String, default: 'Company initials' },
      codeLength: { type: Number, default: 10 },
      autoExpireAfterUse: { type: Boolean, default: false },
    },
    subscriptionPlans: {
      planA: { type: Number, default: 2 }, 
      planB: { type: Number, default: 5 },
      planC: { type: Number, default: 25 },
      freeTrialDays: { type: Number, default: 15 },
    },
    emailSettings: {
      defaultFrom: { type: String, default: 'noreply@salestracker.en' },
      passwordResetEmailEnabled: { type: Boolean, default: true },
      sendInvitationEmail: { type: Boolean, default: false },
      sendApprovalRejection: { type: Boolean, default: false },
      sendPayrollAlerts: { type: Boolean, default: false },
    },
    systemToggles: {
      allowSelfRegistration: { type: Boolean, default: false },
      historicalPayrollAccess: { type: Boolean, default: false },
      sellerProfitabilityView: { type: Boolean, default: false },
      lockInventoryDuringPayroll: { type: Boolean, default: false },
    },
    loggingAndSecurity: {
      logRetentionDays: { type: Number, default: 90 },
      force2FAForSuperAdmins: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.SystemConfig ||
  mongoose.model('SystemConfig', systemConfigSchema);
