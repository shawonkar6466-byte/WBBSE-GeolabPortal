import React from 'react';
import { Home, BookOpen, FileCheck, Lightbulb, Menu, ShieldCheck, HelpCircle, Layers } from 'lucide-react';

interface Props {
  user: any;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  openMobileMenu: () => void;
  language: 'Bengali' | 'English';
}

export const MobileBottomNav: React.FC<Props> = ({
  user,
  activeNav,
  setActiveNav,
  openMobileMenu,
  language
}) => {
  if (!user) return null;

  const isBn = language === 'Bengali';
  const role = user.role;

  // Student bottom nav items
  if (role === 'student') {
    const items = [
      { id: '🏠 Dashboard', labelBn: 'হোম', labelEn: 'Home', icon: Home },
      { id: '🔒 Master 2/3/5M PDF Reader (DRM)', labelBn: 'মাস্টার PDF', labelEn: 'Master PDF', icon: ShieldCheck },
      { id: '📖 Practice Center', labelBn: 'অনুশীলন', labelEn: 'Practice', icon: BookOpen },
      { id: '💡 Ask Corner (Suggestions)', labelBn: 'সাজেশন', labelEn: 'Ask Corner', icon: Lightbulb },
    ];

    return (
      <nav className="mobile-bottom-nav md:hidden px-2 pt-2">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {items.map(it => {
            const Icon = it.icon;
            const isActive = activeNav === it.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => setActiveNav(it.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer ${
                  isActive
                    ? 'text-blue-600 font-extrabold bg-blue-50/80 scale-105'
                    : 'text-slate-600 hover:text-slate-900 active:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] leading-none truncate max-w-full">
                  {isBn ? it.labelBn : it.labelEn}
                </span>
              </button>
            );
          })}

          {/* Menu Drawer Toggle */}
          <button
            type="button"
            onClick={openMobileMenu}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-600 hover:text-slate-900 active:bg-slate-100 transition cursor-pointer"
          >
            <Menu className="w-5 h-5 mb-0.5 stroke-[1.8]" />
            <span className="text-[10px] leading-none truncate max-w-full">
              {isBn ? 'মেনু' : 'Menu'}
            </span>
          </button>
        </div>
      </nav>
    );
  }

  // Teacher or Admin / Co-Admin bottom nav items
  const adminItems = [
    {
      id: user.role === 'admin' ? '📢 Send Student Notifications' : '📥 Assigned Student Doubts',
      labelBn: 'প্যানেল',
      labelEn: 'Panel',
      icon: Home
    },
    {
      id: '🛡️ PDF Security & DRM Approvals',
      labelBn: 'DRM অনুমোদন',
      labelEn: 'DRM Approvals',
      icon: ShieldCheck
    },
    {
      id: user.role === 'admin' ? '❓ Student Doubt Assignment Hub' : '📝 Checking Submitted Answers',
      labelBn: 'ডাউট/খাতা',
      labelEn: 'Doubts',
      icon: HelpCircle
    },
    {
      id: user.role === 'admin' ? '📖 Question Bank Manager' : '📤 Upload Notes & Doubts',
      labelBn: 'প্রশ্ন/PDF',
      labelEn: 'Questions',
      icon: Layers
    },
  ];

  return (
    <nav className="mobile-bottom-nav md:hidden px-2 pt-2">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {adminItems.map(it => {
          const Icon = it.icon;
          const isActive = activeNav === it.id;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => setActiveNav(it.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'text-blue-600 font-extrabold bg-blue-50/80 scale-105'
                  : 'text-slate-600 hover:text-slate-900 active:bg-slate-100'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] leading-none truncate max-w-full">
                {isBn ? it.labelBn : it.labelEn}
              </span>
            </button>
          );
        })}

        {/* Menu Drawer Toggle */}
        <button
          type="button"
          onClick={openMobileMenu}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-600 hover:text-slate-900 active:bg-slate-100 transition cursor-pointer"
        >
          <Menu className="w-5 h-5 mb-0.5 stroke-[1.8]" />
          <span className="text-[10px] leading-none truncate max-w-full">
            {isBn ? 'সব টুল' : 'All Tools'}
          </span>
        </button>
      </div>
    </nav>
  );
};
