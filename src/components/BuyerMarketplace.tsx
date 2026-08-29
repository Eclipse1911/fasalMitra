import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  Info,
  Filter,
  Scale,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  X,
  Layers,
} from 'lucide-react';
import { BuyerRequirement, CropType, BuyerMatchItem, QualityGrade } from '../types';
import { MAHARASHTRA_CROPS } from '../data/sampleData';

interface BuyerMarketplaceProps {
  currentCrop: CropType;
  farmerQuantity: number;
  farmerQuality: QualityGrade;
  farmerDistrict: string;
  matchedBuyers: BuyerMatchItem[];
  allRequirements: BuyerRequirement[];
  onSelectBuyerForDeal: (match: BuyerMatchItem) => void;
  onNavigateTab: (tab: any) => void;
  onOpenCreateRequirementModal?: () => void;
  userRole?: string;
}

export const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({
  currentCrop,
  farmerQuantity,
  farmerQuality,
  farmerDistrict,
  matchedBuyers,
  allRequirements,
  onSelectBuyerForDeal,
  onNavigateTab,
  onOpenCreateRequirementModal,
  userRole,
}) => {
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>(currentCrop);
  const [selectedQualityFilter, setSelectedQualityFilter] = useState<string>('All');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('All Districts');
  const [activeTab, setActiveTab] = useState<'matches' | 'all_demand'>('matches');
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<BuyerMatchItem | null>(null);

  // Filter matched buyers
  const filteredMatches = matchedBuyers.filter((item) => {
    if (selectedCropFilter !== 'All Crops' && item.requirement.crop !== selectedCropFilter) return false;
    if (selectedQualityFilter !== 'All' && item.requirement.qualityRequired !== selectedQualityFilter) return false;
    if (selectedDistrictFilter !== 'All Districts' && item.requirement.district !== selectedDistrictFilter) return false;
    return true;
  });

  // Calculate aggregated demand across crops
  const demandSummary: Record<string, { totalQty: number; avgPrice: number; count: number }> = {};
  allRequirements.forEach((r) => {
    if (!demandSummary[r.crop]) {
      demandSummary[r.crop] = { totalQty: 0, avgPrice: 0, count: 0 };
    }
    demandSummary[r.crop].totalQty += r.requiredQuantity;
    demandSummary[r.crop].avgPrice += r.offeredPrice;
    demandSummary[r.crop].count += 1;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>Direct Procurement Marketplace</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Verified Institutional Buyer Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect directly with verified oilseed processors, ginning mills, pulse processors, and retailers to eliminate middleman margins.
            </p>
          </div>

          {/* Toggle View Tabs */}
          <div className="flex items-center space-x-2">
            <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 text-xs font-bold">
              <button
                id="tab-btn-matches"
                onClick={() => setActiveTab('matches')}
                className={`px-3.5 py-1.5 rounded-lg cursor-pointer transition ${
                  activeTab === 'matches' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-600'
                }`}
              >
                AI Matched for Ramesh ({matchedBuyers.length})
              </button>
              <button
                id="tab-btn-all-demand"
                onClick={() => setActiveTab('all_demand')}
                className={`px-3.5 py-1.5 rounded-lg cursor-pointer transition ${
                  activeTab === 'all_demand' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-600'
                }`}
              >
                Statewide Buyer Demand Board
              </button>
            </div>
          </div>
        </div>

        {/* Aggregate Demand Ticker Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-indigo-50/70 rounded-2xl p-3.5 border border-indigo-100">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Soybean Demand</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">1,250 q required</div>
            <span className="text-[11px] text-indigo-600 font-medium">Avg Offer: ₹5,190/q</span>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Cotton Demand</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">850 q required</div>
            <span className="text-[11px] text-emerald-600 font-medium">Avg Offer: ₹7,380/q</span>
          </div>

          <div className="bg-amber-50/70 rounded-2xl p-3.5 border border-amber-100">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Onion Demand</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">2,100 q required</div>
            <span className="text-[11px] text-amber-600 font-medium">Avg Offer: ₹2,550/q</span>
          </div>

          <div className="bg-purple-50/70 rounded-2xl p-3.5 border border-purple-100">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Tur & Pulses</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">920 q required</div>
            <span className="text-[11px] text-purple-600 font-medium">Avg Offer: ₹9,550/q</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Filter Crop</label>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
            >
              <option value="All Crops">All Crops</option>
              {MAHARASHTRA_CROPS.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Quality Grade</label>
            <select
              value={selectedQualityFilter}
              onChange={(e) => setSelectedQualityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
            >
              <option value="All">All Grades</option>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
              <option value="Grade C">Grade C</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location District</label>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
            >
              <option value="All Districts">All Districts</option>
              {['Akola', 'Washim', 'Amravati', 'Nashik', 'Pune', 'Latur', 'Chhatrapati Sambhajinagar'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMatches.map((item) => {
          const req = item.requirement;
          const match = item.matchScore;
          const net = item.netRealization;

          return (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Card Header: Business name, verification, match score */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-base text-slate-900">{req.businessName}</h3>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {req.verificationStatus === 'Verified' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Buyer</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Verification Pending
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">
                        Reliability: <strong className="text-slate-800">{req.reliabilityScore}/100</strong>
                      </span>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      {match.totalScore}% Match
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 font-medium">{req.distanceKm || 35} km away</span>
                  </div>
                </div>

                {/* Key Requirements Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-2xl p-3.5 mt-4 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Crop & Quality</span>
                    <span className="font-bold text-slate-900">{req.crop}</span>
                    <span className="text-[10px] text-slate-500 block">{req.qualityRequired}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Required Qty</span>
                    <span className="font-bold text-slate-900">{req.requiredQuantity} Quintals</span>
                    <span className="text-[10px] text-slate-500 block">Open Contract</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Offered Rate</span>
                    <span className="font-bold text-indigo-600 text-sm">₹{req.offeredPrice.toLocaleString()}/q</span>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      +₹{req.offeredPrice - 5000}/q vs mandi
                    </span>
                  </div>
                </div>

                {/* Net Realization Highlight */}
                <div className="mt-3.5 bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-emerald-900 font-semibold block">
                      Expected Net Take-Home for your {farmerQuantity}q Lot:
                    </span>
                    <span className="text-sm font-bold text-emerald-950">
                      ₹{net.netRealizationPerQ.toLocaleString()}/q (Total: ₹{net.netRealizationTotal.toLocaleString()})
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                    -₹{net.transportCostPerQ} freight
                  </span>
                </div>

                {/* AI Match Explanation */}
                <div className="mt-3 text-xs text-slate-600 bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
                  <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Why this match?</span>
                  <p className="text-[11px] leading-relaxed italic text-slate-600">
                    "{match.explanation}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`btn-breakdown-${req.id}`}
                  onClick={() => setSelectedMatchForDetail(item)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 cursor-pointer py-2 px-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>View 7-Factor Score Breakdown</span>
                </button>

                <button
                  id={`btn-accept-buyer-${req.id}`}
                  onClick={() => onSelectBuyerForDeal(item)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Accept & Sell Direct</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7-Factor Scoring Breakdown Modal */}
      {selectedMatchForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">AI Scoring Breakdown</span>
                <h3 className="font-bold text-lg text-slate-900">
                  {selectedMatchForDetail.requirement.businessName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMatchForDetail(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-3.5 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl font-bold border border-slate-100">
                <span className="text-slate-800">Total Computed Match Score</span>
                <span className="text-base text-emerald-700">
                  {selectedMatchForDetail.matchScore.totalScore} / 100
                </span>
              </div>

              {/* 7 factors */}
              <div className="space-y-2.5 text-slate-700 px-1">
                <div className="flex justify-between items-center">
                  <span>1. Crop Compatibility (25 pts max)</span>
                  <span className="font-bold text-slate-900">{selectedMatchForDetail.matchScore.cropScore} / 25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>2. Quantity Requirement Match (20 pts max)</span>
                  <span className="font-bold text-slate-900">{selectedMatchForDetail.matchScore.quantityScore} / 20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>3. Quality Grade Compliance (15 pts max)</span>
                  <span className="font-bold text-slate-900">{selectedMatchForDetail.matchScore.qualityScore} / 15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>4. Price Competitiveness vs Mandi (20 pts max)</span>
                  <span className="font-bold text-slate-900">{selectedMatchForDetail.matchScore.priceScore} / 20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>5. Geographic Distance Proximity (10 pts max)</span>
                  <span className="font-bold text-slate-900">{selectedMatchForDetail.matchScore.distanceScore} / 10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>6. Timeline & Date Compatibility (5 pts max)</span>
                  <span className="font-bold text-slate-900">{selectedMatchForDetail.matchScore.dateScore} / 5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>7. Buyer Reliability & Payment Index (5 pts max)</span>
                  <span className="font-bold text-slate-900">{selectedMatchForDetail.matchScore.reliabilityScore} / 5</span>
                </div>
              </div>

              {/* Strengths */}
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <span className="font-bold text-emerald-800 block mb-2">Algorithmic Strengths:</span>
                <div className="space-y-1.5">
                  {selectedMatchForDetail.matchScore.strengths.map((s, i) => (
                    <div key={i} className="flex items-center space-x-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const item = selectedMatchForDetail;
                setSelectedMatchForDetail(null);
                onSelectBuyerForDeal(item);
              }}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition cursor-pointer shadow-sm"
            >
              Proceed to Create Direct Deal
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
