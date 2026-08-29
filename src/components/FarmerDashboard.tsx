import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Scale,
  MapPin,
  RefreshCw,
  PackageCheck,
  BadgePercent,
  CircleDollarSign,
  HelpCircle,
} from 'lucide-react';
import {
  CropType,
  QualityGrade,
  HarvestStatus,
  MarketPriceRecord,
  BuyerRequirement,
  AIRecommendation,
  BuyerMatchItem,
  StorageFacility,
} from '../types';
import { MAHARASHTRA_CROPS, SAMPLE_STORAGE_FACILITIES } from '../data/sampleData';

interface FarmerDashboardProps {
  farmerName?: string;
  locationDistrict?: string;
  district?: string;
  currentCrop?: CropType;
  crop?: CropType;
  currentQuantity?: number;
  quantity?: number;
  currentQuality?: QualityGrade;
  quality?: QualityGrade;
  storageAvailable?: boolean;
  onUpdateLotParams?: (params: {
    crop: CropType;
    quantity: number;
    quality: QualityGrade;
    locationDistrict: string;
    harvestStatus: HarvestStatus;
    storageAvailable: boolean;
    maxRadiusKm: number;
  }) => void;
  marketPrices: MarketPriceRecord[];
  recommendation: AIRecommendation;
  matchedBuyers: BuyerMatchItem[];
  storageFacilities?: StorageFacility[];
  onNavigateTab: (tab: any) => void;
  onSelectBuyerForDeal?: (match: BuyerMatchItem) => void;
  onOpenDemoTour?: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  farmerName = 'Ramesh Patil',
  locationDistrict,
  district = 'Akola',
  currentCrop,
  crop = 'Soybean',
  currentQuantity,
  quantity = 20,
  currentQuality,
  quality = 'Grade A',
  storageAvailable = true,
  onUpdateLotParams,
  marketPrices = [],
  recommendation,
  matchedBuyers = [],
  storageFacilities = SAMPLE_STORAGE_FACILITIES,
  onNavigateTab,
  onSelectBuyerForDeal,
  onOpenDemoTour,
}) => {
  const activeDistrict = locationDistrict || district;
  const activeCrop = currentCrop || crop;
  const activeQuantity = currentQuantity !== undefined ? currentQuantity : quantity;
  const activeQuality = currentQuality || quality;

  // Local state for the "Find the Best Selling Option" form
  const [formCrop, setFormCrop] = useState<CropType>(activeCrop);
  const [formQty, setFormQty] = useState<number>(activeQuantity);
  const [formQuality, setFormQuality] = useState<QualityGrade>(activeQuality);
  const [formDistrict, setFormDistrict] = useState<string>(activeDistrict);
  const [formHarvestStatus, setFormHarvestStatus] = useState<HarvestStatus>('Harvested');
  const [formStorage, setFormStorage] = useState<boolean>(storageAvailable);
  const [formRadius, setFormRadius] = useState<number>(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      if (onUpdateLotParams) {
        onUpdateLotParams({
          crop: formCrop,
          quantity: formQty,
          quality: formQuality,
          locationDistrict: formDistrict,
          harvestStatus: formHarvestStatus,
          storageAvailable: formStorage,
          maxRadiusKm: formRadius,
        });
      }
      setIsAnalyzing(false);
    }, 300);
  };

  // Find snapshots for key local mandis
  const akolaMandi = marketPrices.find(p => p.marketName.includes('Akola') && p.crop === activeCrop);
  const washimMandi = marketPrices.find(p => p.marketName.includes('Washim') && p.crop === activeCrop);
  const amravatiMandi = marketPrices.find(p => p.marketName.includes('Amravati') && p.crop === activeCrop);

  const nearbyStorage = storageFacilities[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Hero Banner - FasalMitr Lush Agricultural Theme */}
      <div className="bg-gradient-to-br from-emerald-850 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeDistrict} District, Maharashtra</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Good morning, {farmerName} 👋
            </h1>
            <p className="text-emerald-100/90 text-sm max-w-xl leading-relaxed">
              Your registered lot: <strong className="text-amber-300 font-bold">{activeQuantity} Quintals</strong> of{' '}
              <strong className="text-white font-bold">{activeQuality} {activeCrop}</strong>. Real-time net realization intelligence is synchronized below.
            </p>
          </div>

          {/* Key Metric Blocks */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="bg-emerald-950/80 backdrop-blur-md rounded-2xl p-4 border border-emerald-800/60 shadow-inner">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block mb-1">
                Best Net Realization
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ₹{recommendation.expectedNetRealizationPerQ.toLocaleString()}
                <span className="text-xs font-normal text-emerald-200 ml-1">/q</span>
              </div>
              <span className="text-xs text-amber-300 font-bold flex items-center mt-1.5">
                <TrendingUp className="w-3.5 h-3.5 mr-1 text-amber-400" />
                +₹{recommendation.potentialUpsidePerQ}/q vs basic mandi
              </span>
            </div>

            <div className="bg-emerald-950/80 backdrop-blur-md rounded-2xl p-4 border border-emerald-800/60 shadow-inner">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block mb-1">
                Total Net Realization
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight">
                ₹{recommendation.expectedTotalRealization.toLocaleString()}
              </div>
              <span className="text-xs text-emerald-200/80 block mt-1.5 font-medium">
                For {activeQuantity} quintals lot
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Mandi Snapshot */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-stone-900">Regional Mandi Snapshot</h2>
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-lg">({activeCrop} Today)</span>
          </div>
          <button
            onClick={() => onNavigateTab('market_intelligence')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 transition cursor-pointer"
          >
            <span>View All Mandis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Akola */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-stone-900">Akola APMC Mandi</span>
              <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded-md">15 km</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-stone-900">
                ₹{(akolaMandi?.modalPrice || 5000).toLocaleString()}<span className="text-xs font-normal text-stone-500">/q</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold text-emerald-700 bg-emerald-50">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +3.2%
              </span>
            </div>
            <div className="mt-3 text-xs text-stone-500 flex justify-between border-t border-stone-100 pt-2.5">
              <span>Arrivals: {akolaMandi?.arrivalQuantity || 850} q</span>
              <span className="font-bold text-emerald-800">Net: ~₹4,850/q</span>
            </div>
          </div>

          {/* Washim */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-stone-900">Washim APMC Mandi</span>
              <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded-md">65 km</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-stone-900">
                ₹{(washimMandi?.modalPrice || 5150).toLocaleString()}<span className="text-xs font-normal text-stone-500">/q</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold text-emerald-700 bg-emerald-50">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +4.1%
              </span>
            </div>
            <div className="mt-3 text-xs text-stone-500 flex justify-between border-t border-stone-100 pt-2.5">
              <span>Arrivals: {washimMandi?.arrivalQuantity || 620} q</span>
              <span className="font-bold text-emerald-800">Net: ~₹4,900/q</span>
            </div>
          </div>

          {/* Amravati */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-stone-900">Amravati APMC Market</span>
              <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded-md">90 km</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-stone-900">
                ₹{(amravatiMandi?.modalPrice || 5080).toLocaleString()}<span className="text-xs font-normal text-stone-500">/q</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold text-rose-700 bg-rose-50">
                <TrendingDown className="w-3 h-3 mr-0.5" /> -0.8%
              </span>
            </div>
            <div className="mt-3 text-xs text-stone-500 flex justify-between border-t border-stone-100 pt-2.5">
              <span>Arrivals: {amravatiMandi?.arrivalQuantity || 720} q</span>
              <span className="font-bold text-stone-700">Net: ~₹4,850/q</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Market Recommendation Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-7 text-white border border-stone-800 shadow-md relative overflow-hidden space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase block">
                FasalMitr AI Recommendation
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {recommendation.recommendedActionTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-[11px] text-stone-400 block font-medium">Confidence Score</span>
              <span className="text-sm font-bold text-emerald-400">{recommendation.confidenceScore}% Model Match</span>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              recommendation.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              recommendation.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {recommendation.riskLevel} RISK
            </div>
          </div>
        </div>

        {/* Realization Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-stone-800/90 rounded-2xl p-4 border border-stone-700/80">
            <span className="text-xs text-stone-400 block font-medium">Recommended Destination</span>
            <span className="text-base font-bold text-white mt-1 block">{recommendation.recommendedDestination}</span>
            <span className="text-xs text-amber-300 mt-1 block font-semibold">
              Gross Quote: ₹{recommendation.recommendedPricePerQ.toLocaleString()}/q
            </span>
          </div>

          <div className="bg-stone-800/90 rounded-2xl p-4 border border-stone-700/80">
            <span className="text-xs text-stone-400 block font-medium">Expected Net Realization</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              ₹{recommendation.expectedNetRealizationPerQ.toLocaleString()}
              <span className="text-xs font-normal text-stone-400"> / quintal</span>
            </div>
            <span className="text-xs text-stone-400 block mt-1">
              Total Net: ₹{recommendation.expectedTotalRealization.toLocaleString()}
            </span>
          </div>

          <div className="bg-stone-800/90 rounded-2xl p-4 border border-stone-700/80">
            <span className="text-xs text-stone-400 block font-medium">Immediate Best Mandi Net</span>
            <div className="text-xl sm:text-2xl font-bold text-stone-300 mt-1">
              ₹{recommendation.currentBestImmediateNetPerQ.toLocaleString()}
              <span className="text-xs font-normal text-stone-400"> / quintal</span>
            </div>
            <span className="text-xs text-emerald-400 font-bold block mt-1">
              Upside Gain: +₹{recommendation.potentialUpsidePerQ}/q (+₹{recommendation.potentialTotalUpside.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Why Reasons Bullet Points */}
        <div className="bg-stone-800/60 rounded-2xl p-4 border border-stone-700/60">
          <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2.5 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Reasoning Matrix</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
            {recommendation.reasons.map((r, i) => (
              <div key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-xs text-stone-400 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-stone-400" />
            <span>Nearby Storage: <strong className="text-stone-200">{nearbyStorage?.name}</strong> (₹{nearbyStorage?.costPerDayPerQ}/q/day, {nearbyStorage?.distanceKm} km)</span>
          </div>
          <button
            id="btn-view-full-analysis"
            onClick={() => onNavigateTab('sell_vs_hold')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition flex items-center space-x-2 shadow-sm cursor-pointer"
          >
            <span>View Full Analysis & Breakdown</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two-Column Lower Layout: Farmer Input Flow + Matched Buyers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Farmer Input Flow */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-stone-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Find the Best Selling Option</h3>
              <p className="text-xs text-stone-500">Update harvest specifics to re-run AI engine</p>
            </div>
          </div>

          <form onSubmit={handleAnalyzeSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">Crop</label>
                <select
                  id="input-form-crop"
                  value={formCrop}
                  onChange={(e) => setFormCrop(e.target.value as CropType)}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-800 bg-stone-50/50 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition"
                >
                  {MAHARASHTRA_CROPS.map((c) => (
                    <option key={c.name} value={c.name}>{c.name} ({c.marathiName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">Quantity (Quintals)</label>
                <input
                  id="input-form-quantity"
                  type="number"
                  min="1"
                  max="1000"
                  value={formQty}
                  onChange={(e) => setFormQty(Number(e.target.value))}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-800 bg-stone-50/50 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">Location District</label>
                <select
                  id="input-form-district"
                  value={formDistrict}
                  onChange={(e) => setFormDistrict(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-800 bg-stone-50/50 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition"
                >
                  {['Akola', 'Washim', 'Amravati', 'Buldhana', 'Nagpur', 'Nashik', 'Pune', 'Latur', 'Solapur'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">Quality / Grade</label>
                <select
                  id="input-form-quality"
                  value={formQuality}
                  onChange={(e) => setFormQuality(e.target.value as QualityGrade)}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-800 bg-stone-50/50 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition"
                >
                  <option value="Grade A">Grade A (High Purity)</option>
                  <option value="Grade B">Grade B (Standard)</option>
                  <option value="Grade C">Grade C (Commercial)</option>
                  <option value="Fair Average Quality (FAQ)">FAQ (Fair Average)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">Harvest Status</label>
                <select
                  id="input-form-harvest-status"
                  value={formHarvestStatus}
                  onChange={(e) => setFormHarvestStatus(e.target.value as HarvestStatus)}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-stone-800 bg-stone-50/50 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition"
                >
                  <option value="Harvested">Harvested & Ready</option>
                  <option value="Ready in 7 Days">Ready in 7 Days</option>
                  <option value="Ready in 15 Days">Ready in 15 Days</option>
                  <option value="In Field">In Field (Pre-Harvest)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">Storage Available?</label>
                <div className="flex items-center space-x-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setFormStorage(true)}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs border transition cursor-pointer ${
                      formStorage ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStorage(false)}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs border transition cursor-pointer ${
                      !formStorage ? 'bg-stone-900 text-white border-stone-900 shadow-xs' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 font-semibold text-stone-700">
                <span>Maximum Selling Radius</span>
                <span className="font-bold text-emerald-700">{formRadius} km</span>
              </div>
              <input
                id="input-form-radius"
                type="range"
                min="20"
                max="350"
                step="10"
                value={formRadius}
                onChange={(e) => setFormRadius(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <button
              id="btn-analyze-market"
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Realization Matrix...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Market & Match Buyers</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 7 Cols: Matched Direct Buyers */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Institutional Direct Buyers</h3>
                  <p className="text-xs text-stone-500">Filtered for {activeCrop} • Verified Procurement Offers</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('find_buyers')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>View All ({matchedBuyers.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {matchedBuyers.slice(0, 2).map((item) => (
                <div
                  key={item.requirement.id}
                  className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200 hover:border-emerald-300 hover:bg-stone-50 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900 text-sm">{item.requirement.businessName}</span>
                        {item.requirement.verificationStatus === 'Verified' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-1 font-medium">
                        {item.requirement.location} • {item.requirement.distanceKm || 35} km away • Reliability: {item.requirement.reliabilityScore}/100
                      </p>
                    </div>

                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-center">
                      {item.matchScore.totalScore}% Match
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-200/70 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px] font-semibold">Offered Price</span>
                      <span className="font-bold text-stone-900 text-sm">
                        ₹{item.requirement.offeredPrice.toLocaleString()}/q
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px] font-semibold">Net Realization</span>
                      <span className="font-extrabold text-emerald-800 text-sm">
                        ₹{item.netRealization.netRealizationPerQ.toLocaleString()}/q
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px] font-semibold">Required Qty</span>
                      <span className="font-semibold text-stone-700 text-sm">
                        {item.requirement.requiredQuantity} q ({item.requirement.qualityRequired})
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[11px] text-stone-500 line-clamp-1 italic max-w-sm">
                      "{item.matchScore.explanation}"
                    </p>
                    {onSelectBuyerForDeal && (
                      <button
                        onClick={() => onSelectBuyerForDeal(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 ml-2 shadow-xs"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Accept Deal</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FPO Bulk Aggregation Banner */}
          <div className="mt-4 bg-amber-50/90 rounded-2xl p-4 border border-amber-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-amber-950 block">Join FPO Bulk Aggregation Cluster</span>
                <span className="text-amber-800 font-medium">Combine your {activeQuantity}q lot with 4 local farmers to fill a 100q bulk contract</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('fpo_aggregation')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition cursor-pointer shrink-0 ml-3 shadow-xs"
            >
              View FPO Cluster
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
