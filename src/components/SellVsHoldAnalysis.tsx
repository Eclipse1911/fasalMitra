import React, { useState } from 'react';
import {
  BrainCircuit,
  TrendingUp,
  Sparkles,
  Building2,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Calendar,
  Layers,
  Scale,
  ShieldCheck,
  ArrowRight,
  Info,
  Clock,
  DollarSign,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  CropType,
  QualityGrade,
  AIRecommendation,
  StorageFacility,
  MarketPriceRecord,
} from '../types';
import { ForecastService } from '../services/forecastService';
import { StorageService } from '../services/storageService';

interface SellVsHoldAnalysisProps {
  crop: CropType;
  quantity: number;
  quality: QualityGrade;
  district: string;
  storageAvailable: boolean;
  recommendation: AIRecommendation;
  storageFacilities: StorageFacility[];
  marketPrices: MarketPriceRecord[];
  onAcceptOption: (optionType: string, dest: string, price: number, net: number) => void;
}

export const SellVsHoldAnalysis: React.FC<SellVsHoldAnalysisProps> = ({
  crop,
  quantity,
  quality,
  district,
  storageAvailable,
  recommendation,
  storageFacilities,
  marketPrices,
  onAcceptOption,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<7 | 14 | 28>(7);

  // Generate scientific forecast
  const forecastResult = ForecastService.generateForecast(crop, district);
  const bestStorage = StorageService.getBestFacilityForHold(district, quantity, crop === 'Tomato');

  // Chart data: merge historical last 4 weeks + projected 4 weeks
  const chartPoints = [
    ...forecastResult.historicalSeries.slice(-6).map((h) => ({
      date: h.date,
      historicalPrice: h.price,
      forecastPrice: null,
      confidenceLower: null,
      confidenceUpper: null,
    })),
    ...forecastResult.forecastSeries.map((f) => ({
      date: f.date,
      historicalPrice: f.historicalModal || null,
      forecastPrice: f.forecastPrice,
      confidenceLower: f.confidenceLower,
      confidenceUpper: f.confidenceUpper,
    })),
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <BrainCircuit className="w-4 h-4" />
              <span>Temporal Intelligence & Decision Support Layer</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Sell Now vs. Warehouse Hold Analysis
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Comparing immediate mandi liquidation, direct institutional buyer sale, and 7–14 day warehouse holding.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">Crop Evaluated</span>
              <span className="text-sm font-extrabold text-stone-900">{quantity}q {quality} {crop}</span>
            </div>
            <div className="h-8 w-px bg-stone-200"></div>
            <div>
              <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">Forecast Confidence</span>
              <span className="text-sm font-extrabold text-emerald-700">{forecastResult.confidenceScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side 3 Core Options Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Option A: Sell Now (Local Mandi) */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-300 transition">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold uppercase">
                Option A: Local Mandi
              </span>
              <span className="text-xs text-stone-400 font-medium">Immediate</span>
            </div>
            <h3 className="font-extrabold text-base text-stone-900">Akola APMC Yard</h3>
            <p className="text-xs text-stone-500 mt-0.5">Spot market cash sale with standard deductions</p>

            <div className="my-4 bg-stone-50 rounded-2xl p-3.5 border border-stone-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Current Market Price:</span>
                <span className="font-bold text-stone-900">₹5,000 / q</span>
              </div>
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Transport (15 km):</span>
                <span>- ₹125 / q</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Mandi Cess (1.05%) & Handling:</span>
                <span>- ₹25 / q</span>
              </div>
            </div>

            <div className="bg-stone-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-stone-500 font-medium block">Net Realization</span>
              <div className="text-2xl font-black text-stone-900 mt-0.5">
                ₹4,850 <span className="text-xs font-normal text-stone-500">/ q</span>
              </div>
              <span className="text-xs font-bold text-stone-700 block mt-0.5">
                Total: ₹97,000
              </span>
            </div>
          </div>

          <button
            onClick={() => onAcceptOption('LOCAL_MANDI', 'Akola APMC Yard', 5000, 4850)}
            className="w-full mt-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs transition cursor-pointer"
          >
            Select Local Mandi
          </button>
        </div>

        {/* Option B: Sell to Direct Buyer */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold uppercase">
                Option B: Direct Buyer
              </span>
              <span className="text-xs text-emerald-700 font-bold">Fast Settlement</span>
            </div>
            <h3 className="font-extrabold text-base text-stone-900">ABC Agro Foods Pvt Ltd</h3>
            <p className="text-xs text-stone-500 mt-0.5">Direct processor procurement (35 km away)</p>

            <div className="my-4 bg-emerald-50/40 rounded-2xl p-3.5 border border-emerald-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Buyer Offered Price:</span>
                <span className="font-bold text-stone-900">₹5,200 / q</span>
              </div>
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Transport (35 km):</span>
                <span>- ₹140 / q</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>APMC Cess Savings:</span>
                <span>Saved (₹0)</span>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-3.5 text-center border border-emerald-200/60">
              <span className="text-[11px] text-emerald-800 font-medium block">Net Realization</span>
              <div className="text-2xl font-black text-emerald-950 mt-0.5">
                ₹5,050 <span className="text-xs font-normal text-emerald-700">/ q</span>
              </div>
              <span className="text-xs font-bold text-emerald-900 block mt-0.5">
                Total: ₹1,01,000 (+₹4,000 vs Mandi)
              </span>
            </div>
          </div>

          <button
            onClick={() => onAcceptOption('DIRECT_BUYER', 'ABC Agro Foods', 5200, 5050)}
            className="w-full mt-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Sell to ABC Agro Foods
          </button>
        </div>

        {/* Option C: Hold in Warehouse */}
        <div className="bg-gradient-to-b from-emerald-50/80 to-white rounded-3xl p-5 border-2 border-emerald-600 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700 text-white text-xs font-black uppercase tracking-wider">
                ★ Option C: Warehouse Hold (5-7 Days)
              </span>
              <span className="text-xs font-black text-emerald-800">Highest Upside</span>
            </div>
            <h3 className="font-extrabold text-base text-stone-900">
              {bestStorage?.name || 'Akola Agri Logistics Warehouse'}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">Store at ₹4/q/day and sell at projected price peak</p>

            <div className="my-4 bg-white rounded-2xl p-3.5 border border-emerald-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Expected 7-Day Price:</span>
                <span className="font-bold text-emerald-950">₹5,350 / q</span>
              </div>
              <div className="flex justify-between text-amber-700 font-medium">
                <span>Storage Cost (7 Days @ ₹4/q):</span>
                <span>- ₹28 / q</span>
              </div>
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Total Freight & Handling:</span>
                <span>- ₹172 / q</span>
              </div>
            </div>

            <div className="bg-emerald-700 text-white rounded-2xl p-3.5 text-center shadow-xs">
              <span className="text-[11px] text-emerald-100 font-medium block">Expected Net Realization</span>
              <div className="text-2xl font-black text-white mt-0.5">
                ₹5,150 <span className="text-xs font-normal text-emerald-200">/ q</span>
              </div>
              <span className="text-xs font-bold text-emerald-100 block mt-0.5">
                Total: ₹1,03,000 (+₹6,000 vs Mandi)
              </span>
            </div>
          </div>

          <button
            onClick={() => onAcceptOption('HOLD_FOR_UPSIDE', bestStorage?.name || 'Akola Storage', 5350, 5150)}
            className="w-full mt-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs transition shadow-xs cursor-pointer"
          >
            Select 7-Day Warehouse Hold
          </button>
        </div>

      </div>

      {/* AI Recommendation Summary Box */}
      <div className="bg-stone-900 rounded-3xl p-6 text-white border border-stone-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                FasalMitr AI Decision Synthesis
              </span>
              <h2 className="text-lg font-black text-white">Recommended Strategy: HOLD FOR 5–7 DAYS</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-stone-800 px-3.5 py-1.5 rounded-xl border border-stone-700">
              <span className="text-stone-400 block">Model Confidence</span>
              <span className="font-bold text-emerald-400">72%</span>
            </div>
            <div className="bg-stone-800 px-3.5 py-1.5 rounded-xl border border-stone-700">
              <span className="text-stone-400 block">Risk Assessment</span>
              <span className="font-bold text-amber-400">MEDIUM RISK</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
          {/* Left: Why this option */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Why are we recommending this?</span>
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <span>Recent price trend is strongly positive (+₹15–20/week upward momentum in Vidarbha).</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <span>Current mandi arrivals are moderate (650–850 quintals daily), preventing supply surplus.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <span>Institutional buyer demand is active, with processors seeking high-grade inventory.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <span>WDRA accredited storage is available 8 km away at low daily rate (₹4/q/day).</span>
              </div>
            </div>
          </div>

          {/* Right: Risk factors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Risk & Sensitivity Assessment</span>
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span><strong>Forecast Uncertainty:</strong> Predictions are based on historical probability, not guaranteed.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span><strong>Liquidity Timing:</strong> If you have immediate cash requirements for labor or debt, Option B (Direct Buyer) offers immediate settlement.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span><strong>Storage Quality:</strong> Ensure moisture content is &lt;10% before bagging for dry warehouse holding.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Forecasting Graph */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-base text-stone-900">
              Price Forecasting Model & Confidence Range (Next 28 Days)
            </h3>
            <p className="text-xs text-stone-500">
              Historical baseline (emerald) transitions into forward statistical projection (teal/amber) with confidence bands
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center text-stone-600 font-semibold">
              <span className="w-3 h-0.5 bg-emerald-600 mr-1.5 rounded"></span> Historical
            </span>
            <span className="flex items-center text-stone-600 font-semibold">
              <span className="w-3 h-0.5 bg-teal-600 mr-1.5 rounded"></span> Forecast Modal
            </span>
            <span className="flex items-center text-stone-600 font-semibold">
              <span className="w-3 h-3 bg-emerald-100 mr-1.5 rounded"></span> Confidence Band
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartPoints}>
              <defs>
                <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => str.slice(5)} 
                tick={{ fontSize: 11, fill: '#78716c' }} 
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 11, fill: '#78716c' }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip
                formatter={(val: number, name: string) => [
                  `₹${val?.toLocaleString()}/q`,
                  name === 'historicalPrice' ? 'Historical Modal' : name === 'forecastPrice' ? 'Forecast Price' : name
                ]}
                labelFormatter={(lbl) => `Date: ${lbl}`}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="confidenceUpper" 
                stroke="transparent" 
                fill="#d1fae5" 
                name="Upper Bound"
              />
              <Area 
                type="monotone" 
                dataKey="confidenceLower" 
                stroke="transparent" 
                fill="#ffffff" 
                name="Lower Bound"
              />
              <Line 
                type="monotone" 
                dataKey="historicalPrice" 
                stroke="#059669" 
                strokeWidth={2.5} 
                dot={{ r: 3 }}
                name="Historical Modal"
              />
              <Line 
                type="monotone" 
                dataKey="forecastPrice" 
                stroke="#0d9488" 
                strokeWidth={2.5} 
                strokeDasharray="4 4" 
                dot={{ r: 4 }}
                name="Forecast Modal"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
