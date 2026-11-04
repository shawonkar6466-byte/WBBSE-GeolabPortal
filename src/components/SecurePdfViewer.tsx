import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Folder,
  FolderOpen,
  FileText,
  Sparkles,
  Check,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  Smartphone,
  ChevronDown,
  Layers,
  ArrowLeft,
  BookOpen,
  Info
} from 'lucide-react';

export interface ChapterDef {
  num: number;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  topicsCovered: string;
}

export const WBBSE_CHAPTERS: ChapterDef[] = [
  {
    num: 1,
    nameBn: 'বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ',
    nameEn: 'Exogenetic Processes & Resultant Landforms',
    descBn: 'নদী, হিমবাহ ও বায়ুর ক্ষয়-সঞ্চয় কার্যের চিত্রসহ সম্পূর্ণ সমাধান ও পার্থক্য ছক',
    descEn: 'Erosional & depositional landforms by river, glacier and wind with diagrams',
    topicsCovered: 'জলপ্রপাত, গিরিখাত, ঝুলন্ত উপত্যকা, বার্খান, ইনসেলবার্জ, ইয়ারদাং'
  },
  {
    num: 2,
    nameBn: 'বায়ুমণ্ডল (Atmosphere)',
    nameEn: 'Atmosphere',
    descBn: 'বায়ুমণ্ডলের স্তরবিন্যাস, উষ্ণতার তারতম্য, চাপবলয়, নিয়ত বায়ুপ্রবাহ ও শৈলোৎক্ষেপ বৃষ্টিপাত',
    descEn: 'Thermal layers, global pressure belts, planetary winds and orographic rain',
    topicsCovered: 'ট্রপোস্ফিয়ার, আয়নোস্ফিয়ার, জেড বায়ুপ্রবাহ, ঘূর্ণবাত, সমোষ্ণরেখা'
  },
  {
    num: 3,
    nameBn: 'বারিমণ্ডল (Hydrosphere)',
    nameEn: 'Hydrosphere',
    descBn: 'সমুদ্রস্রোত উৎপত্তির কারণ, মগ্নচড়া, চিত্রসহ জোয়ার-ভাটা ও কোটালের বৈজ্ঞানিক বিশ্লেষণ',
    descEn: 'Ocean currents causes & effects, tides mechanism and spring/neap tides',
    topicsCovered: 'উপসাগরীয় স্রোত, হিমপ্রাচীর, ভরা কোটাল, মরা কোটাল, অ্যাপোজি, পেরিজি'
  },
  {
    num: 4,
    nameBn: 'বর্জ্য ব্যবস্থাপনা (Waste Management)',
    nameEn: 'Waste Management',
    descBn: 'বর্জ্যের উৎস, পরিবেশ ও স্বাস্থ্যের ওপর প্রভাব, 4R পদ্ধতি এবং শিক্ষার্থীদের ভূমিকা',
    descEn: 'Sources of waste, environmental hazards, 4R concept and student initiatives',
    topicsCovered: 'জৈব ভঙ্গুর ও অভঙ্গুর বর্জ্য, ল্যান্ডফিল গ্যাস, কম্পোস্টিং, ইউট্রোফিকেশন'
  },
  {
    num: 5,
    nameBn: 'ভারত - প্রাকৃতিক ও অর্থনৈতিক পরিবেশ',
    nameEn: 'India - Physical & Economic Environment',
    descBn: 'হিমালয় ও দাক্ষিণাত্যের ভূপ্রকৃতি, মৌসুমি জলবায়ু, কৃষি, লৌহ-ইস্পাত শিল্প ও জনসংখ্যা',
    descEn: 'Physiography of India, monsoons, cash crops, iron-steel industries & population',
    topicsCovered: 'উত্তর ভারতের নদনদী, কৃষ্ণ মৃত্তিকা, চা ও গম চাষ, তথ্যপ্রযুক্তি শিল্প'
  },
  {
    num: 6,
    nameBn: 'উপগ্রহ চিত্র ও ভূ-বৈচিত্র্যসূচক মানচিত্র',
    nameEn: 'Satellite Imagery & Topographical Maps',
    descBn: 'উপগ্রহ চিত্রের বৈশিষ্ট্য, টোপো মানচিত্রের সাথে পার্থক্য, দূরসংবেদন পর্যায় ও FCC',
    descEn: 'Satellite imagery characteristics, toposheet differences, remote sensing & FCC',
    topicsCovered: 'ফলস কালার কম্পোজিট (FCC), প্ল্যাটফর্ম ও সেন্সর, মিলিয়ন শিট, কনট্যুর'
  }
];

