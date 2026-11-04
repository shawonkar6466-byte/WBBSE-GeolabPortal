import React, { useState } from 'react';
import { Download, Copy, Check, Printer, FileText, Phone, Mail, Award, Users, BookOpen, Smartphone, ShieldCheck, Share2, Sparkles, GraduationCap, ChevronLeft, ChevronRight, Eye, Layers, KeyRound, CheckSquare, MessageSquare, ExternalLink } from 'lucide-react';

interface Props {
  language: 'Bengali' | 'English';
}

export const SchoolProspectusSection: React.FC<Props> = ({ language }) => {
  const [copied, setCopied] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [viewMode, setViewMode] = useState<'slides' | 'full'>('slides');
  const [isDownloading, setIsDownloading] = useState(false);
  const isBn = language === 'Bengali';

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/download-prospectus');
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'WBBSE_Geography_App_Prospectus_Teachers_Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.location.href = '/api/download-prospectus';
    } finally {
      setIsDownloading(false);
    }
  };

  const socialMediaBroadcastText = `🌍 *পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ (WBBSE) দশম শ্রেণি ভূগোল পোর্টাল ও ডিজিটাল ল্যাব*
📖 *মাধ্যমিক ২০২৬-২০২৭ ভূগোল পরীক্ষার সেরা প্রস্তুতি হাব!*

শ্রদ্ধেয় শিক্ষক-শিক্ষিকা, প্রধান শিক্ষক ও অভিভাবকবৃন্দের জন্য সুখবর!
পশ্চিমবঙ্গের মাধ্যমিক পরীক্ষার্থীদের ভূগোল বিষয়ে ৯০%+ নম্বর নিশ্চিত করতে আমাদের ডিজিটাল পোর্টাল এখন উন্মুক্ত:

✨ *প্রধান সুবিধাসমূহ:*
১. *অধ্যায়ভিত্তিক প্রশ্নভান্ডার:* প্রতিটি অধ্যায়ের গুরুত্বপূর্ণ MCQ (তাৎক্ষণিক রেজাল্ট সহ), SAQ এবং ২, ৩ ও ৫ নম্বরের মডেল উত্তরপত্র।
২. *আলাদা PDF গাইড:* সাধারণ শিক্ষার্থীদের জন্য ৩টি ফ্রি এবং পেইড শিক্ষার্থীদের জন্য বিশেষ ৩টি মাস্টার PDF।
৩. *৯০ নম্বরের পূর্ণাঙ্গ মক টেস্ট:* পর্ষদের প্রশ্ন কাঠামো অনুযায়ী টাইমার সহ বাস্তব পরীক্ষার অভিজ্ঞতা।
৪. *শিক্ষকদের খাতা পরীক্ষণ:* অভিজ্ঞ শিক্ষকবৃন্দ সরাসরি ছাত্রছাত্রীদের লেখা খাতা নিরীক্ষণ ও নম্বর প্রদান করবেন।
৫. *মোবাইল ফ্রেন্ডলি অ্যাপ (PWA):* ফোনে সরাসরি ইনস্টল করে দ্রুত ও অফলাইনেও রিভিশন সম্ভব।

👨‍🏫 *শিক্ষকদের জন্য বিশেষ সুযোগ:*
স্কুল ও টিউশন শিক্ষকরা সরাসরি পোর্টালে যুক্ত হয়ে খাতা মূল্যায়ন করতে পারেন এবং হেড অ্যাডমিন কর্তৃক 'কো-অ্যাডমিন' হিসেবে স্বীকৃতি পেতে পারেন।

🎁 *রেফারেল ও স্কলারশিপ পুরস্কার:*
ছাত্রছাত্রী ও স্কুল প্রতিনিধিদের জন্য সর্বোচ্চ ₹৭,৫০০ নগদ গ্র্যান্ড পুরস্কার এবং প্রতি রেফারেলে নগদ প্রণোদনা!

👤 *পরিচালনায়:*
• *শাওন কর* — M.Sc. in Geography (Calcutta University), B.Ed. (BSAEU) [Ph: 7001257277]
• *সুকন্যা চক্রবর্তী* — M.Sc. in Geography (Calcutta University), B.Ed.

🌐 *অ্যাপ লিঙ্ক:* https://ais-pre-u34vh32wi7n4ihmdhg5bxg-366315673383.asia-southeast1.run.app
📄 *প্রস্পেক্টাস PDF:* https://ais-pre-u34vh32wi7n4ihmdhg5bxg-366315673383.asia-southeast1.run.app/api/download-prospectus
📞 *যোগাযোগ ও স্কুল ডেমোনস্ট্রেশন:* 7001257277`;

  const handleCopy = () => {
    navigator.clipboard.writeText(socialMediaBroadcastText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const slides = [
    { id: 1, title: 'কভার ও ওভারভিউ', titleEn: 'Cover & Executive Overview' },
    { id: 2, title: 'আর্কিটেকচার ও নিরাপত্তা', titleEn: 'System Architecture & Roles' },
    { id: 3, title: 'স্টুডেন্ট প্যানেল (পার্ট ১)', titleEn: 'Student Panel: Practice & PDFs' },
    { id: 4, title: 'স্টুডেন্ট প্যানেল (পার্ট ২)', titleEn: 'Student Panel: Mocks & Doubts' },
    { id: 5, title: 'টিচার ও কো-অ্যাডমিন প্যানেল', titleEn: 'Teacher & Co-Admin Evaluation' },
    { id: 6, title: 'হেড অ্যাডমিন কন্ট্রোল (শাওন কর)', titleEn: 'Head Admin Control Engine' },
    { id: 7, title: 'মোবাইল PWA ও অফলাইন', titleEn: 'Mobile PWA & Technology' },
    { id: 8, title: 'স্কুল প্রচার ও সোশ্যাল পোস্ট', titleEn: 'School Mobilization Toolkit' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner & Action Controls (Hidden on Print) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-800/80 relative overflow-hidden no-print">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold">
              <FileText className="w-3.5 h-3.5 text-blue-300" />
              <span>{isBn ? "৮-স্লাইড অফিশিয়াল ডেমো ও প্রস্পেক্টাস প্রেজেন্টেশন (PPT)" : "Official 8-Slide Institutional Presentation"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {isBn
                ? "শিক্ষক, প্রধান শিক্ষক ও স্কুল প্রতিনিধিদের জন্য সম্পূর্ণ পোর্টাল হ্যান্ডবুক"
                : "Complete System Handbook for Teachers & School Administrators"}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              {isBn
                ? "স্টুডেন্ট প্যানেল, টিচার প্যানেল এবং হেড অ্যাডমিন প্যানেলের প্রতিটি নেভিগেশন অপশন, কার্যপ্রণালী ও প্রচার কৌশল নিয়ে বিস্তারিত স্লাইড-বাই-স্লাইড প্রদর্শনী।"
                : "Exhaustive slide-by-slide demonstration of every navigation menu across Student, Teacher, and Admin panels for institutional mobilization."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer disabled:opacity-75"
            >
              <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? (isBn ? "ডাউনলোড হচ্ছে..." : "Downloading...") : (isBn ? "📥 ডাউনলোড ৮-স্লাইড PDF (PPT)" : "Download 8-Slide PDF (PPT)")}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="/WBBSE_Geography_App_Prospectus_Teachers_Report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer border border-blue-400/30 text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isBn ? "ব্রাউজারে ভিউ" : "Open PDF"}</span>
              </a>

              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-600 text-center shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-sky-400" />
                <span>{isBn ? "A4 প্রিন্ট / সেভ" : "Print A4"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="py-2 px-4 rounded-xl bg-white text-slate-900 hover:bg-blue-50 active:scale-95 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm cursor-pointer border border-slate-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
              <span>{copied ? (isBn ? "কপি হয়েছে!" : "Copied!") : (isBn ? "সোশ্যাল মিডিয়া পোস্ট কপি করুন" : "Copy Social Post")}</span>
            </button>
          </div>
        </div>

        {/* Helpful Tip for Printing & Saving */}
        <div className="relative z-10 mt-3 pt-3 border-t border-blue-800/40 text-[11px] text-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span>
              {isBn
                ? "💡 অফলাইনে সরাসরি ফাইল পেতে 'ডাউনলোড PDF' করুন। আর পেপারে বা নিজের ডিভাইসে সম্পূর্ণ A4 প্রেজেন্টেশন সেভ করতে 'A4 প্রিন্ট' চাপুন।"
                : "💡 Use 'Download PDF' for instant offline file, or 'Print A4' to print/save all 8 slides cleanly formatted as A4 landscape."}
            </span>
          </div>
          <span className="text-amber-300 font-bold shrink-0">A4 Landscape • 8 Slides</span>
        </div>

        {/* Slide Selector Carousel Pill Bar */}
        <div className="relative z-10 mt-4 pt-4 border-t border-blue-800/60 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {slides.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setCurrentSlide(s.id);
                  setViewMode('slides');
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                  currentSlide === s.id && viewMode === 'slides'
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-blue-100'
                }`}
              >
                <span>{s.id}. {isBn ? s.title : s.titleEn}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'slides' ? 'full' : 'slides')}
              className="py-1 px-3 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-bold hover:bg-amber-500/30 transition cursor-pointer"
            >
              {viewMode === 'slides' ? (isBn ? "সব স্লাইড একসাথে দেখুন" : "View All Slides") : (isBn ? "স্লাইডার মোড" : "Slide Deck Mode")}
            </button>
          </div>
        </div>
      </div>

      {/* Slide Deck Container */}
      <div className="space-y-6">
        {/* SLIDE 1: COVER & EXECUTIVE OVERVIEW */}
        <div className={`${viewMode === 'slides' && currentSlide !== 1 ? 'hidden print:block' : 'block'} bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6 prospectus-print-slide`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs">
              SLIDE 1 • COVER & FOUNDERS
            </span>
            <span className="text-xs font-bold text-slate-500">Madhyamik 2026-2027</span>
          </div>

          <div className="text-center space-y-3 py-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-3xl shadow-2xs">
              🌍
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              WBBSE CLASS 10 GEOGRAPHY PORTAL & DIGITAL LAB
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-2xl mx-auto">
              {isBn
                ? "পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদের দশম শ্রেণি ভূগোল ও পরিবেশ সিলেবাসের সর্বাধুনিক ডিজিটাল প্রস্তুতি হাব ও প্রাতিষ্ঠানিক হ্যান্ডবুক"
                : "Comprehensive Institutional Demonstration & Candidate Mobilization Handbook"}
            </p>

            {/* Founders Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2 text-left">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-xs shadow-2xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👑</span>
                  <span className="font-black text-amber-950 text-sm">শাওন কর (Shawon Kar)</span>
                </div>
                <span className="text-slate-700 block">M.Sc. in Geography (University of Calcutta)</span>
                <span className="text-slate-700 block">B.Ed. (Baba Saheb Ambedkar Education University)</span>
                <span className="font-extrabold text-amber-900 block pt-1">
                  প্রধান অ্যাডমিন ও চিফ একাডেমিক মেন্টর | 📞 +91 7001257277
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 text-xs shadow-2xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👩‍🏫</span>
                  <span className="font-black text-indigo-950 text-sm">সুকন্যা চক্রবর্তী (Sukannya Chakraborty)</span>
                </div>
                <span className="text-slate-700 block">M.Sc. in Geography (University of Calcutta)</span>
                <span className="text-slate-700 block">B.Ed. (Education University)</span>
                <span className="font-extrabold text-indigo-900 block pt-1">
                  সিনিয়র ফ্যাকাল্টি ও সার্বিক প্রশ্ন মূল্যায়ন সমন্বয়কারী
                </span>
              </div>
            </div>
          </div>

          {/* 3 Pillars Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <div className="font-extrabold text-blue-950 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>শিক্ষার্থীদের প্রস্তুতি</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                পর্ষদের ৬টি অধ্যায়ের পূর্ণাঙ্গ MCQ, SAQ, ২/৩/৫ নম্বরের মডেল উত্তর ও ৯০ নম্বরের মক টেস্ট।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
              <div className="font-extrabold text-purple-950 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>শিক্ষকদের মূল্যায়ন</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                শিক্ষকরা সরাসরি ছাত্রছাত্রীদের লেখা খাতা পরীক্ষণ, ডাউট সলভ ও কো-অ্যাডমিন হিসেবে দায়িত্ব পালন করেন।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="font-extrabold text-amber-950 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>স্কলারশিপ ও পুরস্কার</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                স্কুল প্রতিনিধি ও ছাত্রছাত্রীদের জন্য সর্বোচ্চ ₹৭,৫০০ নগদ গ্র্যান্ড প্রাইজ ও প্রতি রেফারেলে নগদ প্রণোদনা।
              </p>
            </div>
          </div>
        </div>

        {/* SLIDE 2: SYSTEM ARCHITECTURE & TWO-TIER GOVERNANCE */}
        <div className={`${viewMode === 'slides' && currentSlide !== 2 ? 'hidden print:block' : 'block'} bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6 prospectus-print-slide`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-extrabold text-xs">
              SLIDE 2 • PORTAL ARCHITECTURE & SECURITY HIERARCHY
            </span>
            <span className="text-xs font-bold text-slate-500">Role Matrix & Verification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Access Matrix */}
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>ভূমিকা ও প্রবেশাধিকার ম্যাট্রিক্স (Role Access Matrix)</span>
              </h3>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900">🎓 শিক্ষার্থী (Student Candidate)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">ENROLLED</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে প্রবেশ। অধ্যায়ভিত্তিক প্র্যাকটিস, ৯০ মার্কস টেস্ট ও মডেল PDF ডাউনলোড।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">👨‍🏫 অনুমোদিত শিক্ষক (Verified Teacher)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">VERIFIED</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    স্কুল ও প্রাতিষ্ঠানিক তথ্যে রেজিস্টার। হেড অ্যাডমিন কর্তৃক যাচাইয়ের পর খাতা পরীক্ষণ ও ডাউট সমাধান প্যানেল প্রাপ্তি।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900">⭐ সহকারী অ্যাডমিন (Co-Admin Teacher)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">CO-ADMIN</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    হেড অ্যাডমিন কর্তৃক উন্নীত শিক্ষক। শিক্ষার্থী পর্যবেক্ষণ ও প্রশাসনিক প্রস্তাব জমা দেওয়ার অতিরিক্ত অধিকার।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">👑 প্রধান অ্যাডমিন (Head Admin - শাওন কর)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">SUPREME</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    স্থায়ী প্রধান প্রশাসক। শিক্ষক ও কো-অ্যাডমিন অনুমোদন, প্রস্তাবনা রিভিউ ও সেন্ট্রাল ডেটাবেজ এক্সপোর্ট।
                  </p>
                </div>
              </div>
            </div>

            {/* Two-Tier Governance Workflow */}
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>দ্বি-স্তরীয় কো-অ্যাডমিন নিরাপত্তা ও অনুমোদন কিউ</span>
              </h3>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-3 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">১</span>
                  <p className="text-slate-700"><strong>শিক্ষক অ্যাকাউন্ট যাচাই:</strong> যে কোনো শিক্ষক রেজিস্টার করার পর হেড অ্যাডমিন (শাওন স্যার) প্রোফাইল রিভিউ করে অনুমোদন করেন।</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">২</span>
                  <p className="text-slate-700"><strong>কো-অ্যাডমিন পদে পদোন্নতি:</strong> অভিজ্ঞ শিক্ষকদের হেড অ্যাডমিন বিশেষ ক্ষমতাসম্পন্ন 'কো-অ্যাডমিন' হিসেবে উন্নীত করেন।</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">৩</span>
                  <p className="text-slate-700"><strong>নিরাপদ প্রস্তাবনা কিউ:</strong> কো-অ্যাডমিন কোনো শিক্ষার্থী অনুমোদন বা স্থগিত করতে চাইলে তা সাথে সাথে কার্যকর হয় না; তা হেড অ্যাডমিনের রিভিউ কিউতে জমা হয়।</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">৪</span>
                  <p className="text-slate-700"><strong>হেড অ্যাডমিন ফাইনাল এক্সিকিউশন:</strong> হেড অ্যাডমিন প্রস্তাবটি যাচাই করে এক ক্লিকে [Approve & Execute] করলেই তা ডেটাবেজে চূড়ান্ত কার্যকর হয়।</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">৫</span>
                  <p className="text-slate-700"><strong>প্রধান অ্যাডমিন সুরক্ষা গ্যারান্টি:</strong> প্রধান অ্যাডমিন শাওন কর (7001257277) কোনো কো-অ্যাডমিন দ্বারা কখনো স্থগিত বা ডাউনগ্রেড হতে পারেন না।</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDE 3: STUDENT PANEL (PART 1) — DASHBOARD, CHAPTER PRACTICE & DUAL-TIER PDFS */}
        <div className={`${viewMode === 'slides' && currentSlide !== 3 ? 'hidden print:block' : 'block'} bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6 prospectus-print-slide`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs">
              SLIDE 3 • STUDENT PANEL (PART 1)
            </span>
            <span className="text-xs font-bold text-slate-500">Dashboard & Practice Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Dashboard */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-black text-base">
                <span className="text-lg">🏠</span>
                <span>অপশন ১: [🏠 Dashboard] স্টুডেন্ট ড্যাশবোর্ড</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 text-xs space-y-3">
                <div className="p-3 bg-white rounded-xl border border-blue-100">
                  <span className="font-extrabold text-blue-950 block">🎓 মাধ্যমিক ব্যাচ ও মেয়াদ ট্র্যাকার</span>
                  <span className="text-slate-600 text-[11px] block mt-0.5">
                    শিক্ষার্থীর নাম, স্কুল ও জেলা সহ মাধ্যমিক পরীক্ষার ব্যাচ (যেমন MP 2027) এবং ৩১ মার্চ পর্যন্ত অ্যাকাউন্ট সক্রিয় থাকার মেয়াদ দেখায়।
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-blue-100">
                  <span className="font-extrabold text-blue-950 block">🔔 অ্যাডমিন লাইভ নোটিফিকেশন হাব</span>
                  <span className="text-slate-600 text-[11px] block mt-0.5">
                    শাওন স্যারের রুটিন নোটিশ, নতুন সাজেশনের লিংক ও গুরুত্বপূর্ণ পরীক্ষার টিপস সাথে সাথে দৃশ্যমান হয়।
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-blue-100">
                  <span className="font-extrabold text-blue-950 block">🚀 কুইক চ্যাপ্টার লঞ্চপ্যাড ও অগ্রগতি</span>
                  <span className="text-slate-600 text-[11px] block mt-0.5">
                    ৬টি চ্যাপ্টারের অগ্রগতি এবং কোন চ্যাপ্টারে কত প্রশ্ন সমাধান করা হয়েছে তার পরিসংখ্যান।
                  </span>
                </div>
              </div>
            </div>

            {/* Option 2: Practice Center */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-base">
                <span className="text-lg">📖</span>
                <span>অপশন ২: [📖 Practice Center] (৬টি অধ্যায়)</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-emerald-100">
                    <strong>১. বহির্জাত প্রক্রিয়া:</strong> নদী, হিমবাহ, বায়ু
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-100">
                    <strong>২. বায়ুমণ্ডল:</strong> স্তরবিন্যাস, বায়ুপ্রবাহ
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-100">
                    <strong>৩. বারিমণ্ডল:</strong> সমুদ্রস্রোত ও জোয়ার-ভাটা
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-100">
                    <strong>৪. বর্জ্য ব্যবস্থাপনা:</strong> 4R ও পরিবেশ
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-100">
                    <strong>৫. ভারত:</strong> ভূপ্রকৃতি, নদনদী, কৃষি ও শিল্প
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-100">
                    <strong>৬. উপগ্রহ চিত্র:</strong> মানচিত্র ও রিমোট সেন্সিং
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <span className="font-extrabold text-blue-950 block">📂 ডুয়াল টিয়ার PDF সেট (Dual-Tier System)</span>
                  <span className="text-slate-700 text-[11px] block mt-0.5">
                    প্রতিটি অধ্যায়ে সাধারণ শিক্ষার্থীদের জন্য ৩টি ফ্রি প্রশ্ন PDF এবং এনরোল্ড শিক্ষার্থীদের জন্য উত্তরসহ ৩টি বিশেষ মাস্টার PDF।
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDE 4: STUDENT PANEL (PART 2) — MOCK TESTS, DOUBTS, SUBMISSIONS & SCHOLARSHIPS */}
        <div className={`${viewMode === 'slides' && currentSlide !== 4 ? 'hidden print:block' : 'block'} bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6 prospectus-print-slide`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs">
              SLIDE 4 • STUDENT PANEL (PART 2)
            </span>
            <span className="text-xs font-bold text-slate-500">Mocks, Doubts & Referrals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Option 3: Mock Tests */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="text-lg">📄</span>
                <span>[📄 Mock Tests & Suggestions]</span>
              </div>
              <div className="space-y-1.5 text-slate-700 text-[11px]">
                <p><strong>• ৯০ নম্বরের পূর্ণাঙ্গ মক টেস্ট:</strong> মাধ্যমিক পরীক্ষার হুবহু গ্রুপ A, B, C, D, E, F প্রশ্ন কাঠামো।</p>
                <p><strong>• ৩ ঘণ্টা ১৫ মিনিটের লাইভ টাইমার:</strong> বাস্তব পরীক্ষার হলের মতো সময় মেনে লেখার অনুশীলন।</p>
                <p><strong>• খাতা আপলোড সুবিধা:</strong> খাতায় লিখে ক্যামেরা দিয়ে ছবি তুলে সরাসরি শিক্ষকদের কাছে জমা দেওয়ার সুবিধা।</p>
              </div>
            </div>

            {/* Option 4 & 5: Doubts & Submissions */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-2.5">
              <div className="font-extrabold text-purple-950 text-sm flex items-center gap-1.5">
                <span className="text-lg">❓</span>
                <span>[❓ Doubts] & [📝 Submissions]</span>
              </div>
              <div className="space-y-1.5 text-slate-700 text-[11px]">
                <p><strong>• ডাউট সলভ ট্যাব:</strong> যেকোনো প্রশ্নে বুঝতে অসুবিধা হলে "স্যারের কাছে ডাউট পাঠান" বোতামে ক্লিক করে প্রশ্ন জমা দেওয়া যায়।</p>
                <p><strong>• খাতা নিরীক্ষণ ট্র্যাকার:</strong> কোন শিক্ষক খাতা দেখেছেন, কত নম্বর পেয়েছেন ও শিক্ষকের মন্তব্য দেখার সুবিধা।</p>
              </div>
            </div>

            {/* Option 6 & 7: Referrals & Drive */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2.5">
              <div className="font-extrabold text-amber-950 text-sm flex items-center gap-1.5">
                <span className="text-lg">🎁</span>
                <span>[🎁 Referrals] & [📁 Drive Papers]</span>
              </div>
              <div className="space-y-1.5 text-slate-700 text-[11px]">
                <p><strong>• রেফারেল কোড (GEO-REF-XXXX):</strong> বন্ধুদের শেয়ার করলেই প্রতি রেফারেলে নগদ ₹১০০ ইনসেনটিভ।</p>
                <p><strong>• ₹৭,৫০০ ক্যাশ প্রাইজ:</strong> সেরা পারফর্মার ও প্রতিনিধিদের জন্য রাজ্যব্যাপী গ্র্যান্ড পুরস্কার।</p>
                <p><strong>• বিগত ১০ বছরের প্রশ্ন ড্রাইভ:</strong> মাধ্যমিক ও টেস্ট পেপার সংকলন ডাউনলোড।</p>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDE 5: TEACHER PANEL & CO-ADMIN CENTER */}
        <div className={`${viewMode === 'slides' && currentSlide !== 5 ? 'hidden print:block' : 'block'} bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6 prospectus-print-slide`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-extrabold text-xs">
              SLIDE 5 • TEACHER & CO-ADMIN PANEL
            </span>
            <span className="text-xs font-bold text-slate-500">Teacher Navigation Options</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-xs space-y-1.5">
              <span className="font-extrabold text-purple-950 text-xs block">📥 Assigned Student Doubts</span>
              <p className="text-slate-600 text-[11px]">ছাত্রছাত্রীদের পাঠানো দ্বিধাদ্বন্দ্ব বা প্রশ্ন শিক্ষকের কাছে জমা হয়। শিক্ষক উত্তর ও ভয়েস/টেক্সট গাইড দেন।</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-1.5">
              <span className="font-extrabold text-blue-950 text-xs block">📖 Question Bank Manager</span>
              <p className="text-slate-600 text-[11px]">অধ্যায় ও নম্বরভিত্তিক প্রশ্নাবলী পর্যবেক্ষণ এবং শিক্ষার্থীরা কোথায় বেশি ভুল করছে তা সনাক্তকরণ।</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1.5">
              <span className="font-extrabold text-emerald-950 text-xs block">📝 Check Assigned Answer Sheets</span>
              <p className="text-slate-600 text-[11px]">শিক্ষার্থীদের জমা দেওয়া ৯০ নম্বরের খাতা দেখে বিভাগ অনুযায়ী নম্বর দেওয়া ও ভুলত্রুটি শুধরে দেওয়ার ব্যবস্থা।</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1.5">
              <span className="font-extrabold text-amber-950 text-xs block">📤 Send Suggestions to Admin</span>
              <p className="text-slate-600 text-[11px]">শিক্ষকরা নিজস্ব নোট বা নতুন প্রশ্নের সাজেশন হেড অ্যাডমিন শাওন কর মহাশয়ের প্যানেলে জমা দিতে পারেন।</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="font-extrabold text-slate-900 text-xs block">👨‍🏫 Student Track Records</span>
              <p className="text-slate-600 text-[11px]">নিজ স্কুলের ছাত্রছাত্রীদের টেস্টে প্রাপ্ত নম্বর, শতকরা হার ও পারফরম্যান্স দেখার প্রাতিষ্ঠানিক সুবিধা।</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-1.5">
              <span className="font-extrabold text-indigo-950 text-xs block">⭐ Co-Admin Action Queue</span>
              <p className="text-slate-600 text-[11px]">আপগ্রেড হওয়া শিক্ষকরা শিক্ষার্থী অনুমোদন বা স্থগিতাদেশ প্রস্তাব জমা দিতে পারেন, যা হেড অ্যাডমিন রিভিউ করেন।</p>
            </div>
          </div>
        </div>

        {/* SLIDE 6: HEAD ADMIN CONTROL PANEL (SHAWON KAR) */}
        <div className={`${viewMode === 'slides' && currentSlide !== 6 ? 'hidden print:block' : 'block'} bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6 prospectus-print-slide`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
              SLIDE 6 • HEAD ADMIN CONTROL (SHAWON KAR)
            </span>
            <span className="text-xs font-bold text-slate-500">Master Governance Tools</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
              <span className="font-black text-amber-950 text-xs block">📢 Send Student Notifications</span>
              <p className="text-slate-700 text-[11px]">এক ক্লিকে সমস্ত সক্রিয় ছাত্রছাত্রীদের ড্যাশবোর্ডে পরীক্ষার নোটিশ ও রুটিন অ্যালার্ট পাঠান।</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-1.5">
              <span className="font-black text-blue-950 text-xs block">🛡️ User Approvals & Promotion</span>
              <p className="text-slate-700 text-[11px]">শিক্ষার্থী ও শিক্ষক অনুমোদন, শিক্ষকদের 'Co-Admin' হিসেবে আপগ্রেড বা ডিমোট করার পূর্ণ ক্ষমতা।</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs space-y-1.5">
              <span className="font-black text-purple-950 text-xs block">⚡ Co-Admin Proposal Review</span>
              <p className="text-slate-700 text-[11px]">সহকারী অ্যাডমিনদের প্রতিটি প্রস্তাবনা পর্যালোচনা করে ১-ক্লিকে [Approve & Execute] অথবা [Reject]।</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1.5">
              <span className="font-black text-emerald-950 text-xs block">💳 Payment Verifications</span>
              <p className="text-slate-700 text-[11px]">UPI ট্রানজাকশন আইডি (UTR) ও স্ক্রিনশট যাচাই করে ছাত্রছাত্রীদের ফুল অ্যাক্সেস সক্রিয় করা।</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 text-xs space-y-1.5">
              <span className="font-black text-slate-900 text-xs block">📥 Export Full Database (CSV)</span>
              <p className="text-slate-700 text-[11px]">সমস্ত ছাত্রছাত্রী ও শিক্ষকদের নাম, ফোন, স্কুল, ও পরীক্ষার সাল সহ এক্সেল-কম্প্যাটিবল (UTF-8) CSV ডাউনলোড।</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs space-y-1.5">
              <span className="font-black text-indigo-950 text-xs block">📊 Analytics & Track Records</span>
              <p className="text-slate-700 text-[11px]">জেলাভিত্তিক অংশগ্রহণ, স্কুলগুলোর গড় ফলাফল ও ছাত্রছাত্রীদের পারফরম্যান্স রিপোর্ট বিশ্লেষণ।</p>
            </div>
          </div>
        </div>

        {/* SLIDE 7: MOBILE PWA & OFFLINE ARCHITECTURE */}
        <div className={`${viewMode === 'slides' && currentSlide !== 7 ? 'hidden print:block' : 'block'} bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6 prospectus-print-slide`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs">
              SLIDE 7 • MOBILE PWA TECHNOLOGY & OFFLINE RESILIENCE
            </span>
            <span className="text-xs font-bold text-slate-500">Native Phone App Experience</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>স্মার্টফোনে ব্যবহারের সেরা প্রযুক্তি (PWA Features)</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">• প্লেস্টোরের ঝামেলাহীন ১-ক্লিক ইনস্টলেশন:</strong>
                  ফোনের ব্রাউজার থেকে সরাসরি হোমস্ক্রিনে অ্যাপ আইকন সেভ হয়ে যায়। কোনো অতিরিক্ত ডাউনলোডের প্রয়োজন নেই।
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">• অফলাইন ক্যাশিং ও সংযোগহীন অনুশীলন:</strong>
                  গ্রামাঞ্চলে নেটওয়ার্ক ধীরগতির হলেও পূর্বের ক্যাশ করা প্রশ্ন ও অধ্যায়গুলো নিরবচ্ছিন্নভাবে রিভিশন দেওয়া যায়।
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">• একহাতে ব্যবহারের থাম্ব নেভিগেশন বার:</strong>
                  নিচে ফিক্সড [হোম] [অনুশীলন] [মক টেস্ট] [সাজেশন] [মেনু] বাটন থাকায় যাতায়াতের সময়ও মোবাইল ব্যবহারে সুবিধা।
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>অ্যান্ড্রয়েড ও আইফোন সহজ সেটআপ গাইড</span>
              </h3>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2.5">
                <p><strong>🤖 Android (Chrome):</strong> লিংকে ঢুকলেই শীর্ষে "📲 মোবাইলে অ্যাপ ইনস্টল করুন" বাটন আসবে, এক ক্লিকেই হোমস্ক্রিনে যোগ হয়ে যাবে।</p>
                <p><strong>🍎 Apple iPhone (Safari):</strong> Safari-র নিচের Share আইকনে ট্যাপ করে "Add to Home Screen" নির্বাচন করলেই অ্যাপ তৈরি হয়।</p>
                <p><strong>🏷️ নোটিশবোর্ড QR কোড:</strong> স্কুলের নোটিশবোর্ডে কিউআর কোড স্ক্যান করে ছাত্রছাত্রীরা সেকেন্ডের মধ্যে সাইটে প্রবেশ করতে পারবে।</p>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDE 8: MOBILIZATION STRATEGY & READY-TO-POST SOCIAL BROADCAST */}
        <div className={`${viewMode === 'slides' && currentSlide !== 8 ? 'hidden print:block' : 'block'} bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6 prospectus-print-slide`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs">
              SLIDE 8 • SCHOOL MOBILIZATION & SOCIAL BROADCAST
            </span>
            <span className="text-xs font-bold text-slate-500">Candidate Gathering Toolkit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Strategies */}
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>স্কুল ও কোচিং সেন্টারে প্রচার কৌশল</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-blue-900 block mb-0.5">১. স্টাফ রুম ও প্রধান শিক্ষক মিটিং:</strong>
                  এই প্রেজেন্টেশনটি প্রিন্ট করে স্কুলের ভূগোল শিক্ষক ও প্রধান শিক্ষকের সাথে আলোচনা করুন।
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-blue-900 block mb-0.5">২. মর্নিং অ্যাসেম্বলি বা ক্লাসে ঘোষণা:</strong>
                  মাধ্যমিকের টেস্টের আগে অধ্যায়ভিত্তিক মডেল উত্তর ও ৯০ নম্বরের মক টেস্টের গুরুত্ব তুলে ধরুন।
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-blue-900 block mb-0.5">৩. রেফারেল ইনসেনটিভ ও পুরস্কার:</strong>
                  স্কুল প্রতিনিধিরা নিজস্ব রেফারেল কোড দিয়ে বন্ধুদের যুক্ত করলে তাৎক্ষণিক নগদ ইনসেনটিভ ও ₹৭,৫০০ পুরস্কার পাবেন।
                </div>
              </div>
            </div>

            {/* Ready-to-copy Social Message */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>সোশ্যাল মিডিয়া প্রচার মেসেজ (WhatsApp / Facebook)</span>
                </h3>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="py-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1 cursor-pointer border border-emerald-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{copied ? "কপি হয়েছে!" : "কপি করুন"}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-blue-100 rounded-2xl text-[11px] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto shadow-inner border border-slate-800 max-h-72">
                {socialMediaBroadcastText}
              </pre>
            </div>
          </div>

          {/* Helpline Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="font-black text-sm">স্কুল উপস্থাপনা, বাল্ক রেজিস্ট্রেশন ও ডেমো সহায়তায়:</div>
              <div className="text-xs text-emerald-100">শাওন কর (M.Sc., B.Ed., University of Calcutta) — প্রধান পরিচালক</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:7001257277"
                className="px-4 py-2 bg-white text-emerald-900 font-extrabold text-xs rounded-xl shadow-xs hover:bg-emerald-50 transition"
              >
                📞 7001257277
              </a>
            </div>
          </div>
        </div>

        {/* Slide Pagination Buttons (When in Slide Mode, Hidden on Print) */}
        {viewMode === 'slides' && (
          <div className="flex items-center justify-between pt-2 no-print">
            <button
              type="button"
              disabled={currentSlide === 1}
              onClick={() => setCurrentSlide(prev => Math.max(1, prev - 1))}
              className="py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>পূর্ববর্তী স্লাইড (Previous)</span>
            </button>

            <span className="text-xs font-extrabold text-slate-600">
              স্লাইড {currentSlide} / {slides.length}
            </span>

            <button
              type="button"
              disabled={currentSlide === slides.length}
              onClick={() => setCurrentSlide(prev => Math.min(slides.length, prev + 1))}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition cursor-pointer"
            >
              <span>পরবর্তী স্লাইড (Next)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
