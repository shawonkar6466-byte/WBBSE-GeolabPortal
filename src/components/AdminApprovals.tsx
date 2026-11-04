import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Search,
  RefreshCw,
  AlertTriangle,
  FileText,
  Calendar,
  Lock,
  Unlock,
  Eye,
  Sliders,
  Award
} from 'lucide-react';

interface PaymentItem {
  id: number;
  username: string;
  user_name: string;
  phone: string;
  item_type: string;
  item_id: string;
  amount: number;
  upi_ref: string;
  status: string;
  admin_note: string;
  timestamp: string;
  screenshot_file_name?: string;
  screenshot_file_data?: string;
}

interface SubscriptionItem {
  id: number;
  username: string;
  student_name: string;
  phone: string;
  plan_type: string;
  material_id: string;
  status: 'active' | 'expired' | 'revoked';
  payment_id: number;
  starts_at: string;
  expires_at: string;
  days_left: number | null;
  is_expired: boolean;
  school_name?: string;
  district?: string;
  total_page_views?: number;
}

interface AccessLogItem {
  id: number;
  username: string;
  student_name: string;
  student_phone: string;
  material_id: string;
  page_number: number;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

interface Props {
  user: any;
  language: 'Bengali' | 'English';
}

export const AdminApprovals: React.FC<Props> = ({ user, language }) => {
  const isBn = language === 'Bengali';

  // Sub-tabs
  const [activeTab, setActiveTab] = useState<'pending' | 'subscriptions' | 'logs'>('pending');

  // Data states
  const [pendingPayments, setPendingPayments] = useState<PaymentItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLogItem[]>([]);
  const [logStats, setLogStats] = useState<{ total_views: number; unique_students: number }>({ total_views: 0, unique_students: 0 });

  // Action states
  const [loading, setLoading] = useState<boolean>(false);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // Approval modal state
  const [approvingItem, setApprovingItem] = useState<PaymentItem | null>(null);
  const [validityDays, setValidityDays] = useState<number>(365);
  const [approvalNote, setApprovalNote] = useState<string>('Verified via Bank UPI');

  // Rejection modal state
  const [rejectingItem, setRejectingItem] = useState<PaymentItem | null>(null);
  const [rejectionNote, setRejectionNote] = useState<string>('Invalid or Unmatched UTR number');

  // Revoke state
  const [revokingSub, setRevokingSub] = useState<SubscriptionItem | null>(null);
  const [revokeReason, setRevokeReason] = useState<string>('Suspected unauthorized sharing or multiple simultaneous IP usage');

  const getHeaders = () => {
    return {
      'x-user-id': user?.username || 'admin',
      'x-username': user?.username || 'admin',
      'x-user-role': user?.role || 'admin',
      'x-user-phone': user?.phone || '7001257277',
      'Content-Type': 'application/json'
    };
  };

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/payments/pending', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setPendingPayments(data);
      }
    } catch (e) {
      console.error('Error fetching pending payments:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/subscriptions', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (e) {
      console.error('Error fetching subscriptions:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/access_logs', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAccessLogs(data.logs || []);
        setLogStats({ total_views: data.total_views || 0, unique_students: data.unique_students || 0 });
      }
    } catch (e) {
      console.error('Error fetching access logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') fetchPending();
    if (activeTab === 'subscriptions') fetchSubscriptions();
    if (activeTab === 'logs') fetchAccessLogs();
  }, [activeTab]);

  // Handle Approve
  const handleApprove = async () => {
    if (!approvingItem) return;
    try {
      const res = await fetch('/api/admin/payments/approve', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          paymentId: approvingItem.id,
          validityDays,
          adminNote: approvalNote
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg({ type: 'success', text: data.message || 'পেমেন্ট অনুমোদিত এবং সাবস্ক্রিপশন সক্রিয় করা হয়েছে।' });
        setApprovingItem(null);
        fetchPending();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'অনুমোদনে সমস্যা হয়েছে।' });
      }
    } catch (e: any) {
      setActionMsg({ type: 'error', text: e.message });
    }
  };

  // Handle Reject
  const handleReject = async () => {
    if (!rejectingItem) return;
    try {
      const res = await fetch('/api/admin/payments/reject', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          paymentId: rejectingItem.id,
          adminNote: rejectionNote
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg({ type: 'success', text: data.message || 'পেমেন্ট প্রত্যাখ্যান করা হয়েছে।' });
        setRejectingItem(null);
        fetchPending();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'প্রত্যাখ্যানে সমস্যা হয়েছে।' });
      }
    } catch (e: any) {
      setActionMsg({ type: 'error', text: e.message });
    }
  };

  // Handle Revoke
  const handleRevoke = async () => {
    if (!revokingSub) return;
    try {
      const res = await fetch('/api/admin/subscriptions/revoke', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          subscriptionId: revokingSub.id,
          reason: revokeReason
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg({ type: 'success', text: data.message || 'সাবস্ক্রিপশন বাতিল করা হয়েছে।' });
        setRevokingSub(null);
        fetchSubscriptions();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'বাতিল করতে সমস্যা হয়েছে।' });
      }
    } catch (e: any) {
      setActionMsg({ type: 'error', text: e.message });
    }
  };

  // Handle Extend
  const handleExtend = async (subId: number, days: number) => {
    try {
      const res = await fetch('/api/admin/subscriptions/extend', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          subscriptionId: subId,
          additionalDays: days
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg({ type: 'success', text: data.message || 'মেয়াদ বৃদ্ধি করা হয়েছে।' });
        fetchSubscriptions();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'মেয়াদ বাড়াতে সমস্যা হয়েছে।' });
      }
    } catch (e: any) {
      setActionMsg({ type: 'error', text: e.message });
    }
  };

  const filteredSubscriptions = subscriptions.filter(s => {
    const term = searchTerm.toLowerCase();
    return (
      s.student_name?.toLowerCase().includes(term) ||
      s.username?.toLowerCase().includes(term) ||
      s.phone?.includes(term) ||
      s.school_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Summary */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-blue-950 text-white p-5 rounded-2xl shadow-md border border-amber-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold tracking-tight">
                {isBn ? 'PDF সিকিউরিটি ও পেমেন্ট অনুমোদন কন্ট্রোল প্যানেল' : 'PDF Security & Payment Approvals Control'}
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {isBn
                ? 'শিক্ষার্থীদের জমা দেওয়া UPI পেমেন্ট UTR যাচাই, ১-ক্লিকে সাবস্ক্রিপশন সক্রিয়করণ, অননুমোদিত শেয়ারিং দমন ও লাইভ DRM ভিউয়ার অডিট লগ।'
                : 'Verify student UPI transactions, approve subscriptions with flexible validity, and monitor real-time anti-sharing DRM audit logs.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-amber-300 uppercase tracking-wider block">
                {isBn ? 'অপেক্ষারত পেমেন্ট' : 'Pending Requests'}
              </span>
              <span className="text-2xl font-black text-white">{pendingPayments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMsg && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between border ${
            actionMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-red-50 text-red-800 border-red-300'
          }`}
        >
          <span>{actionMsg.text}</span>
          <button
            type="button"
            onClick={() => setActionMsg(null)}
            className="text-xs font-bold underline ml-4 hover:opacity-75 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-xl max-w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{isBn ? `পেমেন্ট রিকোয়েস্ট (${pendingPayments.length})` : `Pending Payments (${pendingPayments.length})`}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'subscriptions'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-blue-600" />
          <span>{isBn ? `শিক্ষার্থী সাবস্ক্রিপশন (${subscriptions.length})` : `Subscriptions (${subscriptions.length})`}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span>{isBn ? `DRM অডিট লগ (${logStats.total_views})` : `Access Logs (${logStats.total_views})`}</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: PENDING PAYMENTS QUEUE                                        */}
      {/* ==================================================================== */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              {isBn ? 'যাচাইকরণের অপেক্ষায় থাকা পেমেন্টসমূহ' : 'Pending Verification Queue'}
            </h3>
            <button
              type="button"
              onClick={fetchPending}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
          </div>

          {pendingPayments.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">
                {isBn ? 'কোনো নতুন পেমেন্ট অপেক্ষারত নেই' : 'No pending payments'}
              </h4>
              <p className="text-xs text-slate-500">
                {isBn ? 'সমস্ত পেমেন্ট রিকোয়েস্ট সফলভাবে যাচাই ও প্রক্রিয়াকৃত হয়েছে।' : 'All payment submissions have been resolved.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPayments.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>{p.user_name || p.username}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{p.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                        ₹{p.amount}
                      </span>
                    </div>
                  </div>

                  {/* Transaction UTR & Plan info */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{isBn ? 'ট্রানজ্যাকশন আইডি (UTR):' : 'Transaction UTR:'}</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                        {p.upi_ref}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{isBn ? 'প্ল্যান নাম:' : 'Plan Requested:'}</span>
                      <span className="font-semibold text-slate-800">{p.item_id || p.item_type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{isBn ? 'জমার সময়:' : 'Submitted at:'}</span>
                      <span className="text-slate-600 font-mono text-[11px]">{new Date(p.timestamp).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Screenshot Thumbnail if available */}
                  {p.screenshot_file_data && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedScreenshot(p.screenshot_file_data || null)}
                        className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isBn ? 'পেমেন্ট স্ক্রিনশট দেখুন' : 'View payment screenshot'}</span>
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setApprovingItem(p)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isBn ? 'অনুমোদন ও আনলক' : 'Approve & Unlock'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectingItem(p)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 border border-slate-300 font-semibold text-xs transition cursor-pointer"
                    >
                      {isBn ? 'বাতিল' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: ACTIVE SUBSCRIPTIONS DIRECTORY                                 */}
      {/* ==================================================================== */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={isBn ? 'শিক্ষার্থীর নাম বা ফোন দিয়ে খুঁজুন...' : 'Search student by name/phone...'}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:border-blue-600 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={fetchSubscriptions}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer self-end sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{isBn ? 'শিক্ষার্থী' : 'Student'}</th>
                    <th className="py-3 px-4">{isBn ? 'ফোন / আইডি' : 'Phone / ID'}</th>
                    <th className="py-3 px-4">{isBn ? 'প্ল্যান' : 'Plan'}</th>
                    <th className="py-3 px-4">{isBn ? 'মেয়াদ ও অবস্থা' : 'Validity & Status'}</th>
                    <th className="py-3 px-4">{isBn ? 'ভিউ সংখ্যা' : 'DRM Views'}</th>
                    <th className="py-3 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscriptions.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div>{s.student_name || s.username}</div>
                        {s.school_name && <div className="text-[10px] text-slate-400 font-normal">{s.school_name}</div>}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{s.phone || s.username}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                          {s.plan_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {s.status === 'revoked' ? (
                          <span className="text-red-700 font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px]">
                            {isBn ? '🚫 বাতিল (Revoked)' : 'Revoked'}
                          </span>
                        ) : s.is_expired ? (
                          <span className="text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                            {isBn ? '⌛ মেয়াদোত্তীর্ণ' : 'Expired'}
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px]">
                              {isBn ? `সক্রিয় (${s.days_left} দিন বাকি)` : `Active (${s.days_left}d)`}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {s.expires_at ? new Date(s.expires_at).toLocaleDateString('en-IN') : 'Lifetime'}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {s.total_page_views ?? 0}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {s.status === 'active' && !s.is_expired && (
                          <button
                            type="button"
                            onClick={() => handleExtend(s.id, 30)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 text-blue-700 text-[11px] font-semibold border border-slate-300 cursor-pointer"
                            title="Extend 30 Days"
                          >
                            +30 দিন
                          </button>
                        )}
                        {s.status === 'active' && (
                          <button
                            type="button"
                            onClick={() => setRevokingSub(s)}
                            className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold border border-red-200 cursor-pointer"
                            title="Revoke subscription"
                          >
                            {isBn ? 'বাতিল' : 'Revoke'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredSubscriptions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        {isBn ? 'কোনো সাবস্ক্রিপশন পাওয়া যায়নি।' : 'No subscriptions found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: FORENSIC ACCESS AUDIT LOGS                                    */}
      {/* ==================================================================== */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">{isBn ? 'মোট DRM পৃষ্ঠা পাঠ' : 'Total Page Views'}</span>
              <p className="text-2xl font-black text-blue-700 mt-0.5">{logStats.total_views}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">{isBn ? 'অনন্য পাঠক শিক্ষার্থী' : 'Unique Active Students'}</span>
              <p className="text-2xl font-black text-purple-700 mt-0.5">{logStats.unique_students}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{isBn ? 'সময়' : 'Timestamp'}</th>
                    <th className="py-3 px-4">{isBn ? 'শিক্ষার্থী ও ফোন' : 'Student & Contact'}</th>
                    <th className="py-3 px-4">{isBn ? 'ম্যাটেরিয়াল ও পৃষ্ঠা' : 'Material & Page'}</th>
                    <th className="py-3 px-4">{isBn ? 'আইপি অ্যাড্রেস' : 'IP Address'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {accessLogs.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                        {new Date(l.timestamp).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-4 font-sans font-bold text-slate-900">
                        {l.student_name || l.username}
                        <span className="text-slate-400 font-mono text-[11px] ml-1.5 font-normal">
                          ({l.student_phone || 'N/A'})
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-blue-800 font-sans font-semibold">
                        {l.material_id} • পৃষ্ঠা {l.page_number}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 text-[11px]">
                        {l.ip_address}
                      </td>
                    </tr>
                  ))}
                  {accessLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-400 font-sans">
                        {isBn ? 'কোনো অডিট লগ রেকর্ড নেই।' : 'No audit logs recorded yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* APPROVAL MODAL                                                       */}
      {/* ==================================================================== */}
      {approvingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 pb-2 border-b border-slate-100">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="font-extrabold text-base text-slate-900">
                {isBn ? 'পেমেন্ট অনুমোদন ও সাবস্ক্রিপশন সক্রিয়করণ' : 'Approve Payment'}
              </h4>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div><strong>শিক্ষার্থী:</strong> {approvingItem.user_name || approvingItem.username} ({approvingItem.phone})</div>
              <div><strong>UTR / Ref:</strong> {approvingItem.upi_ref}</div>
              <div><strong>টাকার পরিমাণ:</strong> ₹{approvingItem.amount}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isBn ? 'সাবস্ক্রিপশনের মেয়াদ (দিন):' : 'Validity (Days):'}
                </label>
                <select
                  value={validityDays}
                  onChange={e => setValidityDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                >
                  <option value={365}>৩৬৫ দিন (১ সম্পূর্ণ বছর - রেকমেন্ডেড)</option>
                  <option value={180}>১৮০ দিন (৬ মাস)</option>
                  <option value={90}>৯০ দিন (৩ মাস)</option>
                  <option value={30}>৩০ দিন (১ মাস ট্রায়াল)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isBn ? 'অ্যাডমিন মন্তব্য / নোট:' : 'Admin Note:'}
                </label>
                <input
                  type="text"
                  value={approvalNote}
                  onChange={e => setApprovalNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setApprovingItem(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'ফিরে যান' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {isBn ? 'হ্যাঁ, অনুমোদন করুন' : 'Confirm & Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* REJECTION MODAL                                                      */}
      {/* ==================================================================== */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-red-600 pb-2 border-b border-slate-100">
              <XCircle className="w-5 h-5" />
              <h4 className="font-extrabold text-base text-slate-900">
                {isBn ? 'পেমেন্ট প্রত্যাখ্যান' : 'Reject Payment'}
              </h4>
            </div>

            <div className="text-xs text-slate-600">
              {isBn
                ? `শিক্ষার্থী ${rejectingItem.user_name} (${rejectingItem.phone})-এর UTR: ${rejectingItem.upi_ref} প্রত্যাখ্যাত হবে।`
                : `Reject payment for ${rejectingItem.user_name}.`}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isBn ? 'প্রত্যাখ্যানের কারণ:' : 'Reason for rejection:'}
              </label>
              <input
                type="text"
                value={rejectionNote}
                onChange={e => setRejectionNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'ফিরে যান' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {isBn ? 'প্রত্যাখ্যান নিশ্চিত করুন' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* REVOCATION MODAL                                                     */}
      {/* ==================================================================== */}
      {revokingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-red-600 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="font-extrabold text-base text-slate-900">
                {isBn ? 'সাবস্ক্রিপশন বাতিল ও অ্যাক্সেস ব্লক' : 'Revoke Subscription'}
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? `সতর্কতা: শিক্ষার্থী ${revokingSub.student_name || revokingSub.username}-এর সমস্ত মাস্টার PDF রিডার অ্যাক্সেস সঙ্গে সঙ্গে বন্ধ হয়ে যাবে।`
                : `Student will immediately lose access to all DRM materials.`}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isBn ? 'বাতিলের কারণ:' : 'Reason:'}
              </label>
              <input
                type="text"
                value={revokeReason}
                onChange={e => setRevokeReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRevokingSub(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'ফিরে যান' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleRevoke}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {isBn ? 'অ্যাক্সেস বাতিল করুন' : 'Confirm Revocation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SCREENSHOT LIGHTBOX MODAL                                            */}
      {/* ==================================================================== */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-sm text-slate-900">
                {isBn ? 'পেমেন্ট স্ক্রিনশট প্রিভিউ' : 'Payment Screenshot Preview'}
              </h5>
              <button
                type="button"
                onClick={() => setSelectedScreenshot(null)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-lg bg-slate-100 flex items-center justify-center p-2">
              <img src={selectedScreenshot} alt="Payment Receipt" className="max-w-full h-auto rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
