import React from 'react';
import { Sparkles, Stethoscope, CheckCircle2, AlertTriangle, UserCheck, ShieldAlert } from 'lucide-react';

export type BadgeType =
  | 'professional_instruction'
  | 'ai_assisted_explanation'
  | 'ai_generated_draft'
  | 'patient_preference'
  | 'patient_completed'
  | 'human_review_required'
  | 'patient_feedback'
  | 'safety_guarded';

interface VisualBadgeProps {
  type: BadgeType;
  customText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VisualBadge: React.FC<VisualBadgeProps> = ({
  type,
  customText,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider gap-1',
    md: 'text-xs px-2.5 py-1 tracking-wider gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 tracking-wide gap-2 font-bold',
  };

  const badgeConfig = {
    professional_instruction: {
      label: customText || 'PROFESSIONAL INSTRUCTION',
      icon: Stethoscope,
      classes: 'bg-[#F0F4F8] text-[#1E3A8A] border border-[#BFDBFE]',
      sublabel: 'Approved by Physiotherapist',
    },
    ai_assisted_explanation: {
      label: customText || 'AI-ASSISTED EXPLANATION',
      icon: Sparkles,
      classes: 'bg-[#FCF9F2] text-[#8E681C] border border-[#E6C978]',
      sublabel: 'Simplified for Accessibility',
    },
    ai_generated_draft: {
      label: customText || 'AI-GENERATED DRAFT',
      icon: Sparkles,
      classes: 'bg-[#FFFBEB] text-[#B8892D] border border-[#D8B15A] shadow-xs',
      sublabel: 'Pending Human Approval',
    },
    patient_preference: {
      label: customText || 'PATIENT PREFERENCE',
      icon: UserCheck,
      classes: 'bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]',
      sublabel: 'User Daily Routine',
    },
    patient_completed: {
      label: customText || 'PATIENT COMPLETED',
      icon: CheckCircle2,
      classes: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]',
      sublabel: 'Session Finished',
    },
    human_review_required: {
      label: customText || 'HUMAN REVIEW REQUIRED',
      icon: AlertTriangle,
      classes: 'bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]',
      sublabel: 'Therapist Signoff Needed',
    },
    patient_feedback: {
      label: customText || 'PATIENT REPORTED FEEDBACK',
      icon: UserCheck,
      classes: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
      sublabel: 'Direct Patient Input',
    },
    safety_guarded: {
      label: customText || 'AI SAFETY GUARDED',
      icon: ShieldAlert,
      classes: 'bg-[#FAF5FF] text-[#7E22CE] border border-[#E9D5FF]',
      sublabel: 'Non-diagnostic Boundary',
    },
  };

  const { label, icon: Icon, classes } = badgeConfig[type];

  return (
    <span
      className={`inline-flex items-center uppercase rounded-md shadow-2xs select-none ${sizeClasses[size]} ${classes} ${className}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
    </span>
  );
};
