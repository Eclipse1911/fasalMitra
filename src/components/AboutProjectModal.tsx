import React from 'react';
import {
  X,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface AboutProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                FasalMitr Platform (फसलमित्र)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                FasalMitr
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                From Market Information to Better Selling Decisions for Indian Farmers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="my-6 space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
          
          {/* Section 1: The Problem & Vision */}
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 mb-2">
              1. The Core Agricultural Problem
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Most existing agritech platforms simply display raw mandi rates. However, a higher nominal price in a distant mandi often results in a <strong>lower net profit</strong> once road freight, handling, and mandi cess are subtracted. Smallholder farmers lack real-time decision support on <strong>WHERE, WHEN, and TO WHOM</strong> to sell their harvest.
            </p>
          </div>

          {/* Section 2: Our Mathematical Innovation */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <h3 className="text-sm font-bold text-emerald-950 mb-1 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>2. The Net Realization Innovation</span>
            </h3>
            <div className="my-2 p-2.5 bg-white rounded-lg border border-emerald-300 font-mono text-xs font-bold text-emerald-900 text-center">
              Net Realization = Selling Price - Transportation - Storage Fees - APMC Mandi Cess
            </div>
            <p className="text-xs text-emerald-900">
              FasalMitr synthesizes 5 critical data layers: Live Mandi Prices + Verified Buyer Procurement + Road Logistics Freight + WDRA Storage Rates + Statistical Price Forecasts to recommend the optimal selling pathway with transparent mathematical explainability.
            </p>
          </div>

          {/* Section 3: Future Production Integration Pipeline */}
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 mb-2">
              3. Future Production Architecture & Government Integrations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">e-NAM & Agmarknet</span>
                <span className="text-stone-600">Direct authorized API ingestion of live spot bidding and daily commodity arrivals from 1,000+ national APMC yards.</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">ULIP (Logistics Platform)</span>
                <span className="text-stone-600">Real-time freight rate aggregation and truck dispatch via Unified Logistics Interface Platform.</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">WDRA Digital Godowns</span>
                <span className="text-stone-600">Automated Electronic Negotiable Warehouse Receipt (e-NWR) integration for pledge financing and safe storage.</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">Supabase / PostgreSQL Cloud DB</span>
                <span className="text-stone-600">Enterprise relational persistence with Row-Level Security (RLS) and cryptographic farmer KYC verification.</span>
              </div>
            </div>
          </div>

          {/* Section 4: Data Disclaimer */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center space-x-1.5 text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>MVP Simulation Disclaimer</span>
            </div>
            <p className="leading-relaxed">
              This prototype utilizes realistic synthetic datasets tailored specifically for Maharashtra agricultural corridors (Akola, Washim, Amravati, Nashik, Pune). All calculations (Net Realization, 7-Factor Buyer Matching, Statistical Forecasting) are executed deterministically without hardcoded or faked values.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Close & Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