export interface SubFolderDef {
  marksType: '2m' | '3m' | '5m';
  titleBn: string;
  titleEn: string;
  badgeBn: string;
  badgeEn: string;
  badgeColor: string;
  descBn: string;
  descEn: string;
  pages: number;
}

export const SUB_FOLDERS: SubFolderDef[] = [
  {
    marksType: '2m',
    titleBn: '২ নম্বরের সংক্ষিপ্ত প্রশ্ন-উত্তর সাব-ফোল্ডার',
    titleEn: '2 Marks Short Answer Sub-Folder',
    badgeBn: '২ নম্বর',
    badgeEn: '2 Marks',
    badgeColor: 'bg-purple-600',
    descBn: 'সংজ্ঞা, সুনির্দিষ্ট বৈশিষ্ট্য, ভৌগোলিক কারণ ও সঠিক উদাহরণসমৃদ্ধ শর্ট মডেল শিট।',
    descEn: 'Definitions, key characteristics, geographic reasoning and exact examples.',
    pages: 4
  },
  {
    marksType: '3m',
    titleBn: '৩ নম্বরের ব্যাখ্যামূলক প্রশ্ন-উত্তর সাব-ফোল্ডার',
    titleEn: '3 Marks Analytical Answer Sub-Folder',
    badgeBn: '৩ নম্বর',
    badgeEn: '3 Marks',
    badgeColor: 'bg-emerald-600',
    descBn: 'পয়েন্টভিত্তিক বৈজ্ঞানিক কারণ, তুলনামূলক পার্থক্য ছক ও সংক্ষিপ্ত চিত্র নির্দেশিকা।',
    descEn: 'Point-wise scientific causes, comparison tables and concise diagram outlines.',
    pages: 4
  },
  {
    marksType: '5m',
    titleBn: '৫ নম্বরের সচিত্র রচনাধর্মী প্রশ্ন-উত্তর সাব-ফোল্ডার',
    titleEn: '5 Marks Long Answer Sub-Folder',
    badgeBn: '৫ নম্বর',
    badgeEn: '5 Marks',
    badgeColor: 'bg-red-600',
    descBn: 'মাধ্যমিকের সম্ভাব্য পূর্ণমান উত্তরের চিত্রসহ বিবরণ, পয়েন্টভিত্তিক আলোচনা ও মূল্যায়ন গাইড।',
    descEn: 'Full marks model answers with hand-drawn diagram sketches and evaluation guides.',
    pages: 4
  }
];

interface Props {
  user: any;
  language: 'Bengali' | 'English';
  onNavigateToPricing?: () => void;
  initialChapter?: number;
  initialMarks?: '2m' | '3m' | '5m';
  initialTier?: 'paid' | 'free';
}

