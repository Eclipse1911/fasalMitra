import React, { useState } from 'react';
import {
  Calculator,
  Truck,
  Building2,
  Receipt,
  Scale,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { RealizationService } from '../services/realizationService';
import { LogisticsService } from '../services/logisticsService';
import { StorageService } from '../services/storageService';

interface NetRealizationCalculatorProps {
  initialPrice?: number;
  initialQuantity?: number;
  initialCrop?: string;
  initialDistrict?: string;
}

export const NetRealizationCalculator: React.FC<NetRealizationCalculatorProps> = ({
  initialPrice = 5200,
  initialQuantity = 20,
  initialCrop = 'Soybean',
  initialDistrict = 'Akola',
}) => {
  // Interactive inputs
  const [sellingPrice, setSellingPrice] = useState<number>(initialPrice);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [distanceKm, setDistanceKm] = useState<number>(35);
  const [storageDays, setStorageDays] = useState<number>(0);
  const [storageRatePerDay, setStorageRatePerDay] = useState<number>(4.0);
  const [isApmc, setIsApmc] = useState<boolean>(false);
  const [mandiCessPercent, setMandiCessPercent] = useState<number>(1.05);

  // Dynamic calculation
  const safeQty = Math.max(1, quantity);
  const grossValue = Math.round(sellingPrice * safeQty);

  const logistics = LogisticsService.calculateEstimate('Farm Gate', 'Destination', distanceKm, safeQty);
  const transportCost = logistics.totalTransportCost;
  const transportCostPerQ = logistics.costPerQuintal;

  const storageCalc = StorageService.calculateStorageCost(safeQty, storageDays, storageRatePerDay);
  const storageCost = storageCalc.totalCost;
  const storageCostPerQ = storageCalc.costPerQuintal;

  const cessAmount = isApmc ? Math.round(grossValue * (mandiCessPercent / 100)) : 0;
  const handlingAmount = isApmc ? Math.round(safeQty * 25) : Math.round(safeQty * 10);
  const otherCosts = cessAmount + handlingAmount;
  const otherCostsPerQ = Math.round((otherCosts / safeQty) * 10) / 10;

  const netRealizationTotal = grossValue - transportCost - storageCost - otherCosts;
  const netRealizationPerQ = Math.round((netRealizationTotal / safeQty) * 10) / 10;
  const netMarginPercent = Math.round((netRealizationTotal / grossValue) * 1000) / 10;

  // Comparison Presets
  const comparisons = [
    {
      id: 'local_akola',
      name: 'Akola Mandi (15 km)',
      type: 'Local APMC',
      price: 5000,
      distance: 15,
      storageDays: 0,
      isAPMC: true,
    },
    {
      id: 'distant_washim',
      name: 'Washim Mandi (65 km)',
      type: 'Regional APMC',
      price: 5150,
      distance: 65,
      storageDays: 0,
      isAPMC: true,
    },
    {
      id: 'direct_buyer',
      name: 'ABC Agro Foods (Direct)',
      type: 'Verified Buyer',
      price: 5200,
      distance: 35,
      storageDays: 0,
      isAPMC: false,
    },
    {
      id: 'warehouse_hold',
      name: 'Warehouse (7-Day Hold)',
      type: 'Price Momentum',
      price: 5350,
      distance: 25,
      storageDays: 7,
      isAPMC: true,
    },
  ].map((preset) => {
    const res = RealizationService.calculate({
      destinationName: preset.name,
      destinationType: preset.isAPMC ? 'LOCAL_MANDI' : 'DIRECT_BUYER',
      offeredPricePerQ: preset.price,
      quantityQuintals: safeQty,
      distanceKm: preset.distance,
      storageDays: preset.storageDays,
      storageRatePerDayPerQ: 4.0,
      isAPMC: preset.isAPMC,
      baselineLocalNetPerQ: 4850,
    });
    return {
      ...preset,
      res,
    };
  });

  const chartData = [
    { name: 'Farmer Net Payout', amount: netRealizationTotal, fill: '#059669' },
    { name: 'Transport & Freight', amount: transportCost, fill: '#0d9488' },
    { name: 'Storage / Holding', amount: storageCost, fill: '#f59e0b' },
    { name: 'Mandi Cess & Fees', amount: otherCosts, fill: '#ef4444' },
  ].filter(d => d.amount > 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4" />
          <span>Core Profitability Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Net Realization Calculator
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl font-medium">
          Understand your true take-home earnings by factoring in road transport, storage fees, and APMC cess deductions instead of looking at raw nominal rates.
        </p>
      </div>

      {/* Main Interactive Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Sliders and Inputs */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
          <h2 className="font-extrabold text-stone-900 text-base pb-3 border-b border-stone-100 flex items-center justify-between">
            <span>Transaction & Logistics Parameters</span>
            <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Dynamic Inputs</span>
          </h2>

          {/* Selling Price */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-stone-700 mb-2">
              <span>Offered Selling Price (₹/quintal)</span>
              <span className="text-sm font-black text-emerald-700">₹{sellingPrice.toLocaleString()} / q</span>
            </div>
            <input
              id="slider-selling-price"
              type="range"
              min="1500"
              max="12000"
              step="50"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-semibold">
              <span>₹1,500</span>
              <span>₹5,200 (Default)</span>
              <span>₹12,000</span>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-stone-700 mb-2">
              <span>Produce Quantity (Quintals)</span>
              <span className="text-sm font-black text-stone-900">{quantity} Quintals</span>
            </div>
            <input
              id="slider-quantity"
              type="range"
              min="5"
              max="250"
              step="5"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
            />
          </div>

          {/* Transit Distance */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-stone-700 mb-2">
              <span>Logistics Transit Distance</span>
              <span className="text-sm font-black text-emerald-700">{distanceKm} km</span>
            </div>
            <input
              id="slider-distance"
              type="range"
              min="5"
              max="350"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
            />
            <span className="text-[11px] text-stone-500 block mt-1 font-medium">
              Vehicle assigned: <strong className="text-stone-700">{logistics.vehicleType}</strong>
            </span>
          </div>

          {/* Storage Duration */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-stone-700 mb-2">
              <span>Storage Holding Duration (Days)</span>
              <span className="text-sm font-black text-amber-700">{storageDays} Days</span>
            </div>
            <input
              id="slider-storage-days"
              type="range"
              min="0"
              max="45"
              step="1"
              value={storageDays}
              onChange={(e) => setStorageDays(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between items-center text-[11px] text-stone-500 mt-1.5 font-medium">
              <span>Warehouse Rate: ₹{storageRatePerDay}/q/day</span>
              <span className="font-bold text-stone-800">Storage cost: ₹{storageCost.toLocaleString()}</span>
            </div>
          </div>

          {/* APMC Cess Checkbox */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-stone-800 block">Is this an APMC Mandi transaction?</span>
              <span className="text-[11px] text-stone-500 font-medium">APMC incurs 1.05% market cess + ₹25/q handling</span>
            </div>
            <button
              id="toggle-apmc"
              type="button"
              onClick={() => setIsApmc(!isApmc)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isApmc ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-stone-100 text-stone-700'
              }`}
            >
              {isApmc ? 'APMC Mandi (Yes)' : 'Direct Buyer (No Cess)'}
            </button>
          </div>

        </div>

        {/* Right 6 Cols: Live Math Card & Visual Breakdown */}
        <div className="lg:col-span-6 bg-stone-900 rounded-3xl p-6 text-white border border-stone-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  Calculated Outcome
                </span>
                <h3 className="text-lg font-black text-white">Net Farmer Realization</h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-stone-400 block">Take-Home Efficiency</span>
                <span className="text-sm font-extrabold text-emerald-400">{netMarginPercent}% of Gross</span>
              </div>
            </div>

            {/* Big Numbers */}
            <div className="grid grid-cols-2 gap-4 my-5 bg-stone-800/70 rounded-2xl p-4 border border-stone-700/60">
              <div>
                <span className="text-xs text-stone-400 block font-medium">NET REALIZATION TOTAL</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight mt-0.5">
                  ₹{netRealizationTotal.toLocaleString()}
                </div>
                <span className="text-[11px] text-stone-400 font-medium">Total for {quantity} quintals</span>
              </div>

              <div>
                <span className="text-xs text-stone-400 block font-medium">NET PER QUINTAL</span>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                  ₹{netRealizationPerQ.toLocaleString()}
                  <span className="text-xs text-stone-300 font-normal"> / q</span>
                </div>
                <span className="text-[11px] text-emerald-300 font-bold">
                  Gross: ₹{sellingPrice.toLocaleString()}/q
                </span>
              </div>
            </div>

            {/* Formula Math Waterfall Breakdown */}
            <div className="space-y-2.5 text-xs text-stone-300 font-medium">
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span className="text-white font-semibold">Gross Value (₹{sellingPrice}/q × {quantity} q)</span>
                <span className="font-bold text-white">₹{grossValue.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 text-rose-300 border-b border-stone-800">
                <span className="flex items-center">
                  <Truck className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                  Less: Transportation Freight ({distanceKm} km)
                </span>
                <span>- ₹{transportCost.toLocaleString()} (₹{transportCostPerQ}/q)</span>
              </div>

              {storageCost > 0 && (
                <div className="flex justify-between py-1 text-amber-300 border-b border-stone-800">
                  <span className="flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                    Less: Storage Charge ({storageDays} Days)
                  </span>
                  <span>- ₹{storageCost.toLocaleString()} (₹{storageCostPerQ}/q)</span>
                </div>
              )}

              <div className="flex justify-between py-1 text-stone-400 border-b border-stone-800">
                <span className="flex items-center">
                  <Receipt className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                  Less: Weighment & Transaction Fees
                </span>
                <span>- ₹{otherCosts.toLocaleString()} (₹{otherCostsPerQ}/q)</span>
              </div>
            </div>
          </div>

          {/* Visual Mini Chart */}
          <div className="mt-5 pt-3.5 border-t border-stone-800">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block mb-2">
              Rupee Allocation Breakdown
            </span>
            <div className="h-16 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip
                    formatter={(val: number) => [`₹${val.toLocaleString()}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 6, 6]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* Side-by-Side 4-Option Selling Pathway Comparison Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <h2 className="font-extrabold text-stone-900 text-base mb-1">
          Comparative Realization Across Common Options ({quantity} Quintals {initialCrop})
        </h2>
        <p className="text-xs text-stone-500 mb-4 font-medium">
          See why direct buyer or temporary warehouse hold often outperforms the local mandi
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparisons.map((c) => {
            const isHighest = c.res.netRealizationPerQ >= 5100;
            return (
              <div
                key={c.id}
                className={`rounded-2xl p-4 border transition ${
                  isHighest
                    ? 'bg-emerald-50/70 border-emerald-200 ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-stone-500">{c.type}</span>
                  {isHighest && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white">
                      TOP GAIN
                    </span>
                  )}
                </div>
                <h4 className="font-extrabold text-stone-900 text-sm truncate">{c.name}</h4>

                <div className="my-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Offered Rate:</span>
                    <span className="font-bold text-stone-900">₹{c.price.toLocaleString()}/q</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Distance / Freight:</span>
                    <span>{c.distance} km (-₹{c.res.transportCostPerQ}/q)</span>
                  </div>
                  {c.storageDays > 0 && (
                    <div className="flex justify-between text-amber-700 font-medium">
                      <span>Storage (7 Days):</span>
                      <span>-₹{c.res.storageCostPerQ}/q</span>
                    </div>
                  )}
                </div>

                <div className="pt-2.5 border-t border-stone-200">
                  <span className="text-[11px] text-stone-500 font-medium block">Final Net Realization</span>
                  <div className="text-xl font-black text-emerald-800">
                    ₹{c.res.netRealizationPerQ.toLocaleString()}
                    <span className="text-xs font-normal text-stone-500"> / q</span>
                  </div>
                  <span className="text-xs font-bold text-stone-700 block mt-0.5">
                    Total: ₹{c.res.netRealizationTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
