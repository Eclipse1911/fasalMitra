import React, { useState } from 'react';
import {
  Layers,
  Users,
  CheckCircle2,
  Building2,
  PackageCheck,
  TrendingUp,
  Scale,
  Sparkles,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ReceiptText,
  DollarSign,
} from 'lucide-react';
import { FPOAggregationCluster, BuyerRequirement } from '../types';
import { FPOService } from '../services/fpoService';

interface FpoAggregationViewProps {
  onCommitAggregation: (cluster: FPOAggregationCluster) => void;
}

export const FpoAggregationView: React.FC<FpoAggregationViewProps> = ({
  onCommitAggregation,
}) => {
  const [cluster, setCluster] = useState<FPOAggregationCluster>(FPOService.generateDefaultCluster());
  const [isDispatched, setIsDispatched] = useState(false);

  const req = cluster.targetBuyerRequirement;
  const farmers = cluster.contributingFarmers;

  const totalAllocated = cluster.allocatedQuantity;
  const isFulfilled = totalAllocated >= req.requiredQuantity;
  const fpoTotalMargin = totalAllocated * cluster.potentialFpoMarginPerQ;
  const farmersGrossPayout = totalAllocated * (req.offeredPrice - cluster.potentialFpoMarginPerQ);

  const handleCreateLot = () => {
    setIsDispatched(true);
    onCommitAggregation(cluster);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Smallholder Collective Bargaining Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              FPO Bulk Demand Aggregator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pool small farmer harvests into high-volume institutional lots to unlock bulk processor premiums and shared freight economies.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100">
            <div>
              <span className="text-[11px] text-indigo-600 font-semibold block">Operating FPO</span>
              <span className="text-sm font-bold text-slate-900">Akola FPO (142 Members)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Aggregation Schematic Diagram */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-md">
        
        {/* Top: Buyer Institutional Requirement */}
        <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 max-w-2xl mx-auto text-center shadow-lg">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            Target Buyer Institutional Order
          </span>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4">
            <h3 className="text-xl font-bold text-white">{req.businessName}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Verified Procurement
            </span>
          </div>
          <div className="mt-3 flex justify-center items-center space-x-6 text-xs sm:text-sm text-slate-300">
            <div>
              <span className="text-slate-400 block text-[11px]">Required Volume:</span>
              <span className="font-bold text-white text-base">{req.requiredQuantity} Quintals</span>
            </div>
            <div className="h-6 w-px bg-slate-700"></div>
            <div>
              <span className="text-slate-400 block text-[11px]">Commodity:</span>
              <span className="font-bold text-white text-base">{req.qualityRequired} {req.crop}</span>
            </div>
            <div className="h-6 w-px bg-slate-700"></div>
            <div>
              <span className="text-slate-400 block text-[11px]">Offered Rate:</span>
              <span className="font-bold text-emerald-400 text-base">₹{req.offeredPrice.toLocaleString()} / q</span>
            </div>
          </div>
        </div>

        {/* Central Connector Arrow */}
        <div className="flex flex-col items-center justify-center my-4 space-y-1">
          <div className="px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>FPO AUTOMATED AGGREGATION & ASSAYING ENGINE</span>
          </div>
          <div className="h-6 w-0.5 bg-indigo-400/50"></div>
        </div>

        {/* Bottom: Contributing Smallholder Farmers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {farmers.map((f, i) => (
            <div
              key={f.farmerId}
              className={`rounded-2xl p-3.5 border text-center transition ${
                f.farmerName === 'Ramesh Patil'
                  ? 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/40'
                  : 'bg-slate-800/80 border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                <span>Farmer #{i + 1}</span>
                {f.farmerName === 'Ramesh Patil' && (
                  <span className="font-bold text-indigo-400">YOU</span>
                )}
              </div>
              <h4 className="font-bold text-xs text-white truncate">{f.farmerName}</h4>
              <div className="my-2 text-lg font-bold text-indigo-300">
                {f.quantity} q
              </div>
              <span className="text-[10px] text-slate-400 block">
                Payout: ₹{f.estimatedPayout.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Aggregation Summary & Commit Action */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300 space-y-0.5">
            <div>
              Total Collected: <strong className="text-emerald-400 font-semibold">{totalAllocated} / {req.requiredQuantity} Quintals (100% Fulfilled)</strong>
            </div>
            <div className="text-slate-400">
              Total Order Gross Value: ₹{cluster.totalGrossValue.toLocaleString()} • FPO Facilitation Fee: ₹{fpoTotalMargin.toLocaleString()}
            </div>
          </div>

          <button
            id="btn-create-aggregated-lot"
            onClick={handleCreateLot}
            disabled={isDispatched}
            className={`px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2 transition shadow-md cursor-pointer ${
              isDispatched
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <PackageCheck className="w-5 h-5" />
            <span>{isDispatched ? 'Aggregated Lot Committed & Dispatched!' : 'Create Aggregated Lot & Issue Contracts'}</span>
          </button>
        </div>

      </div>

      {/* Breakdown Table: Member Farmer Settlement Slips */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Member Farmer Payout & Allotment Schedule
            </h3>
            <p className="text-xs text-slate-500">
              All participating farmers receive a uniform ₹5,120/q net payout with shared assaying & logistics
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 self-start sm:self-auto">
            FPO Margin: ₹80/q (Grading + Dispatch)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Member Farmer</th>
                <th className="py-3 px-4 text-center">Quality Grade</th>
                <th className="py-3 px-4 text-right">Contributed Qty</th>
                <th className="py-3 px-4 text-right">Buyer Offer</th>
                <th className="py-3 px-4 text-right">FPO Fee</th>
                <th className="py-3 px-4 text-right bg-indigo-50/70 text-indigo-900 font-semibold">
                  Net Farmer Rate
                </th>
                <th className="py-3 px-4 text-right">Total Net Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {farmers.map((f) => {
                const isRamesh = f.farmerName === 'Ramesh Patil';
                return (
                  <tr key={f.farmerId} className={isRamesh ? 'bg-indigo-50/40 font-semibold' : ''}>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                        <span>{f.farmerName}</span>
                        {isRamesh && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">Akola District</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                        {f.quality}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {f.quantity} q
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      ₹5,200/q
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      - ₹80/q
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-indigo-700 bg-indigo-50/30">
                      ₹{f.payoutRatePerQ.toLocaleString()}/q
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{f.estimatedPayout.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