export const SecurePdfViewer: React.FC<Props> = ({
  user,
  language,
  onNavigateToPricing,
  initialChapter = 1,
  initialMarks = '5m',
  initialTier = 'paid'
}) => {
  const isBn = language === 'Bengali';

  // Navigation State: Which chapter is expanded, which chapter & sub-folder is active
  const [expandedChapter, setExpandedChapter] = useState<number | null>(initialChapter || 1);
  const [activeChapter, setActiveChapter] = useState<number>(initialChapter || 1);
  const [activeMarks, setActiveMarks] = useState<'2m' | '3m' | '5m'>(initialMarks || '5m');
  const [activeTier, setActiveTier] = useState<'paid' | 'free'>(initialTier || 'paid');
  const [activeLang, setActiveLang] = useState<'Bengali' | 'English'>(language || 'Bengali');

  // Reader States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(4);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

  // Security Toast
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Subscription & Pricing State
  const [subStatus, setSubStatus] = useState<any>(null);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [selectedPlanForPay, setSelectedPlanForPay] = useState<string>('full_syllabus_bundle');
  const [payUpiRef, setPayUpiRef] = useState<string>('');
  const [payAmount, setPayAmount] = useState<number>(149);
  const [screenshotData, setScreenshotData] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [submittingPayment, setSubmittingPayment] = useState<boolean>(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Uploaded admin answer sheet (if available for this sub-folder)
  const [customSheet, setCustomSheet] = useState<any>(null);
  const [loadingCustomSheet, setLoadingCustomSheet] = useState<boolean>(false);

  // DRM Config
  const [drmConfig, setDrmConfig] = useState<any>({
    upi_id: 'shawonkar6466-1@oksbi',
    admin_phone: '7001257277',
    admin_whatsapp: '7001257277'
  });

  const getHeaders = () => {
    const headers: Record<string, string> = {};
    if (user) {
      headers['x-user-id'] = user.username || '';
      headers['x-username'] = user.username || '';
      headers['x-user-name'] = user.full_name || '';
      headers['x-user-phone'] = user.phone || '';
      headers['x-user-role'] = user.role || 'student';
    }
    return headers;
  };

  const fetchDrmConfig = async () => {
    try {
      const res = await fetch('/api/drm/config');
      if (res.ok) {
        const data = await res.json();
        setDrmConfig(data);
      }
    } catch (_) {}
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/payments/subscription_status', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSubStatus(data);
      }
    } catch (e) {
      console.error('Error fetching subscription status:', e);
    }
  };

  // Check if Admin has uploaded custom PDF/answer sheet for this sub-folder
  const fetchCustomSheet = async () => {
    setLoadingCustomSheet(true);
    try {
      const res = await fetch(
        `/api/chapter_answer_sheets?topic_id=${activeChapter}&marks_type=${activeMarks}&access_tier=${activeTier}&language=${activeLang}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCustomSheet(data[0]);
        } else {
          setCustomSheet(null);
        }
      } else {
        setCustomSheet(null);
      }
    } catch (_) {
      setCustomSheet(null);
    } finally {
      setLoadingCustomSheet(false);
    }
  };

  useEffect(() => {
    fetchDrmConfig();
    fetchSubscriptionStatus();
  }, [user]);

  useEffect(() => {
    fetchCustomSheet();
    setCurrentPage(1);
  }, [activeChapter, activeMarks, activeTier, activeLang]);

  // Determine current material ID for DRM rendering
  const materialId = `ch${activeChapter}_${activeMarks}`;

  // Check if the current user has access to read the active tier
  const isPaidUser =
    subStatus?.hasActiveSubscription ||
    subStatus?.isAdmin ||
    user?.role === 'admin' ||
    user?.is_admin === 1 ||
    user?.role === 'teacher';

  const isCurrentSelectionUnlocked = activeTier === 'free' || isPaidUser;

  // Load watermarked page image directly from DRM service
  const loadPageImage = async (matId: string, pageNum: number) => {
    if (!matId || pageNum < 1) return;
    setLoadingPage(true);
    setImageError(null);

    try {
      const res = await fetch(`/api/materials/${matId}/pages/${pageNum}`, {
        headers: getHeaders(),
        cache: 'no-store'
      });

      if (!res.ok) {
        if (res.status === 403) {
          const errJson = await res.json().catch(() => ({}));
          setImageError(
            errJson.message ||
              (isBn
                ? 'এই পৃষ্ঠাটি পড়ার জন্য পেইড সাবস্ক্রিপশন প্রয়োজন।'
                : 'Active subscription required to read this page.')
          );
        } else {
          setImageError(isBn ? 'পৃষ্ঠা লোড করতে ত্রুটি হয়েছে।' : 'Failed to render PDF page.');
        }
        setLoadingPage(false);
        return;
      }

      const blob = await res.blob();
      const newUrl = URL.createObjectURL(blob);

      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }

      setImageBlobUrl(newUrl);
    } catch (err: any) {
      console.error('Error loading DRM page:', err);
      setImageError(isBn ? 'পৃষ্ঠা রেন্ডার করতে নেটওয়ার্ক ত্রুটি হয়েছে।' : 'Network error loading page.');
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    if (isCurrentSelectionUnlocked) {
      loadPageImage(materialId, currentPage);
    }
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
    };
  }, [materialId, currentPage, isCurrentSelectionUnlocked]);

  // Anti-Piracy Event Listeners (Print, Save, Copy protection)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'u')) {
        e.preventDefault();
        setSecurityWarning(
          isBn
            ? '⚠️ কপিরাইট সুরক্ষা: পৃষ্ঠা প্রিন্ট বা ডাউনলোড করা সম্পূর্ণ নিষিদ্ধ। ইন-অ্যাপ ভিউয়ারে পড়ুন।'
            : '⚠️ DRM Notice: Downloading or printing this page is prohibited. Use the in-app viewer.'
        );
        setTimeout(() => setSecurityWarning(null), 3500);
      }
      if (e.key === 'PrintScreen') {
        setSecurityWarning(
          isBn
            ? '⚠️ সিকিউরিটি অ্যালার্ট: প্রতিটি পাতায় আপনার নাম ও ফোন নম্বরের দৃশ্যমান ফরেনসিক ওয়াটারমার্ক রয়েছে।'
            : '⚠️ Security Alert: Every page is dynamically watermarked with your user credentials.'
        );
        setTimeout(() => setSecurityWarning(null), 4000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBn]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(drmConfig.upi_id || 'shawonkar6466-1@oksbi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPayError(isBn ? 'স্ক্রিনশট ফাইলের সাইজ ৫ এমবি এর কম হতে হবে।' : 'Screenshot must be under 5MB.');
      return;
    }
    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayError(null);
    setPaySuccessMsg(null);

    const cleanUtr = payUpiRef.trim();
    if (cleanUtr.length < 6) {
      setPayError(isBn ? 'সঠিক ১২ বা ৬ ডিজিটের UPI রেফারেন্স / UTR নম্বর লিখুন।' : 'Enter a valid UPI Reference / UTR number.');
      return;
    }

    setSubmittingPayment(true);
    try {
      const res = await fetch('/api/payments/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getHeaders()
        },
        body: JSON.stringify({
          username: user?.username || '',
          user_name: user?.full_name || '',
          phone: user?.phone || '',
          item_type: 'MASTER_PDF_BUNDLE',
          item_id: selectedPlanForPay,
          amount: payAmount,
          upi_ref: cleanUtr,
          screenshot_file_name: screenshotFileName,
          screenshot_file_data: screenshotData
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPayError(data.message || (isBn ? 'পেমেন্ট জমা দেওয়া ব্যর্থ হয়েছে।' : 'Payment submission failed.'));
      } else {
        setPaySuccessMsg(data.message || (isBn ? 'আপনার পেমেন্ট সফলভাবে জমা হয়েছে! অ্যাডমিন শীঘ্রই অনুমোদন করবেন।' : 'Payment submitted successfully!'));
        setPayUpiRef('');
        setScreenshotData('');
        setScreenshotFileName('');
        fetchSubscriptionStatus();
      }
    } catch (err: any) {
      setPayError(isBn ? 'নেটওয়ার্ক ত্রুটির কারণে জমা দেওয়া সম্ভব হয়নি।' : 'Network error.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const currentChapterObj = WBBSE_CHAPTERS.find(c => c.num === activeChapter) || WBBSE_CHAPTERS[0];
  const currentSubFolderObj = SUB_FOLDERS.find(s => s.marksType === activeMarks) || SUB_FOLDERS[2];

  return (
    <div className="space-y-6" ref={viewerContainerRef}>
      {/* Top DRM Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 rounded-3xl shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-black tracking-tight">
                {isBn ? 'মাস্টার ২/৩/৫ নম্বরের সুরক্ষিত PDF রিডার (DRM Portal)' : 'Master 2/3/5 Marks Secure PDF Reader (DRM)'}
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {isBn
                ? 'পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদের (WBBSE) দশম শ্রেণির ভূগোল পরীক্ষার ৬টি অধ্যায়ের ২, ৩ ও ৫ নম্বরের অধ্যায়ভিত্তিক সাব-ফোল্ডার মাস্টার উত্তরপত্র। ফাইল কপিরাইট ও ডায়নামিক ফরেনসিক ওয়াটারমার্কে সুরক্ষিত।'
                : 'Complete chapter-wise 2, 3 & 5 marks model answers for WBBSE Class 10 Geography across all 6 chapters. Dynamic forensic watermark & copy protected.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isPaidUser ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black flex items-center gap-1.5 shadow-xs">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>
                  {subStatus?.isAdmin || user?.role === 'admin'
                    ? (isBn ? '👑 হেড অ্যাডমিন সম্পূর্ণ অ্যাক্সেস' : '👑 Head Admin Full Access')
                    : isBn
                    ? `পেইড সাবস্ক্রিপশন সক্রিয় (${subStatus?.subscription?.daysLeft ?? 365} দিন বাকি)`
                    : `Active Subscription (${subStatus?.subscription?.daysLeft ?? 365} days)`}
                </span>
              </div>
            ) : subStatus?.status === 'pending_approval' ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span>{isBn ? 'পেমেন্ট যাচাইকরণ চলছে' : 'Payment Under Review'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPayModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{isBn ? 'সম্পূর্ণ প্যাকেজ আনলক করুন (₹149)' : 'Unlock Full Access (₹149)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Warning Toast */}
      {securityWarning && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{securityWarning}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6 CHAPTERS & 2/3/5 MARKS SUB-FOLDERS DIRECTORY ACCORDION            */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-base">
              {isBn ? 'অধ্যায় ও সাব-ফোল্ডার ডিরেক্টরি (Chapter & Sub-Folder Directory)' : 'Chapters & Sub-Folders Directory'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {isBn
              ? 'যেকোনো অধ্যায়ে ক্লিক করে তার নিচের ২, ৩ ও ৫ নম্বরের সাব-ফোল্ডার খুলুন'
              : 'Click any chapter to reveal its 2M, 3M & 5M sub-folders'}
          </span>
        </div>

        {/* 6 Chapters Accordion List */}
        <div className="space-y-3">
          {WBBSE_CHAPTERS.map(chapter => {
            const isChapterExpanded = expandedChapter === chapter.num;
            const isChapterActive = activeChapter === chapter.num;

            return (
              <div
                key={chapter.num}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isChapterActive
                    ? 'border-indigo-300 bg-indigo-50/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Chapter Row Header */}
                <button
                  type="button"
                  onClick={() => {
                    setExpandedChapter(isChapterExpanded ? null : chapter.num);
                    setActiveChapter(chapter.num);
                  }}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition ${
                        isChapterActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {chapter.num}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                          {isBn ? `অধ্যায় ${chapter.num}` : `Chapter ${chapter.num}`}
                        </span>
                        {isChapterActive && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                            {isBn ? 'সিলেক্টেড' : 'Selected'}
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                        {isBn ? chapter.nameBn : chapter.nameEn}
                      </h4>
                      <p className="text-xs text-slate-500 truncate hidden sm:block">
                        {isBn ? chapter.descBn : chapter.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-slate-500 hidden md:inline">
                      {isBn ? '৩টি সাব-ফোল্ডার' : '3 Sub-Folders'}
                    </span>
                    <div
                      className={`p-1.5 rounded-xl bg-slate-100 text-slate-600 transition-transform ${
                        isChapterExpanded ? 'rotate-180 bg-indigo-100 text-indigo-700' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Sub-Folders (2 Marks, 3 Marks, 5 Marks) */}
                {isChapterExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/80 animate-in fade-in duration-150">
                    <p className="text-[11px] text-slate-500 font-semibold mb-2.5 flex items-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>
                        {isBn
                          ? `অধ্যায় ${chapter.num} এর সংরক্ষিত প্রশ্ন-উত্তর সাব-ফোল্ডারসমূহ (যেকোনোটিতে ক্লিক করে রিডারে খুলুন):`
                          : `Saved question-answer sub-folders for Chapter ${chapter.num} (Click to open):`}
                      </span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {SUB_FOLDERS.map(sub => {
                        const isSubActive =
                          activeChapter === chapter.num && activeMarks === sub.marksType;

                        return (
                          <button
                            key={sub.marksType}
                            type="button"
                            onClick={() => {
                              setActiveChapter(chapter.num);
                              setActiveMarks(sub.marksType);
                              setCurrentPage(1);
                              // Smooth scroll to reader
                              const readerElem = document.getElementById('drm-reader-viewport');
                              if (readerElem) {
                                readerElem.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden ${
                              isSubActive
                                ? 'bg-white border-indigo-600 ring-2 ring-indigo-600 shadow-sm'
                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span
                                className={`text-[10px] text-white font-extrabold px-2.5 py-0.5 rounded-md ${sub.badgeColor}`}
                              >
                                {isBn ? sub.badgeBn : sub.badgeEn}
                              </span>

                              {isPaidUser ? (
                                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'আনলকড' : 'Unlocked'}</span>
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'ফ্রি স্যাম্পল + পেইড' : 'Sample + Paid'}</span>
                                </span>
                              )}
                            </div>

                            <h5 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 mb-1">
                              {isBn ? sub.titleBn : sub.titleEn}
                            </h5>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {isBn ? sub.descBn : sub.descEn}
                            </p>

                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                              <span className="text-slate-400">
                                {isBn ? `পৃষ্ঠা: ${sub.pages}` : `Pages: ${sub.pages}`}
                              </span>
                              <span
                                className={`flex items-center gap-1 ${
                                  isSubActive ? 'text-indigo-600' : 'text-blue-600'
                                }`}
                              >
                                <span>{isSubActive ? (isBn ? '• রিডারে খোলা' : '• Active') : (isBn ? 'রিডারে খুলুন →' : 'Open →')}</span>
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ACTIVE SUB-FOLDER DRM FULL VIEWPORT                                  */}
      {/* ==================================================================== */}
      <div
        id="drm-reader-viewport"
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Active Sub-Folder Breadcrumb & Control Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-blue-50/40 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-bold mb-1">
                <Folder className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isBn ? 'মাস্টার রিডার' : 'Master Reader'}</span>
                <span>/</span>
                <span>{isBn ? `অধ্যায় ${activeChapter}` : `Chapter ${activeChapter}`}</span>
                <span>/</span>
                <span className="text-slate-900">
                  {isBn ? currentSubFolderObj.badgeBn : currentSubFolderObj.badgeEn}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {isBn ? `অধ্যায় ${activeChapter}: ${currentChapterObj.nameBn}` : `Chapter ${activeChapter}: ${currentChapterObj.nameEn}`}
                {' — '}
                <span className="text-indigo-700">
                  {isBn ? currentSubFolderObj.titleBn : currentSubFolderObj.titleEn}
                </span>
              </h3>
            </div>

            {/* Language & Tier Toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Language Switcher */}
              <div className="bg-white rounded-xl border border-slate-300 p-1 flex items-center shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveLang('Bengali')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeLang === 'Bengali'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang('English')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeLang === 'English'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Version/Tier Switcher: Paid Full vs Free Sample */}
              <div className="bg-white rounded-xl border border-slate-300 p-1 flex items-center shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTier('free')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    activeTier === 'free'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>📄</span>
                  <span>{isBn ? 'ফ্রি স্যাম্পল' : 'Free Sample'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTier('paid')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    activeTier === 'paid'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>⭐</span>
                  <span>{isBn ? 'পেইড সম্পূর্ণ কপি' : 'Paid Full Sheet'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Folder Information Banner */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60 gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {activeTier === 'free'
                  ? (isBn
                      ? 'আপনি সাধারণ শিক্ষার্থীদের জন্য বিনামূল্যে উন্মুক্ত স্যাম্পল উত্তরপত্র দেখছেন (কোনো প্যাকেজ কেনার প্রয়োজন নেই)।'
                      : 'Viewing the Free Sample answer copy (No package purchase required).')
                  : (isBn
                      ? 'অফিসিয়াল সম্পূর্ণ চিত্রসংবলিত মডেল উত্তরপত্র ও মূল্যায়ন নির্দেশিকা (পেইড আনলিমিটেড অ্যাক্সেস)।'
                      : 'Official complete model answer sheet with full diagrams and evaluation guides.')}
              </span>
            </span>

            {/* Custom sheet uploaded notice if present */}
            {customSheet && (
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                📎 {customSheet.file_name} (By: {customSheet.uploaded_by})
              </span>
            )}
          </div>
        </div>

        {/* Reader Navigation & Zoom Controls Bar */}
        {isCurrentSelectionUnlocked && (
          <div className="p-3 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                {isBn ? `পৃষ্ঠা ${currentPage} / ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                • {isBn ? 'ইন-পোর্টাল সুরক্ষিত ভিউয়ার' : 'In-Portal DRM Viewer'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Page buttons */}
              <div className="flex items-center bg-white rounded-xl border border-slate-300 p-0.5">
                <button
                  type="button"
                  disabled={currentPage <= 1 || loadingPage}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 text-xs font-black text-slate-800 font-mono">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages || loadingPage}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom controls */}
              <div className="hidden sm:flex items-center bg-white rounded-xl border border-slate-300 p-0.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-semibold text-slate-700 font-mono">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(175, prev + 15))}
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Reader Display Canvas Area */}
        <div className="relative bg-slate-200/90 p-3 sm:p-8 min-h-[540px] flex items-center justify-center overflow-auto">
          {/* Case 1: Active selection is Paid but student has NOT purchased */}
          {!isCurrentSelectionUnlocked ? (
            <div className="max-w-lg w-full my-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 text-center shadow-lg space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg sm:text-xl font-black text-slate-900">
                  {isBn
                    ? `অধ্যায় ${activeChapter} এর ${currentSubFolderObj.badgeBn} সম্পূর্ণ পেইড উত্তরপত্রটি সংরক্ষিত`
                    : `Chapter ${activeChapter} ${currentSubFolderObj.badgeEn} Paid Master Sheet is Protected`}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isBn
                    ? 'অননুমোদিত শেয়ারিং রুখতে GeoLabPortal সম্পূর্ণ মডেল কপি ইন-পোর্টাল সুরক্ষিত রিডারে প্রদান করে। আপনি প্যাকেজ না কিনলেও বিনামূল্যে "ফ্রি স্যাম্পল" পড়তে পারবেন।'
                    : 'To protect intellectual property, full answer sheets are displayed inside the secure portal reader. Free samples are available to everyone.'}
                </p>
              </div>

              {/* Free Sample Switcher Button (Crucial Requirement!) */}
              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-xs text-blue-900">
                    {isBn ? '📄 বিনামূল্যে সাধারণ সংস্করণ উপলব্ধ' : '📄 Free Sample Copy Available'}
                  </div>
                  <div className="text-[11px] text-blue-700">
                    {isBn ? 'কোনো টাকা না দিয়েই এই অধ্যায়ের স্যাম্পল পড়তে পারবেন।' : 'Read this chapter sample answers for free.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTier('free')}
                  className="st-btn bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-4 rounded-xl font-black shadow-xs shrink-0 cursor-pointer"
                >
                  {isBn ? 'বিনামূল্যে স্যাম্পল পড়ুন →' : 'Read Free Sample →'}
                </button>
              </div>

              {/* Payment Verification Status or Unlock Button */}
              {subStatus?.status === 'pending_approval' ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>{isBn ? 'পেমেন্ট যাচাইকরণ প্রক্রিয়াধীন' : 'Payment Under Verification'}</span>
                  </div>
                  <p className="text-[11px] text-slate-700">
                    {isBn
                      ? `Transaction UTR: ${subStatus.pendingPayment?.upi_ref || 'দেওয়া হয়েছে'}। হেড অ্যাডমিন (শাওন স্যার) যাচাই করার সাথে সাথে আপনার অ্যাকাউন্টটি সক্রিয় হয়ে যাবে।`
                      : `Your transaction ID (${subStatus.pendingPayment?.upi_ref || 'Submitted'}) is pending admin approval.`}
                  </p>
                  <a
                    href={`https://wa.me/91${drmConfig.admin_whatsapp}?text=${encodeURIComponent(
                      `নমস্কার স্যার, আমি GeoLabPortal এ মাস্টার PDF এর জন্য UPI পেমেন্ট করেছি। আমার ফোন নম্বর: ${user?.phone}, UTR: ${subStatus.pendingPayment?.upi_ref}. অনুগ্রহ করে আনলক করে দিন।`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline pt-1"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isBn ? '💬 হোয়াটসঅ্যাপে দ্রুত অনুমোদনের জন্য বার্তা পাঠান' : '💬 WhatsApp Admin for Fast Approval'}</span>
                  </a>
                </div>
              ) : (
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(true)}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>{isBn ? 'সম্পূর্ণ প্যাকেজ আনলক করুন (মাত্র ₹149)' : 'Unlock Full Access (Only ₹149)'}</span>
                  </button>
                  <p className="text-[10px] text-slate-400">
                    {isBn ? '🔒 ফোনপে / গুগল পে / পেটিএম এর মাধ্যমে এককালীন পেমেন্ট' : 'Secure instant payment via any UPI App'}
                  </p>
                </div>
              )}
            </div>
          ) : loadingPage ? (
            <div className="py-28 text-center space-y-3">
              <RefreshCw className="w-9 h-9 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-black text-slate-700">
                {isBn
                  ? 'সুরক্ষিত ওয়াটারমার্ক ও উচ্চমানের ডিজিটাল পৃষ্ঠা লোড হচ্ছে...'
                  : 'Rendering watermarked DRM page...'}
              </p>
            </div>
          ) : imageError ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl max-w-md text-center space-y-2 shadow-sm">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
              <h5 className="font-bold text-sm text-red-900">
                {isBn ? 'পৃষ্ঠা প্রদর্শনে সাময়িক ত্রুটি' : 'Failed to display page'}
              </h5>
              <p className="text-xs text-red-700">{imageError}</p>
              <button
                type="button"
                onClick={() => loadPageImage(materialId, currentPage)}
                className="mt-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
              >
                {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
              </button>
            </div>
          ) : imageBlobUrl ? (
            /* SECURE HIGH-RES RENDER CANVAS CONTAINER WITH ANTI-COPY SHIELD */
            <div
              className="relative select-none shadow-2xl rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                width: `${zoomLevel}%`,
                maxWidth: '920px',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
              onContextMenu={e => e.preventDefault()}
              onDragStart={e => e.preventDefault()}
            >
              {/* Server-Rendered Watermarked Page Image */}
              <img
                src={imageBlobUrl}
                alt={`DRM Page ${currentPage}`}
                className="w-full h-auto block pointer-events-none"
                draggable={false}
              />

              {/* Invisible Anti-Right-Click / Anti-Drag Overlay Shield */}
              <div
                className="absolute inset-0 z-20 cursor-default bg-transparent"
                onContextMenu={e => {
                  e.preventDefault();
                  setSecurityWarning(
                    isBn
                      ? '⚠️ কপিরাইট সুরক্ষিত: রাইট-ক্লিক বা সেভ অপশন নিষ্ক্রিয়।'
                      : '⚠️ DRM protected: Context menu and saving are disabled.'
                  );
                  setTimeout(() => setSecurityWarning(null), 3000);
                }}
                onDragStart={e => e.preventDefault()}
              />
            </div>
          ) : null}
        </div>

        {/* Reader Footer Info with Student Identity Watermark Confirmation */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {isBn
                ? `লাইসেন্সপ্রাপ্ত ছাত্রছাত্রী: ${user?.full_name || 'GeoLab Student'} (${user?.phone ? user.phone.slice(0, 4) + '***' + user.phone.slice(-3) : 'User'})`
                : `Licensed student: ${user?.full_name || 'Student'}`}
            </span>
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            {isBn
              ? '🔒 ইন-অ্যাপ সুরক্ষিত ভিউয়ার: ডাউনলোড বা কপি সম্পূর্ণ নিষিদ্ধ'
              : '🔒 Secure In-App Viewer: Downloading or copying is strictly disabled'}
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* UPI PAYMENT & TRANSACTION SUBMISSION MODAL                           */}
      {/* ==================================================================== */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {isBn ? 'মাস্টার PDF সাবস্ক্রিপশন ও অ্যাক্টিভেশন' : 'Master PDF Subscription'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Plan Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {isBn ? 'প্ল্যান নির্বাচন করুন:' : 'Select Plan:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlanForPay('full_syllabus_bundle');
                    setPayAmount(149);
                  }}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                    selectedPlanForPay === 'full_syllabus_bundle'
                      ? 'border-indigo-600 bg-indigo-50/80 ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">
                    {isBn ? '👑 সম্পূর্ণ সিলেবাস বান্ডিল' : '👑 Full Syllabus Bundle'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isBn ? 'সমস্ত অধ্যায়ের ২/৩/৫ নম্বর' : 'All 2, 3 & 5 Marks'}
                  </div>
                  <div className="text-indigo-700 font-extrabold text-sm mt-1">₹149 / বছর</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlanForPay('5m_master_bundle');
                    setPayAmount(49);
                  }}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                    selectedPlanForPay === '5m_master_bundle'
                      ? 'border-indigo-600 bg-indigo-50/80 ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">
                    {isBn ? '⭐ ৫ নম্বরের স্পেশাল প্যাক' : '⭐ 5 Marks Special Pack'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isBn ? 'রচনাধর্মী প্রশ্ন ও চিত্র গাইড' : 'Long answers & diagrams'}
                  </div>
                  <div className="text-indigo-700 font-extrabold text-sm mt-1">₹49 / বছর</div>
                </button>
              </div>
            </div>

            {/* UPI QR & Payment Instructions */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{isBn ? 'অফিসিয়াল UPI আইডি:' : 'Official UPI ID:'}</span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                  <span>{copiedUpi ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'কপি করুন' : 'Copy')}</span>
                </button>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono text-center text-sm font-bold text-slate-900 select-all">
                {drmConfig.upi_id || 'shawonkar6466-1@oksbi'}
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                {isBn
                  ? 'PhonePe / Google Pay / Paytm বা যেকোনো UPI অ্যাপ দিয়ে পেমেন্ট করে নিচের বক্সে ১২ ডিজিটের UTR নম্বর লিখুন।'
                  : 'Pay via PhonePe/GPay/Paytm and enter the 12-digit UTR/Ref number below.'}
              </p>
            </div>

            {/* Payment Submission Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isBn ? 'UPI রেফারেন্স / UTR নম্বর লিখুন *' : 'UPI Reference / UTR Number *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 428712345678"
                  value={payUpiRef}
                  onChange={e => setPayUpiRef(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isBn ? 'পেমেন্ট স্ক্রিনশট আপলোড (ঐচ্ছিক):' : 'Upload Payment Screenshot (Optional):'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              {payError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold">
                  {payError}
                </div>
              )}

              {paySuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold">
                  {paySuccessMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submittingPayment}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {submittingPayment ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>
                  {submittingPayment
                    ? (isBn ? 'যাচাইয়ের জন্য পাঠানো হচ্ছে...' : 'Submitting...')
                    : (isBn ? `পেমেন্ট সম্পন্ন করুন (₹${payAmount})` : `Complete Payment (₹${payAmount})`)}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
