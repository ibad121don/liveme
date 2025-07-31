"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Key,
  Mail,
  Shield,
  Database,
  Users,
  ChevronDown,
} from "lucide-react";
import InviteCodesModal from "@/components/ui/InviteCodesModal";
import { getConfig, updateConfig } from "@/lib/api"; // Make sure updateConfig exists

// TextInput Component
interface TextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function TextInput({ label, placeholder, value, onChange }: TextInputProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-[#000000]">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-[#C3D3E2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-sm bg-[#FFFFFF]"
      />
    </div>
  );
}

// SelectDropdown Component
interface SelectDropdownProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

function SelectDropdown({
  label,
  options,
  selected,
  onChange,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-2 relative">
      <label className="text-sm font-medium text-[#000000]">{label}</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-[#C3D3E2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-sm text-left bg-[#FFFFFF] flex items-center justify-between"
        >
          <span>{selected}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#FFFFFF] border border-[#C3D3E2] rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-[#F9FAFB] focus:outline-none focus:bg-[#F9FAFB]"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ToggleSwitch Component
interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

function ToggleSwitch({ label, enabled, setEnabled }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-[#C3D3E2] bg-[#F9FAFB] hover:bg-[#FFFFFF] transition-colors">
      <span className="text-sm font-medium text-[#000000] pr-3">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2 ${
          enabled ? "bg-[#1E3A8A]" : "bg-[#C3D3E2]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-[#FFFFFF] transition-transform shadow-sm ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

// Section Component
function Section({
  title,
  icon,
  description,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#C3D3E2] p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-[#1E3A8A]">{icon}</div>
        <h2 className="text-lg sm:text-xl font-semibold text-[#000000]">
          {title}
        </h2>
      </div>
      <p className="text-sm text-[#000000] mb-6 opacity-70">{description}</p>
      {children}
    </div>
  );
}

// Main SystemConfigurationPage Component
export default function SystemConfigurationPage() {
  const [autoEnable, setAutoEnable] = useState(false);
  const [invitationEmail, setInvitationEmail] = useState(false);
  const [approvalNotification, setApprovalNotification] = useState(false);
  const [payrollAlert, setPayrollAlert] = useState(false);
  const [selfRegistration, setSelfRegistration] = useState(false);
  const [historicalAccess, setHistoricalAccess] = useState(false);
  const [probabilityView, setProbabilityView] = useState(false);
  const [lockInventory, setLockInventory] = useState(false);
  const [force2FA, setForce2FA] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);

  const [formData, setFormData] = useState({
    defaultExpiration: "7 days",
    maxUsage: "5",
    prefixRules: "",
    inviteFormat: "",
    planA: "2 sellers allowed",
    planB: "5 sellers allowed",
    planC: "25 sellers allowed",
    trialDuration: "15 days",
    fromAddress: "noreply@salestracker.en",
    passwordReset: "Enabled",
    logRetention: "90 days",
  });

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch config and populate form
  useEffect(() => {
    // Fetch configuration from API
    const fetchConfig = async () => {
      try {
        const apiResponse = await getConfig();
        const config = apiResponse.config;
        if (config) {
          setFormData({
            defaultExpiration:
              config.inviteCodeSettings?.defaultExpirationDays?.toString() ||
              "7",
            maxUsage:
              config.inviteCodeSettings?.maxUsagePerCode?.toString() || "5",
            prefixRules: config.inviteCodeSettings?.prefixRule || "",
            inviteFormat: "", // Not present in API, set as needed
            planA: config.subscriptionPlans?.planA?.toString() || "2",
            planB: config.subscriptionPlans?.planB?.toString() || "5",
            planC: config.subscriptionPlans?.planC?.toString() || "25",
            trialDuration:
              config.subscriptionPlans?.freeTrialDays?.toString() || "15",
            fromAddress: config.emailSettings?.defaultFrom || "",
            passwordReset: config.emailSettings?.passwordResetEmailEnabled
              ? "Enabled"
              : "Disabled",
            logRetention:
              config.loggingAndSecurity?.logRetentionDays?.toString() || "90",
          });
          setAutoEnable(!!config.inviteCodeSettings?.autoExpireAfterUse);
          setInvitationEmail(!!config.emailSettings?.sendInvitationEmail);
          setApprovalNotification(
            !!config.emailSettings?.sendApprovalRejection
          );
          setPayrollAlert(!!config.emailSettings?.sendPayrollAlerts);
          setSelfRegistration(!!config.systemToggles?.allowSelfRegistration);
          setHistoricalAccess(!!config.systemToggles?.historicalPayrollAccess);
          setProbabilityView(!!config.systemToggles?.sellerProfitabilityView);
          setLockInventory(!!config.systemToggles?.lockInventoryDuringPayroll);
          setForce2FA(!!config.loggingAndSecurity?.force2FAForSuperAdmins);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  // Save config handler
  const handleSave = async () => {
    try {
      await updateConfig({
        inviteCodeSettings: {
          defaultExpirationDays: Number(formData.defaultExpiration),
          maxUsagePerCode: Number(formData.maxUsage),
          prefixRule: formData.prefixRules,
          codeLength: 10, // Set as needed
          autoExpireAfterUse: autoEnable,
        },
        subscriptionPlans: {
          planA: Number(formData.planA),
          planB: Number(formData.planB),
          planC: Number(formData.planC),
          freeTrialDays: Number(formData.trialDuration),
        },
        emailSettings: {
          defaultFrom: formData.fromAddress,
          passwordResetEmailEnabled: formData.passwordReset === "Enabled",
          sendInvitationEmail: invitationEmail,
          sendApprovalRejection: approvalNotification,
          sendPayrollAlerts: payrollAlert,
        },
        systemToggles: {
          allowSelfRegistration: selfRegistration,
          historicalPayrollAccess: historicalAccess,
          sellerProfitabilityView: probabilityView,
          lockInventoryDuringPayroll: lockInventory,
        },
        loggingAndSecurity: {
          logRetentionDays: Number(formData.logRetention),
          force2FAForSuperAdmins: force2FA,
        },
      });
      // Optionally show a success message here
    } catch (error: any) {
      console.error("Error saving config:", error.message || error);
      alert("Failed to save configuration: " + (error.message || error));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFFFFF] rounded-lg border border-[#C3D3E2]">
              <Settings className="h-6 w-6 text-[#1E3A8A]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">
              System Configuration
            </h1>
          </div>
          <button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-[#FFFFFF] px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
            Reset Password
          </button>
        </div>

        <div className="space-y-8">
          {/* Invite Code Settings */}
          <Section
            title="Invite Code Settings"
            icon={<Key className="h-5 w-5" />}
            description="Configure invitation code generation and expiration settings"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <TextInput
                label="Default expiration period"
                placeholder="7 days"
                value={formData.defaultExpiration}
                onChange={(value) => updateFormData("defaultExpiration", value)}
              />
              <TextInput
                label="Maximum usage per code"
                placeholder="5"
                value={formData.maxUsage}
                onChange={(value) => updateFormData("maxUsage", value)}
              />
              <TextInput
                label="Prefix rules"
                placeholder="Company initials"
                value={formData.prefixRules}
                onChange={(value) => updateFormData("prefixRules", value)}
              />
              <TextInput
                label="Invite code format"
                placeholder="10 characters"
                value={formData.inviteFormat}
                onChange={(value) => updateFormData("inviteFormat", value)}
              />
            </div>
            <div className="mt-6">
              <ToggleSwitch
                label="Auto expire after registration"
                enabled={autoEnable}
                setEnabled={setAutoEnable}
              />
            </div>
          </Section>

          {/* Extra Control Features */}
          <Section
            title="Extra Control Features"
            icon={<Users className="h-5 w-5" />}
            description="Advanced code management and bulk operations"
          >
            <div className="flex flex-col justify-end lg:flex-row gap-4 lg:gap-6">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectDropdown
                  label="View all codes"
                  options={["Active", "Expired", "Used"]}
                  selected="Active"
                  onChange={() => {}}
                />
                <SelectDropdown
                  label="Filter codes"
                  options={["by expiration", "by usage"]}
                  selected="by expiration"
                  onChange={() => {}}
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:col-span-3">
                  <button
                    className="w-full sm:w-[200px] h-[40px] bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-[#FFFFFF] px-6 rounded-lg font-semibold transition-colors shadow-sm"
                    onClick={() => setShowInviteModal(true)}
                  >
                    Revoke Codes
                  </button>
                  <button className="w-full sm:w-[200px] h-[40px] bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-[#FFFFFF] px-6 rounded-lg font-semibold transition-colors shadow-sm">
                    Generate New
                  </button>
                </div>
              </div>
            </div>
          </Section>

          {/* Subscription Configuration */}
          <Section
            title="Subscription Configuration"
            icon={<Database className="h-5 w-5" />}
            description="Define subscription plans and trial periods"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <TextInput
                label="Subscription Plan A"
                placeholder="2 sellers allowed"
                value={formData.planA}
                onChange={(value) => updateFormData("planA", value)}
              />
              <TextInput
                label="Subscription Plan B"
                placeholder="5 sellers allowed"
                value={formData.planB}
                onChange={(value) => updateFormData("planB", value)}
              />
              <TextInput
                label="Subscription Plan C"
                placeholder="25 sellers allowed"
                value={formData.planC}
                onChange={(value) => updateFormData("planC", value)}
              />
              <TextInput
                label="Free trial duration"
                placeholder="15 days"
                value={formData.trialDuration}
                onChange={(value) => updateFormData("trialDuration", value)}
              />
            </div>
          </Section>

          {/* Email Settings */}
          <Section
            title="Email Settings"
            icon={<Mail className="h-5 w-5" />}
            description="Configure email notifications and sender settings"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <div className="sm:col-span-2">
                <TextInput
                  label="Default from address"
                  placeholder="noreply@salestracker.en"
                  value={formData.fromAddress}
                  onChange={(value) => updateFormData("fromAddress", value)}
                />
              </div>
              <SelectDropdown
                label="Password reset email"
                options={["Enabled", "Disabled"]}
                selected={formData.passwordReset}
                onChange={(value) => updateFormData("passwordReset", value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ToggleSwitch
                label="Invitation email"
                enabled={invitationEmail}
                setEnabled={setInvitationEmail}
              />
              <ToggleSwitch
                label="Approval/rejection notifications"
                enabled={approvalNotification}
                setEnabled={setApprovalNotification}
              />
              <ToggleSwitch
                label="Payroll processed alerts"
                enabled={payrollAlert}
                setEnabled={setPayrollAlert}
              />
            </div>
          </Section>

          {/* System Wide Toggles */}
          <Section
            title="System Wide Toggles"
            icon={<Settings className="h-5 w-5" />}
            description="Global system behavior and feature toggles"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              <ToggleSwitch
                label="Allow self registration"
                enabled={selfRegistration}
                setEnabled={setSelfRegistration}
              />
              <ToggleSwitch
                label="Historical payroll access"
                enabled={historicalAccess}
                setEnabled={setHistoricalAccess}
              />
              <ToggleSwitch
                label="Seller profitability view"
                enabled={probabilityView}
                setEnabled={setProbabilityView}
              />
              <ToggleSwitch
                label="Lock inventory during payroll"
                enabled={lockInventory}
                setEnabled={setLockInventory}
              />
            </div>
          </Section>

          {/* Logging & Security */}
          <Section
            title="Logging & Security"
            icon={<Shield className="h-5 w-5" />}
            description="Security settings and data retention policies"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="w-full md:max-w-xs">
                <TextInput
                  label="Log retention period"
                  placeholder="90 days"
                  value={formData.logRetention}
                  onChange={(value) => updateFormData("logRetention", value)}
                />
              </div>
              <div className="w-full md:max-w-sm">
                <ToggleSwitch
                  label="Force 2FA for super admins"
                  enabled={force2FA}
                  setEnabled={setForce2FA}
                />
              </div>
            </div>
          </Section>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-[#C3D3E2]">
            <button className="bg-[#F9FAFB] hover:bg-[#FFFFFF] text-[#000000] px-8 py-3 rounded-lg font-semibold transition-colors border border-[#C3D3E2]">
              Cancel
            </button>
            <button
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-[#FFFFFF] px-8 py-3 rounded-lg font-semibold transition-colors shadow-sm"
              onClick={handleSave}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
      <InviteCodesModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
}
