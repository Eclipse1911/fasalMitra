import React from 'react';
import {
  BarChart3,
  Users,
  Building2,
  Layers,
  TrendingUp,
  Package,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const cropDemandData = [
    { name: 'Soybean', demand: 4200, supply: 3100 },
    { name: 'Cotton', demand: 2800, supply: 2200 },
    { name: 'Onion', demand: 5400, supply: 4800 },
    { name: 'Tur / Dal', demand: 1900, supply: 1400 },
    { name: 'Wheat', demand: 3200, supply: 3600 },
    { name: 'Tomato', demand: 2100, supply: 1900 },
  ];

  const districtUpliftData = [
    { district: 'Akola', avgUplift: 180, volume: 1420 },
    { district: 'Washim', avgUplift: 210, volume: 980 },
    { district: 'Amravati', avgUplift: 165, volume: 1150 },
    { district: 'Nashik', avgUplift: 240, volume: 2400 },
    { district: 'Latur', avgUplift: 220, volume: 1300 },
    { district: 'Pune', avgUplift: 195, volume: 1850 },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Maharashtra State Agricultural Oversight</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Macro Market & Liquidity Analytics Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Statewide monitoring of agricultural price discovery efficiency, buyer procurement demand, and collective FPO aggregation volumes.
        </p>
      </div>

      {/* Top 8 Macro Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Registered Farmers</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">1,420</div>
          <span className="text-[11px] text-emerald-600 font-medium">+14% this month</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Verified Buyers</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">185</div>
          <span className="text-[11px] text-indigo-600 font-medium">94% KYC Verified</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active FPOs</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">42</div>
          <span className="text-[11px] text-amber-700 font-medium">12 Districts Covered</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Demand Volume</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">18,600 q</div>
          <span className="text-[11px] text-indigo-600 font-medium">₹9.4 Cr Estimated</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Algorithm Match Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">88.4%</div>
          <span className="text-[11px] text-slate-500 font-medium">7-Factor Weighted</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Avg Farmer Uplift</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">+₹185/q</div>
          <span className="text-[11px] text-emerald-600 font-medium">Above local spot mandi</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Aggregated Lots</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">128</div>
          <span className="text-[11px] text-indigo-600 font-medium">Institutional Batches</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Simulated Escrow</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">₹4.8 Cr</div>
          <span className="text-[11px] text-slate-500 font-medium">Zero default rate</span>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Demand vs Supply Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 mb-1">
            Buyer Demand vs. Available Farmer Supply (Quintals)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Highlights crops with acute supply deficit where farmers hold peak pricing leverage
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} q`, 'Volume']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                />
                <Bar dataKey="demand" fill="#4f46e5" name="Buyer Demand (q)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="supply" fill="#059669" name="Farmer Supply (q)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Cols: Net Realization Uplift by District */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 mb-1">
            Farmer Realization Uplift by District
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Average rupees gained per quintal over traditional spot mandi bidding
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtUpliftData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `+₹${v}`} />
                <YAxis type="category" dataKey="district" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: number) => [`+₹${val}/q Gain`, 'Avg Net Uplift']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                />
                <Bar dataKey="avgUplift" fill="#4f46e5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
