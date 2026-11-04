import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface Props {
  language: 'Bengali' | 'English';
}

export const OfflineIndicator: React.FC<Props> = ({ language }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  const isBn = language === 'Bengali';

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>
        {isBn ? "ইন্টারনেট সংযোগ বিচ্ছিন্ন — অফলাইন ক্যাশ মোড সক্রিয়" : "No Internet — Offline Cache Active"}
      </span>
    </div>
  );
};
