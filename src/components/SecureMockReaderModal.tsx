import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, FileText, AlertCircle, BookOpen } from 'lucide-react';

interface MockReaderProps {
  mockTest: any;
  user: any;
  isOpen: boolean;
  onClose: () => void;
  language: 'Bengali' | 'English';
}

export const SecureMockReaderModal: React.FC<MockReaderProps> = ({
  mockTest,
  user,
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen || !mockTest) return null;
  const isBn = language === 'Bengali';

  const studentName = user?.full_name || 'GeoLab Student';
  const studentPhone = user?.phone ? user.phone.slice(0, 4) + '***' + user.phone.slice(-3) : 'XXXX';
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 select-none">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xs shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  {mockTest.test_type}
                </span>
                <span className="text-[10px] font-black bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-md border border-blue-400/30">
                  {mockTest.language === 'English' ? 'English Medium' : 'বাংলা মাধ্যম'}
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white truncate mt-0.5">
                {mockTest.code_num} — {mockTest.file_name || 'Question Paper'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body with Anti-Leak Watermark Overlay */}
        <div
          className="relative flex-1 p-5 sm:p-8 overflow-y-auto bg-slate-50 font-sans leading-relaxed text-slate-800"
          onContextMenu={e => e.preventDefault()}
        >
          {/* Watermark Diagonal Pattern */}
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-wrap items-center justify-around opacity-7 select-none overflow-hidden">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="text-slate-900 font-extrabold text-sm rotate-[-30deg] p-8 font-mono">
                GeoLabPortal • {studentName} ({studentPhone}) • {currentDate}
              </div>
            ))}
          </div>

          {/* Paper Content Card */}
          <div className="relative z-20 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-4">
            <div className="text-center border-b border-slate-200 pb-4">
              <h4 className="font-black text-slate-900 text-lg sm:text-xl">
                পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ — দশম শ্রেণি ভূগোল
              </h4>
              <p className="text-xs font-bold text-indigo-700 mt-1">
                {mockTest.test_type} • কোড: {mockTest.code_num} • মাধ্যম: {mockTest.language === 'English' ? 'English' : 'বাংলা'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                প্রকাশক: {mockTest.uploader || 'Shawon Kar (Head Admin)'}
              </p>
            </div>

            {/* Display Question Text */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-800">
              {mockTest.file_data ? (
                // If base64 data contains standard text or preview
                mockTest.file_data.startsWith('data:') ? (
                  <div className="text-center py-6 space-y-3">
                    <BookOpen className="w-12 h-12 text-indigo-600 mx-auto" />
                    <p className="font-bold text-slate-900 text-sm">
                      {mockTest.file_name} — অফিসিয়াল মক টেস্ট প্রশ্নপত্র
                    </p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      {isBn
                        ? 'প্রশ্নপত্রটি সুরক্ষিত ডিজিটাল ফরম্যাটে আপলোড করা হয়েছে। খাতায় সময় ধরে উত্তর লিখে "My Exam Submissions" বিভাগে ছবি/PDF জমা দিন।'
                        : 'The question paper is secured in digital format. Write your answers on physical paper and upload under My Exam Submissions.'}
                    </p>
                  </div>
                ) : (
                  mockTest.file_data
                )
              ) : (
                <p className="text-slate-500 italic text-center py-8">
                  {isBn ? 'প্রশ্নপত্রটি প্রস্তুত হচ্ছে...' : 'Question paper content loading...'}
                </p>
              )}
            </div>

            {/* Instructions Box */}
            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-left space-y-1 text-xs text-amber-900">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>{isBn ? 'পরীক্ষার নির্দেশিকা (Exam Instructions):' : 'Exam Instructions:'}</span>
              </p>
              <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                <li>{isBn ? 'প্রশ্নপত্রটি সময় ধরে খাতায় লিখুন।' : 'Write down answers within the time limit.'}</li>
                <li>{isBn ? 'চিত্রসংবলিত প্রশ্নগুলিতে পেন্সিল দিয়ে পরিষ্কার লেবেলিং করুন।' : 'Use neat pencil sketches and labeling for diagram questions.'}</li>
                <li>{isBn ? 'উত্তরপত্র সম্পূর্ণ হলে "My Exam Submissions" সেকশনে গিয়ে ছবি বা PDF আপলোড করে জমা দিন।' : 'Upload your written answer paper under My Exam Submissions.'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? 'সুরক্ষিত পোর্টাল ভিউয়ার (ডাউনলোড বা কপি নিষিদ্ধ)' : 'Secure Portal Viewer (Anti-Download Protected)'}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="st-btn bg-slate-800 hover:bg-slate-900 text-white text-xs py-1.5 px-4 rounded-xl font-bold transition cursor-pointer"
          >
            {isBn ? 'পড়া শেষ (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
