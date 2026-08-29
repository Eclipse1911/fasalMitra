import React, { useState } from 'react';
import {
  Package,
  Plus,
  TrendingUp,
  Scale,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';
import { FarmerProduceLot, CropType, QualityGrade } from '../types';
import { MAHARASHTRA_CROPS } from '../data/sampleData';

interface MyProduceViewProps {
  lots: FarmerProduceLot[];
  onAddLot: (lot: Omit<FarmerProduceLot, 'id' | 'createdAt'>) => void;
  onSelectLotToAnalyze: (lot: FarmerProduceLot) => void;
}

export const MyProduceView: React.FC<MyProduceViewProps> = ({
  lots,
  onAddLot,
  onSelectLotToAnalyze,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New lot form states
  const [crop, setCrop] = useState<CropType>('Soybean');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(20);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A');
  const [moisturePercentage, setMoisturePercentage] = useState<number>(9.5);
  const [district, setDistrict] = useState<string>('Akola');
  const [taluka, setTaluka] = useState<string>('Murtizapur');
  const [targetPrice, setTargetPrice] = useState<number>(5300);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLot({
      farmerId: 'farmer_01',
      farmerName: 'Ramesh Patil',
      crop,
      quantityQuintals,
      qualityGrade,
      moisturePercentage,
      district,
      taluka,
      harvestDate,
      targetPrice,
      storageAvailable,
      status: 'Available',
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Package className="w-4 h-4" />
              <span>Digital Harvest Inventory</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              My Produce Lots
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Register and track your harvested produce lots to receive real-time algorithmic buyer matches and price alerts.
            </p>
          </div>

          <button
            id="btn-register-lot-open"
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center space-x-1.5 transition shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Produce Lot</span>
          </button>
        </div>
      </div>

      {/* Produce Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lots.map((lot) => {
          const estimatedValue = lot.quantityQuintals * (lot.targetPrice || 5000);

          return (
            <div
              key={lot.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                      {lot.qualityGrade}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 mt-1.5">{lot.crop}</h3>
                    <span className="text-xs text-slate-500">{lot.taluka}, {lot.district}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    lot.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    lot.status === 'Matched' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {lot.status}
                  </span>
                </div>

                {/* Specs */}
                <div className="my-4 grid grid-cols-2 gap-2.5 bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Quantity</span>
                    <span className="font-bold text-slate-900 text-sm">{lot.quantityQuintals} Quintals</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Moisture</span>
                    <span className="font-bold text-slate-900 text-sm">{lot.moisturePercentage}%</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Target Price</span>
                    <span className="font-bold text-slate-900 text-sm">₹{lot.targetPrice?.toLocaleString()}/q</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Est. Lot Value</span>
                    <span className="font-bold text-indigo-700 text-sm">₹{estimatedValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Harvested on {new Date(lot.harvestDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  id={`btn-analyze-lot-${lot.id}`}
                  onClick={() => onSelectLotToAnalyze(lot)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Run Realization & Match Buyers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Produce Lot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Register New Harvest Lot</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="my-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crop Commodity</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value as CropType)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                >
                  {MAHARASHTRA_CROPS.map((c) => (
                    <option key={c.name} value={c.name}>{c.name} ({c.marathiName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={quantityQuintals}
                    onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2 font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assayed Quality Grade</label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                    className="w-full rounded-xl border border-slate-200 p-2 font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="Grade A">Grade A (High Purity)</option>
                    <option value="Grade B">Grade B (Standard Fair)</option>
                    <option value="Grade C">Grade C (Commercial)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Moisture Level (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="25"
                    value={moisturePercentage}
                    onChange={(e) => setMoisturePercentage(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2 font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Price (₹/q)</label>
                  <input
                    type="number"
                    step="50"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2 font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Taluka / Village</label>
                  <input
                    type="text"
                    value={taluka}
                    onChange={(e) => setTaluka(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="font-medium text-slate-700">Storage Facility Available on Farm?</span>
                <input
                  type="checkbox"
                  checked={storageAvailable}
                  onChange={(e) => setStorageAvailable(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition cursor-pointer"
                >
                  Save & Register Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
