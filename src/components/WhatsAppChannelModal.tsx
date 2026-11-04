import React from 'react';
import { Smartphone, CheckCircle, ExternalLink, QrCode, X } from 'lucide-react';

interface WhatsAppChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'Bengali' | 'English';
}

export const WhatsAppChannelModal: React.FC<WhatsAppChannelModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;
  const isBn = language === 'Bengali';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header with WhatsApp Gradient */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-md shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                  GeoLabPortal@2026
                </h3>
                <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                {isBn ? 'অফিসিয়াল হোয়াটসঅ্যাপ চ্যানেল' : 'Official WhatsApp Channel'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-center">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {isBn
              ? 'পশ্চিমবঙ্গ মাধ্যমিক ভূগোল পরীক্ষার সর্বশেষ আপডেট, নিশ্চিত সাজেশন, মডেল উত্তরপত্র এবং গুরুত্বপূর্ণ ঘোষণার জন্য আমাদের অফিসিয়াল হোয়াটসঅ্যাপ চ্যানেলে যুক্ত হোন।'
              : 'Join our official WhatsApp channel for the latest WBBSE Class 10 Geography exam updates, suggestions, model answers, and official notices.'}
          </p>

          {/* Official QR Code Card from uploaded user asset */}
          <div className="relative mx-auto max-w-[270px] bg-slate-950 p-3 rounded-2xl shadow-lg border-2 border-emerald-500/30 group">
            <div className="bg-white rounded-xl p-2.5 overflow-hidden">
              <img
                src="/assets/aistudio/image_87bc5e13.png"
                alt="GeoLabPortal@2026 WhatsApp channel QR Code"
                className="w-full h-auto rounded-lg mx-auto block object-contain"
                loading="eager"
              />
            </div>
            <div className="mt-2 text-[11px] font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" />
              <span>{isBn ? 'ক্যামেরা দিয়ে QR কোড স্ক্যান করুন' : 'Scan QR using camera'}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            {isBn
              ? 'ফোনের ক্যামেরা ওপেন করে সরাসরি উপরের QR কোডটি স্ক্যান করুন অথবা নিচের বাটনে ট্যাপ করুন।'
              : 'Scan the QR code using your smartphone camera or click the button below to join directly.'}
          </p>

          {/* Direct Action Button */}
          <div className="pt-2 space-y-2">
            <a
              href="https://whatsapp.com/channel/0029Va4nXYZ"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // If specific link is needed, this opens WhatsApp
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isBn ? '📲 হোয়াটসঅ্যাপ চ্যানেলে যোগ দিন' : '📲 Join WhatsApp Channel'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WhatsAppChannelBanner: React.FC<{
  onOpenModal: () => void;
  language: 'Bengali' | 'English';
}> = ({ onOpenModal, language }) => {
  const isBn = language === 'Bengali';
  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-md border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-xs shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-xs sm:text-sm text-white">
              GeoLabPortal@2026 WhatsApp Channel
            </h4>
            <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full uppercase">
              Official
            </span>
          </div>
          <p className="text-[11px] text-emerald-100 font-medium line-clamp-1">
            {isBn
              ? 'মাধ্যমিক ভূগোল পরীক্ষার সেরা প্রস্তুতি ও দৈনিক আপডেটের জন্য আমাদের হোয়াটসঅ্যাপ চ্যানেলে যোগ দিন।'
              : 'Join our WhatsApp channel for daily Geography updates & exam suggestions.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenModal}
          className="st-btn bg-white hover:bg-emerald-50 text-emerald-800 text-xs py-2 px-3.5 font-extrabold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isBn ? 'QR কোড ও জয়েন লিংক' : 'QR Code & Join Link'}</span>
        </button>
      </div>
    </div>
  );
};
