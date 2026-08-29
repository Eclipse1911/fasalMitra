import React, { useState } from 'react';
import { 
  Sprout, 
  Bell, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  PlayCircle,
  X,
  ChevronDown
} from 'lucide-react';
import { UserRole, NotificationItem, NavigationTab, Language } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language?: Language;
  currentLanguage?: Language;
  onLanguageToggle?: () => void;
  onLanguageChange?: (lang: Language) => void;
  notifications?: NotificationItem[];
  unreadNotificationCount?: number;
  onNotificationRead?: (id: string) => void;
  onOpenAbout?: () => void;
  onOpenAboutModal?: () => void;
  onOpenDemoTour: () => void;
  activeDistrict?: string;
  activeTab?: NavigationTab;
  onTabChange?: (tab: NavigationTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  language,
  currentLanguage,
  onLanguageToggle,
  onLanguageChange,
  notifications = [],
  unreadNotificationCount,
  onNotificationRead,
  onOpenAbout,
  onOpenAboutModal,
  onOpenDemoTour,
  activeDistrict = 'Akola',
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const activeLang = currentLanguage || language || 'en';
  const handleToggleLang = () => {
    if (onLanguageToggle) {
      onLanguageToggle();
    } else if (onLanguageChange) {
      onLanguageChange(activeLang === 'en' ? 'mr' : 'en');
    }
  };

  const handleAboutClick = () => {
    if (onOpenAboutModal) onOpenAboutModal();
    else if (onOpenAbout) onOpenAbout();
  };

  const sampleNotifications: NotificationItem[] = notifications.length > 0 ? notifications : [
    {
      id: 'notif_1',
      title: 'New High-Offer Buyer Matched',
      message: 'ABC Agro Foods posted requirement for 100q Soybean at ₹5,300/q (+₹220 above mandi).',
      timestamp: '10m ago',
      read: false,
    },
    {
      id: 'notif_2',
      title: 'Soybean Spot Price Update',
      message: 'Washim Mandi spot price increased to ₹5,180/q (+₹40 today).',
      timestamp: '1h ago',
      read: false,
    },
    {
      id: 'notif_3',
      title: 'WDRA Cold Storage Booking Open',
      message: 'Murtizapur Warehouse has 150q capacity available with negotiable 5-day hold.',
      timestamp: '3h ago',
      read: true,
    }
  ];

  const unreadCount = unreadNotificationCount !== undefined
    ? unreadNotificationCount
    : sampleNotifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { title: string; subtitle: string; badgeColor: string }> = {
    farmer: { title: 'Ramesh Patil', subtitle: 'Farmer (Akola, MH)', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    buyer: { title: 'ABC Agro Foods', subtitle: 'Verified Buyer', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
    fpo: { title: 'Akola FPO Hub', subtitle: '142 Member Farmers', badgeColor: 'bg-teal-50 text-teal-800 border-teal-200' },
    admin: { title: 'State Agri Dept', subtitle: 'Maharashtra State', badgeColor: 'bg-stone-100 text-stone-800 border-stone-200' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Product Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900">
                  Fasal<span className="text-emerald-600">Mitr</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  फसलमित्र
                </span>
              </div>
              <p className="hidden sm:block text-xs text-stone-500 font-medium">
                {activeLang === 'en' ? 'Smart Market Intelligence & Direct Price Realization' : 'बाजाराच्या माहितीवरून सर्वोत्तम विक्रीचा निर्णय'}
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Location indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100/80 text-stone-700 text-xs font-semibold border border-stone-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activeDistrict}, MH</span>
            </div>

            {/* Guided Demo Button */}
            <button
              id="btn-guided-demo-tour"
              onClick={onOpenDemoTour}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">Guided Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {/* Language Selector */}
            <button
              id="btn-language-toggle"
              onClick={handleToggleLang}
              className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition cursor-pointer bg-white"
              title="Toggle Language"
            >
              {activeLang === 'en' ? 'मराठी' : 'English'}
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer shadow-xs ${roleLabels[currentRole].badgeColor}`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>{roleLabels[currentRole].title}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Switch Simulation View
                  </div>
                  {(['farmer', 'buyer', 'fpo', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      id={`btn-select-role-${r}`}
                      onClick={() => {
                        onRoleChange(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                        currentRole === r ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold capitalize">{r === 'fpo' ? 'FPO Aggregator' : r} Mode</div>
                        <div className="text-[11px] text-stone-500">{roleLabels[r].title}</div>
                      </div>
                      {currentRole === r && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="btn-notifications-bell"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer border border-stone-200 bg-white"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-stone-200 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <span className="font-bold text-sm text-stone-900">Notifications ({sampleNotifications.length})</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto mt-2">
                    {sampleNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => onNotificationRead && onNotificationRead(notif.id)}
                        className={`py-3 px-2 text-xs rounded-xl transition cursor-pointer ${
                          notif.read ? 'text-stone-500 hover:bg-stone-50' : 'bg-emerald-50/60 text-stone-800 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-stone-900">{notif.title}</span>
                          <span className="text-[10px] text-stone-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* About / Info Button */}
            <button
              id="btn-open-about"
              onClick={handleAboutClick}
              className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition cursor-pointer border border-stone-200 bg-white"
              title="About FasalMitr"
            >
              <Info className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>

      {/* Trust & Simulation Disclaimer Banner */}
      <div className="bg-emerald-50/70 border-t border-emerald-100/80 px-4 py-1.5 text-center text-[11px] text-emerald-900 flex items-center justify-center space-x-1.5 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
        <span>
          <strong>FasalMitr Platform:</strong> Maharashtra agricultural price discovery with direct buyer fulfillment, MSP protection, and real-time net realization metrics.
        </span>
      </div>
    </header>
  );
};
