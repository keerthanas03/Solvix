import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VisualBadge } from '../common/VisualBadges';
import {
  Building2,
  Users,
  ShieldCheck,
  FileText,
  Activity,
  CheckCircle,
  WifiOff,
  Sparkles,
  Lock,
  Download,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');

  const programData = [
    { name: 'Knee Care', count: 34, color: '#C99A3A' },
    { name: 'Shoulder', count: 18, color: '#D8B15A' },
    { name: 'Hip Mobility', count: 14, color: '#B8892D' },
    { name: 'Ankle Rehab', count: 11, color: '#8E681C' },
    { name: 'Post-Op Care', count: 7, color: '#E6C978' },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    if (filterType === 'ALL') return true;
    return log.classification === filterType;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#F5F3FF] text-[#6D28D9] px-2.5 py-0.5 rounded-full border border-[#DDD6FE]">
                Clinic Operations & Governance
              </span>
              <span className="text-xs text-[#77736A]">RehabMitra Central Healthcare Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              Administrative & AI Governance Overview
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1">
              Clinic-wide operational health, multilingual adherence, AI governance compliance, and chronological audit trails.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>AI Governance: 100% Compliant</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'Therapists', val: '6', sub: 'Licensed clinicians', icon: Users, color: 'text-[#252525]' },
          { label: 'Total Patients', val: '84', sub: 'Across 4 clinics', icon: Activity, color: 'text-[#252525]' },
          { label: 'Active Plans', val: '79', sub: 'Human-approved', icon: FileText, color: 'text-[#B8892D]' },
          { label: 'Avg Adherence', val: '81%', sub: 'Activity completion', icon: CheckCircle, color: 'text-[#15803D]' },
          { label: 'Offline Users', val: '14', sub: 'Cached storage active', icon: WifiOff, color: 'text-[#D97706]' },
          { label: 'AI Interactions', val: '342', sub: 'Zero diagnosis breaches', icon: Sparkles, color: 'text-[#8E681C]' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-4 rounded-2xl bg-white border border-[#E8E4D8] shadow-xs">
              <div className="flex items-center justify-between text-[#77736A] text-xs">
                <span>{stat.label}</span>
                <Icon className="w-4 h-4 text-[#B8892D]" />
              </div>
              <div className={`text-2xl font-extrabold mt-1 ${stat.color}`}>{stat.val}</div>
              <div className="text-[10px] text-[#77736A] mt-0.5 truncate">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Program Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8E4D8] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#252525]">Active Patients by Program</h3>
              <p className="text-xs text-[#77736A]">Distribution of rehabilitation clinical focus</p>
            </div>
            <span className="text-xs font-bold text-[#8E681C]">84 Total</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#77736A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#77736A' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E8E4D8',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} patients`, 'Enrollment']}
                />
                <Bar dataKey="count" fill="#C99A3A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Safety Policy & Compliance Check */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8E4D8] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#B8892D]" />
            <h3 className="text-base font-bold text-[#252525]">AI Safety & Regulatory Hardening</h3>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { rule: 'Physiotherapist Approval Mandatory', desc: 'No draft plan reaches patients without explicit clinician signoff.', status: 'Enforced' },
              { rule: 'Autonomous Diagnosis Blocked', desc: 'AI queries requesting disease prediction or etiology return strict refusal.', status: 'Active' },
              { rule: 'Discomfort vs Diagnosis Boundary', desc: 'Patient feedback marked as "Patient-Reported Discomfort", not clinical pathologies.', status: 'Active' },
              { rule: 'Data Privacy & Local Storage', desc: 'Offline queue uses encrypted localStorage; no third-party telemetry.', status: 'Audited' },
              { rule: 'Explainable AI Decision Audit', desc: 'Every schedule adjustment logs explicit factors in audit trail.', status: 'Active' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#FAFAF7] border border-[#E8E4D8] flex items-center justify-between">
                <div className="space-y-0.5 max-w-sm">
                  <div className="font-bold text-[#252525]">{item.rule}</div>
                  <div className="text-[11px] text-[#77736A]">{item.desc}</div>
                </div>
                <span className="text-[10px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-md border border-[#BBF7D0]">
                  ✓ {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chronological Audit Trail */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B8892D]" />
              <h2 className="text-xl font-bold text-[#252525]">
                Chronological Governance Audit Trail
              </h2>
            </div>
            <p className="text-xs text-[#77736A] mt-0.5">
              Immutable ledger of clinical approvals, AI drafts, patient feedback, and sync events.
            </p>
          </div>

          {/* Classification Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'PROFESSIONAL_CLINICAL', 'AI_ASSISTED', 'PATIENT_ACTION', 'GOVERNANCE'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  filterType === f
                    ? 'bg-[#C99A3A] text-white border-[#C99A3A]'
                    : 'bg-[#FAFAF7] text-[#5F5B52] border-[#E8E4D8] hover:bg-[#F7F4EC]'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E4D8] text-[#77736A] bg-[#FAFAF7]">
                <th className="py-3 px-4 font-bold">Timestamp</th>
                <th className="py-3 px-4 font-bold">Actor</th>
                <th className="py-3 px-4 font-bold">Action Taken</th>
                <th className="py-3 px-4 font-bold">Entity</th>
                <th className="py-3 px-4 font-bold">Classification</th>
                <th className="py-3 px-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4D8]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAFAF7]/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#77736A] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#252525]">
                    {log.userName}
                  </td>
                  <td className="py-3.5 px-4 text-[#3F3D38] max-w-md">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-[#77736A] whitespace-nowrap">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                        log.classification === 'AI_ASSISTED'
                          ? 'bg-[#FFF8E7] text-[#8E681C] border-[#E6C978]'
                          : log.classification === 'PROFESSIONAL_CLINICAL'
                          ? 'bg-[#F0F4F8] text-[#1E3A8A] border-[#BFDBFE]'
                          : log.classification === 'PATIENT_ACTION'
                          ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                          : 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]'
                      }`}
                    >
                      {log.classification.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#15803D] whitespace-nowrap">
                    ✓ {log.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
