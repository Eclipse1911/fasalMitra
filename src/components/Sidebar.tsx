import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Calculator,
  BrainCircuit,
  Package,
  Layers,
  ReceiptText,
  BarChart3,
  Map,
  FileSpreadsheet,
  FileQuestion,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { UserRole, NavigationTab, CropType } from '../types';

export type ActiveTab = NavigationTab | 'about';

interface SidebarProps {
  currentRole?: UserRole;
  userRole?: UserRole;
  activeTab: ActiveTab;
  onSelectTab?: (tab: any) => void;
  onTabChange?: (tab: any) => void;
  activeCrop?: CropType;
  activeQuantity?: number;
  onOpenDemoTour?: () => void;
  onOpenAboutModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  userRole,
  activeTab,
  onSelectTab,
  onTabChange,
  activeCrop = 'Soybean',
  activeQuantity = 20,
  onOpenAboutModal,
}) => {
  const role = userRole || currentRole || 'farmer';

  const handleSelect = (tab: any) => {
    if (onTabChange) onTabChange(tab);
    else if (onSelectTab) onSelectTab(tab);
  };

  const getNavItems = () => {
    switch (role) {
      case 'farmer':
        return [
          { id: 'dashboard', label: 'Farmer Dashboard', icon: LayoutDashboard, badge: 'Home' },
          { id: 'market_intelligence', label: 'Market Intelligence', icon: TrendingUp, badge: 'Live Mandis' },
          { id: 'find_buyers', label: 'Find Buyers', icon: Users, badge: 'AI Match' },
          { id: 'net_realization', label: 'Net Realization Calc', icon: Calculator, badge: 'Core' },
          { id: 'sell_vs_hold', label: 'Sell vs Hold Engine', icon: BrainCircuit, badge: 'AI Decision' },
          { id: 'my_produce', label: 'My Produce Lots', icon: Package },
          { id: 'fpo_aggregation', label: 'FPO Bulk Aggregation', icon: Layers, badge: 'High Value' },
          { id: 'interactive_map', label: 'Maharashtra Agro Map', icon: Map },
          { id: 'transactions', label: 'Transactions & Timeline', icon: ReceiptText },
          { id: 'admin_analytics', label: 'Macro State Analytics', icon: BarChart3 },
        ];
      case 'buyer':
        return [
          { id: 'dashboard', label: 'Buyer Dashboard', icon: LayoutDashboard },
          { id: 'find_buyers', label: 'Posted Requirements', icon: FileSpreadsheet, badge: 'Active' },
          { id: 'my_produce', label: 'Farmer Produce Lots', icon: Package },
          { id: 'market_intelligence', label: 'Regional Mandi Prices', icon: TrendingUp },
          { id: 'fpo_aggregation', label: 'FPO Bulk Batches', icon: Layers },
          { id: 'transactions', label: 'Procurement Transactions', icon: ReceiptText },
          { id: 'interactive_map', label: 'Logistics Route Map', icon: Map },
        ];
      case 'fpo':
        return [
          { id: 'dashboard', label: 'FPO Hub Dashboard', icon: LayoutDashboard },
          { id: 'fpo_aggregation', label: 'Bulk Aggregation Engine', icon: Layers, badge: '100q Order' },
          { id: 'my_produce', label: 'Member Farmer Lots', icon: Package },
          { id: 'find_buyers', label: 'Buyer Procurement Orders', icon: Users },
          { id: 'market_intelligence', label: 'Mandi Price Discovery', icon: TrendingUp },
          { id: 'transactions', label: 'FPO Settlement Slips', icon: ReceiptText },
          { id: 'interactive_map', label: 'Farmer Clusters Map', icon: Map },
        ];
      case 'admin':
        return [
          { id: 'admin_analytics', label: 'State Agri Overview', icon: BarChart3, badge: 'Macro' },
          { id: 'market_intelligence', label: 'Mandi Price Monitor', icon: TrendingUp },
          { id: 'find_buyers', label: 'Buyer Verification Directory', icon: Users },
          { id: 'fpo_aggregation', label: 'FPO Cluster Operations', icon: Layers },
          { id: 'transactions', label: 'Trade Volume Tracker', icon: ReceiptText },
          { id: 'interactive_map', label: 'Corridor Logistics Map', icon: Map },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-full md:w-68 bg-white border border-stone-200 rounded-3xl p-5 shadow-xs shrink-0 flex flex-col justify-between space-y-6">
      <div className="space-y-5">
        
        {/* Active Role Card */}
        <div className="bg-stone-50/90 rounded-2xl p-4 border border-stone-200/80">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-1">
            Active Persona Mode
          </div>
          <div className="font-extrabold text-sm text-stone-900 flex items-center justify-between">
            <span className="capitalize">{role === 'fpo' ? 'FPO Aggregator' : role}</span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            {role === 'farmer' && 'Ramesh Patil (Akola District)'}
            {role === 'buyer' && 'ABC Agro Foods (Verified)'}
            {role === 'fpo' && 'Akola FPO Hub (142 Farmers)'}
            {role === 'admin' && 'Agri Dept State Oversight'}
          </p>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isMapTab = (item.id === 'interactive_map' || item.id === 'map_view') && (activeTab === 'interactive_map' || (activeTab as any) === 'map_view');
            const isActive = activeTab === item.id || isMapTab;
            
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-xs'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Realization Index Bottom Pod */}
      <div className="space-y-3 pt-2">
        <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-950 rounded-2xl p-4 text-white shadow-md relative overflow-hidden border border-emerald-900/40">
          <div className="flex items-center justify-between text-xs text-stone-300 mb-1">
            <span className="flex items-center space-x-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Realization Index</span>
            </span>
            <span className="text-emerald-400 font-bold">+11.2%</span>
          </div>
          <div className="text-lg font-black text-white tracking-tight">
            ₹5,280 / Quintal
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5 truncate">
            Active: {activeQuantity}q {activeCrop} Lot
          </div>
          <div className="mt-3 h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 w-4/5 rounded-full"></div>
          </div>
        </div>

        {/* Bottom helper link */}
        <button
          id="btn-sidebar-about"
          onClick={() => (onOpenAboutModal ? onOpenAboutModal() : handleSelect('about'))}
          className="w-full flex items-center justify-center space-x-2 text-stone-500 hover:text-emerald-700 text-xs py-2 px-3 rounded-xl hover:bg-stone-50 transition cursor-pointer font-medium border border-transparent hover:border-stone-200"
        >
          <FileQuestion className="w-4 h-4" />
          <span>FasalMitr Docs & Architecture</span>
        </button>
      </div>
    </aside>
  );
};
