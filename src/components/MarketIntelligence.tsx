import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  MapPin,
  Scale,
  Calendar,
  Layers,
  ArrowUpDown,
  Filter,
  BarChart2,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { CropType, MarketPriceRecord } from '../types';
import { MAHARASHTRA_CROPS, MAHARASHTRA_MARKETS, generateHistoricalPriceSeries } from '../data/sampleData';
import { RealizationService } from '../services/realizationService';

interface MarketIntelligenceProps {
  selectedCrop?: CropType;
  currentCrop?: CropType;
  onSelectCrop?: (crop: CropType) => void;
  selectedDistrict?: string;
  farmerDistrict?: string;
  onSelectDistrict?: (district: string) => void;
  farmerQuantity?: number;
  marketPrices: MarketPriceRecord[];
  onSelectMarketForCalc?: (marketName: string, price: number, distance: number) => void;
  onNavigateTab?: (tab: any) => void;
}

export const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({
  selectedCrop,
  currentCrop = 'Soybean',
  onSelectCrop,
  selectedDistrict,
  farmerDistrict = 'Akola',
  onSelectDistrict,
  farmerQuantity = 20,
  marketPrices = [],
  onSelectMarketForCalc,
  onNavigateTab,
}) => {
  const [internalCrop, setInternalCrop] = useState<CropType>(selectedCrop || currentCrop);
  const [internalDistrict, setInternalDistrict] = useState<string>(selectedDistrict || farmerDistrict);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3M' | '6M'>('6M');
  const [sortField, setSortField] = useState<'netRealization' | 'modalPrice' | 'distance' | 'arrivals'>('netRealization');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const activeCrop = selectedCrop || internalCrop;
  const activeDistrict = selectedDistrict || internalDistrict;

  const handleCropChange = (c: CropType) => {
    setInternalCrop(c);
    if (onSelectCrop) onSelectCrop(c);
  };

  const handleDistrictChange = (d: string) => {
    setInternalDistrict(d);
    if (onSelectDistrict) onSelectDistrict(d);
  };

  const cropInfo = MAHARASHTRA_CROPS.find(c => c.name === activeCrop) || MAHARASHTRA_CROPS[0];
  
  // Historical graph data
  const historicalData = generateHistoricalPriceSeries(activeCrop, `${activeDistrict} APMC Mandi`);

  // Compute Net Realization for all mandis for this crop
  const mandisForCrop = marketPrices.filter(p => p.crop === activeCrop);

  // Baseline local net
  const localAkola = mandisForCrop.find(m => m.marketName.includes(activeDistrict)) || mandisForCrop[0];
  const localAkolaNet = localAkola ? RealizationService.calculate({
    destinationName: localAkola.marketName,
    destinationType: 'LOCAL_MANDI',
    offeredPricePerQ: localAkola.modalPrice,
    quantityQuintals: farmerQuantity,
    distanceKm: localAkola.distanceKm || 15,
    isAPMC: true,
  }).netRealizationPerQ : 4850;

  const tableRows = mandisForCrop.map(m => {
    const realization = RealizationService.calculate({
      destinationName: m.marketName,
      destinationType: m.distanceKm && m.distanceKm > 30 ? 'DISTANT_MANDI' : 'LOCAL_MANDI',
      offeredPricePerQ: m.modalPrice,
      quantityQuintals: farmerQuantity,
      distanceKm: m.distanceKm || 50,
      isAPMC: true,
      baselineLocalNetPerQ: localAkolaNet,
    });

    return {
      ...m,
      realization,
      netRealizationPerQ: realization.netRealizationPerQ,
      netRealizationTotal: realization.netRealizationTotal,
      transportCostPerQ: realization.transportCostPerQ,
    };
  });

  // Find max net realization (Washim or best net)
  const maxNetRow = tableRows.length > 0
    ? tableRows.reduce((prev, curr) => curr.netRealizationPerQ > prev.netRealizationPerQ ? curr : prev, tableRows[0])
    : undefined;
  const maxModalRow = tableRows.length > 0
    ? tableRows.reduce((prev, curr) => curr.modalPrice > prev.modalPrice ? curr : prev, tableRows[0])
    : undefined;

  // Sort rows
  const sortedRows = [...tableRows].sort((a, b) => {
    let diff = 0;
    if (sortField === 'netRealization') diff = a.netRealizationPerQ - b.netRealizationPerQ;
    if (sortField === 'modalPrice') diff = a.modalPrice - b.modalPrice;
    if (sortField === 'distance') diff = (a.distanceKm || 0) - (b.distanceKm || 0);
    if (sortField === 'arrivals') diff = a.arrivalQuantity - b.arrivalQuantity;
    return sortAsc ? diff : -diff;
  });

  const districts = ['All Districts', 'Akola', 'Washim', 'Amravati', 'Buldhana', 'Nagpur', 'Nashik', 'Pune', 'Solapur', 'Sangli', 'Kolhapur', 'Chhatrapati Sambhajinagar', 'Jalgaon', 'Latur', 'Yavatmal', 'Nanded'];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with Title and Crop Selector */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>FasalMitr APMC Price Discovery Layer</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Market Intelligence & Price Comparison
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Real-time APMC mandi modal rates, daily arrivals, and transport-adjusted net realizations for {farmerQuantity} quintals.
            </p>
          </div>

          {/* MSP Benchmark Tag */}
          <div className="flex items-center space-x-4 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">Govt MSP Benchmark</span>
              <span className="text-base font-extrabold text-stone-900">₹{cropInfo.mspPrice.toLocaleString()}/q</span>
            </div>
            <div className="h-8 w-px bg-stone-200"></div>
            <div>
              <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">Shelf Life</span>
              <span className="text-xs font-bold text-emerald-700">{cropInfo.shelfLifeDays} Days</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-stone-100">
          
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Select Crop</label>
            <select
              id="select-market-crop"
              value={activeCrop}
              onChange={(e) => handleCropChange(e.target.value as CropType)}
              className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-semibold text-stone-800 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition"
            >
              {MAHARASHTRA_CROPS.map((c) => (
                <option key={c.name} value={c.name}>{c.name} ({c.marathiName})</option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Filter by District</label>
            <select
              id="select-market-district"
              value={activeDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-semibold text-stone-800 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Sort Comparison By</label>
            <div className="flex space-x-1.5">
              <select
                id="select-market-sort"
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
                className="flex-1 rounded-xl border border-stone-200 p-2.5 text-xs font-semibold text-stone-800 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition"
              >
                <option value="netRealization">Best Net Realization</option>
                <option value="modalPrice">Highest Modal Price</option>
                <option value="distance">Shortest Distance</option>
                <option value="arrivals">Highest Arrivals</option>
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="p-2.5 border border-stone-200 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 cursor-pointer transition"
                title="Toggle Sort Direction"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key Insight Highlight */}
          <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-200/80 flex flex-col justify-center">
            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Optimal Mandi Choice</span>
            <span className="text-xs font-bold text-stone-900 truncate mt-0.5">
              {maxNetRow?.marketName.replace(' APMC', '')}: ₹{maxNetRow?.netRealizationPerQ.toLocaleString()}/q Net
            </span>
          </div>

        </div>
      </div>

      {/* Critical Comparison Table with Net Realization Highlight */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-stone-900 text-base">
              Maharashtra Mandi Price & Realization Matrix
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              Notice: The highest nominal price mandi is not always the best net profit after logistics!
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold">
              ★ Best Net Realization
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Market / Mandi</th>
                <th className="py-3.5 px-4 text-center">Distance</th>
                <th className="py-3.5 px-4 text-right">Modal Price</th>
                <th className="py-3.5 px-4 text-right">Daily Arrival</th>
                <th className="py-3.5 px-4 text-center">Trend</th>
                <th className="py-3.5 px-4 text-right bg-emerald-50/90 text-emerald-950 font-black">
                  Net Realization (Per Q)
                </th>
                <th className="py-3.5 px-4 text-right">Total Net Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {sortedRows.map((row) => {
                const isBestNet = row.marketId === maxNetRow?.marketId;
                const isHighestModal = row.marketId === maxModalRow?.marketId && !isBestNet;

                return (
                  <tr
                    key={row.id}
                    className={`transition hover:bg-stone-50/80 ${
                      isBestNet ? 'bg-emerald-50/40 font-semibold' : ''
                    }`}
                  >
                    {/* Market Name & District */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-bold text-stone-900 flex items-center space-x-1.5">
                            <span>{row.marketName}</span>
                            {isBestNet && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white">
                                BEST NET
                              </span>
                            )}
                            {isHighestModal && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900" title="High nominal price, but freight reduces net profit">
                                High Nominal
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 font-medium">{row.district} District</span>
                        </div>
                      </div>
                    </td>

                    {/* Distance */}
                    <td className="py-3.5 px-4 text-center text-stone-600 font-semibold">
                      {row.distanceKm} km
                    </td>

                    {/* Modal Price */}
                    <td className="py-3.5 px-4 text-right font-bold text-stone-900">
                      ₹{row.modalPrice.toLocaleString()}
                      <span className="text-[10px] font-normal text-stone-400 block">
                        (₹{row.minPrice} - ₹{row.maxPrice})
                      </span>
                    </td>

                    {/* Arrival */}
                    <td className="py-3.5 px-4 text-right text-stone-700 font-medium">
                      {row.arrivalQuantity.toLocaleString()} q
                    </td>

                    {/* Trend */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                          row.trend === 'UP'
                            ? 'bg-emerald-50 text-emerald-700'
                            : row.trend === 'DOWN'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {row.trend === 'UP' && <TrendingUp className="w-3 h-3 mr-0.5" />}
                        {row.trend === 'DOWN' && <TrendingDown className="w-3 h-3 mr-0.5" />}
                        {row.trend === 'STABLE' && <Minus className="w-3 h-3 mr-0.5" />}
                        {row.trendPercent >= 0 ? `+${row.trendPercent}%` : `${row.trendPercent}%`}
                      </span>
                    </td>

                    {/* Net Realization Per Quintal */}
                    <td className={`py-3.5 px-4 text-right text-base font-black ${
                      isBestNet ? 'text-emerald-800 bg-emerald-50/60' : 'text-stone-900 bg-stone-50/40'
                    }`}>
                      ₹{row.netRealizationPerQ.toLocaleString()}
                      <span className="text-[10px] font-medium text-stone-500 block">
                        -₹{row.transportCostPerQ} freight
                      </span>
                    </td>

                    {/* Total Net Value */}
                    <td className="py-3.5 px-4 text-right font-extrabold text-stone-900">
                      ₹{row.netRealizationTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Price Trend and Arrival Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Price Trend Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                <span>6-Month Historical Price Trajectory & Bands</span>
              </h3>
              <p className="text-xs text-stone-500">Weekly modal prices (₹/quintal) in Vidarbha Mandis</p>
            </div>
            <div className="inline-flex rounded-xl border border-stone-200 p-0.5 bg-stone-50 text-xs font-bold">
              <button
                onClick={() => setSelectedTimeframe('3M')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition ${
                  selectedTimeframe === '3M' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-stone-600'
                }`}
              >
                Last 3 Months
              </button>
              <button
                onClick={() => setSelectedTimeframe('6M')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition ${
                  selectedTimeframe === '6M' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-stone-600'
                }`}
              >
                6 Months (Full)
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedTimeframe === '3M' ? historicalData.slice(-12) : historicalData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
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
                  formatter={(val: number) => [`₹${val.toLocaleString()}/q`, 'Modal Price']}
                  labelFormatter={(lbl) => `Week of ${lbl}`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#059669" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#priceGradient)" 
                  name="Modal Price (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: Arrival Volume Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 mb-1">
              Arrival Volume Correlation
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Higher daily arrivals typically dampen spot price bidding
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tableRows.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fafaf9" />
                  <XAxis 
                    dataKey="district" 
                    tick={{ fontSize: 10, fill: '#78716c' }} 
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#78716c' }} 
                  />
                  <Tooltip 
                    formatter={(val: number) => [`${val} quintals`, 'Daily Arrival']}
                    contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="arrivalQuantity" fill="#10b981" radius={[6, 6, 0, 0]} name="Arrivals (q)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-3.5 text-xs text-stone-600 border border-stone-200 mt-4 space-y-1.5">
            <div className="font-bold text-stone-900 flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-700" />
              <span>Arrival Trend Insight</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Akola and Washim arrivals remain controlled, supporting the stable price floor of ₹5,000 - ₹5,150/q.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
