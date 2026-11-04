import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  language: 'Bengali' | 'English';
}

export const PWAInstallPrompt: React.FC<Props> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already installed in standalone mode or manually dismissed in current session
  if (isInstalled || dismissed) {
    return null;
  }

  const isBn = language === 'Bengali';

  return (
    <>
      {/* Floating or Header Mobile Install Banner */}
      <div className="relative z-30 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-md border border-blue-500/40 mb-3 flex items-center justify-between gap-2 transition-all">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold truncate flex items-center gap-1.5">
              <span>{isBn ? "📲 মোবাইলে অ্যাপ ইনস্টল করুন" : "📲 Install Phone App"}</span>
              <span className="hidden xs:inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-400 text-slate-900">
                PWA
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-blue-100 truncate">
              {isBn
                ? "হোমস্ক্রিনে যোগ করে ইন্টারনেটের গতি বাড়িয়ে অ্যাপের মতো ব্যবহার করুন"
                : "Add to home screen for fast mobile practice like a native app"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isInstallable && (
            <button
              type="button"
              onClick={install}
              className="px-3 py-1.5 rounded-lg bg-white text-blue-900 font-extrabold text-xs shadow-sm hover:bg-blue-50 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              <span>{isBn ? "ইনস্টল" : "Install"}</span>
            </button>
          )}

          {isIOS && (
            <button
              type="button"
              onClick={() => setShowIOSModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white text-blue-900 font-extrabold text-xs shadow-sm hover:bg-blue-50 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share className="w-3.5 h-3.5 text-blue-700" />
              <span>{isBn ? "iPhone এ যুক্ত করুন" : "Install iOS"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md text-blue-200 hover:text-white hover:bg-white/10 transition"
            title={isBn ? "লুকান" : "Dismiss"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Step-by-Step Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  🍎
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {isBn ? "iPhone / iPad এ অ্যাপ ইনস্টল করুন" : "Install on iPhone / iPad"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Safari Browser Setup</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ১
                </span>
                <div>
                  Safari ব্রাউজারের নিচের টুলবারে থাকা <strong className="text-blue-700">Share</strong> বোতামে (<Share className="inline w-3.5 h-3.5 text-blue-600" />) ট্যাপ করুন।
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ২
                </span>
                <div>
                  মেনুটি সামান্য নিচে স্ক্রোল করে <strong className="text-blue-700">Add to Home Screen</strong> (<PlusSquare className="inline w-3.5 h-3.5 text-blue-600" />) অপশনটিতে ট্যাপ করুন।
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ৩
                </span>
                <div>
                  উপরে ডানদিকের <strong className="text-emerald-700">Add</strong> বাটনে ক্লিক করলেই আপনার ফোনে আইকন সেভ হয়ে যাবে।
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
            >
              {isBn ? "বুঝেছি (Close)" : "Got It"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
