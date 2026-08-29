import React, { useState } from 'react';
import {
  X,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Scale,
  TrendingUp,
  Users,
  Calculator,
  BrainCircuit,
  Layers,
  ReceiptText,
} from 'lucide-react';
import { UserRole } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToStep: (stepNumber: number) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onJumpToStep,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Step 1: Login as Farmer Ramesh Patil',
      tab: 'dashboard',
      role: 'farmer' as UserRole,
      summary: 'Logged in as demo farmer Ramesh Patil from Murtizapur, Akola District.',
      detail: 'The dashboard greets Ramesh and loads his 8.5 acre farm profile with primary crop configuration.',
    },
    {
      step: 2,
      title: 'Step 2: Inspect Crop Lot (Soybean, 20 Quintals, Grade A)',
      tab: 'dashboard',
      role: 'farmer' as UserRole,
      summary: 'Farmer enters/views: Soybean, 20 quintals, Akola, Grade A purity, Storage available.',
      detail: 'The system computes potential harvest gross value of ₹1,02,600 and initiates regional intelligence scanning.',
    },
    {
      step: 3,
      title: 'Step 3: Open Market Intelligence (Mandi Price Comparison)',
      tab: 'market_intelligence',
      role: 'farmer' as UserRole,
      summary: 'Compares spot prices: Akola Mandi (₹5,000/q), Washim Mandi (₹5,150/q), Amravati Mandi (₹5,080/q).',
      detail: 'Crucial insight: Washim quotes +₹150/q higher, but 65 km freight deduction brings its net to ₹4,900/q vs Akola ₹4,850/q.',
    },
    {
      step: 4,
      title: 'Step 4: Open Find Buyers (Direct Procurement Marketplace)',
      tab: 'find_buyers',
      role: 'farmer' as UserRole,
      summary: 'Discovers verified buyer ABC Agro Foods offering ₹5,200/q with a 94% algorithmic match score.',
      detail: '7-factor weighted scoring validates crop compatibility, quantity fit, Grade A compliance, and high reliability (94/100).',
    },
    {
      step: 5,
      title: 'Step 5: Calculate Net Realization (True Take-Home Comparison)',
      tab: 'net_realization',
      role: 'farmer' as UserRole,
      summary: 'Compares net take-home: Akola Mandi (₹4,850/q net) vs Washim (₹4,900/q net) vs ABC Agro (₹5,050/q net).',
      detail: 'Demonstrates the core formula: Gross Value - Freight - Storage - Cess. Direct buyer gives +₹4,000 total net gain for 20 quintals.',
    },
    {
      step: 6,
      title: 'Step 6: Sell Now vs. Warehouse Hold Analysis',
      tab: 'sell_vs_hold',
      role: 'farmer' as UserRole,
      summary: 'Compares Sell Today (₹5,050/q net) vs Hold 5-7 Days in WDRA Warehouse (₹5,150/q expected net).',
      detail: 'Statistical EWMA model projects price peak to ₹5,350/q. Subtracting ₹4/q/day warehouse fees yields +₹6,000 upside over spot mandi.',
    },
    {
      step: 7,
      title: 'Step 7: AI Structured Recommendation & Explainability',
      tab: 'sell_vs_hold',
      role: 'farmer' as UserRole,
      summary: 'AI Engine outputs: "RECOMMENDED ACTION: HOLD FOR 5-7 DAYS (72% Confidence, Medium Risk)".',
      detail: 'Transparent bullet points explain positive regional momentum, moderate arrival pressure, and nearby storage availability.',
    },
    {
      step: 8,
      title: 'Step 8: Inspect Institutional Buyer Demand (100 Quintals)',
      tab: 'find_buyers',
      role: 'farmer' as UserRole,
      summary: 'ABC Agro Foods requires 100 quintals of Grade A Soybean for solvent processing.',
      detail: 'A single smallholder farmer cannot fulfill 100 quintals alone, triggering the FPO Collective Aggregation pathway.',
    },
    {
      step: 9,
      title: 'Step 9: FPO Aggregation Engine (Collective Pooling)',
      tab: 'fpo_aggregation',
      role: 'fpo' as UserRole,
      summary: 'Pools 5 member farmers: Ramesh (20q) + Ganesh (15q) + Vitthal (30q) + Sunil (25q) + Dnyaneshwar (10q) = 100q!',
      detail: 'FPO executes bulk contract at ₹5,200/q, providing each farmer ₹5,120/q net payout with shared logistics and ₹80/q FPO facilitation margin.',
    },
    {
      step: 10,
      title: 'Step 10: Create Digital Contract & Transaction Slip',
      tab: 'transactions',
      role: 'farmer' as UserRole,
      summary: 'Generates Transaction #TX-2026-1024 for ₹1,04,000 with logistics vehicle allocation.',
      detail: 'Locked price terms, zero APMC middleman cess, and simulated Direct Benefit Transfer (DBT) escrow tracking.',
    },
    {
      step: 11,
      title: 'Step 11: Transaction Lifecycle Progression',
      tab: 'transactions',
      role: 'farmer' as UserRole,
      summary: 'Advances through 6 stages: Lot Created → Matched → Accepted → Dispatched → Delivered → Paid.',
      detail: 'Interactive simulation demonstrates instantaneous payment settlement status and audit trail.',
    },
  ];

  const current = demoSteps[currentStep - 1];

  const handleExecuteCurrentStep = () => {
    onJumpToStep(currentStep);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Guided Demonstration Script
              </span>
              <h3 className="text-base font-black text-stone-900">
                SIH 2026 11-Step Evaluation Scenario
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="my-4">
          <div className="flex justify-between text-xs text-stone-500 font-bold mb-1.5">
            <span>Step {currentStep} of 11</span>
            <span className="text-emerald-700">{Math.round((currentStep / 11) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 11) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step Card */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
              {current.title}
            </span>
            <span className="text-xs text-stone-400 font-medium">Target Tab: {current.tab}</span>
          </div>

          <p className="text-sm font-bold text-stone-900 leading-snug">
            {current.summary}
          </p>

          <p className="text-xs text-stone-600 leading-relaxed bg-white p-3 rounded-lg border border-stone-200">
            {current.detail}
          </p>
        </div>

        {/* Action Button: Jump & Execute */}
        <div className="my-4">
          <button
            id="btn-execute-demo-step"
            onClick={handleExecuteCurrentStep}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer"
          >
            <span>Open & View This Step in Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <div className="flex space-x-1">
            {demoSteps.map((s) => (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center cursor-pointer ${
                  currentStep === s.step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {s.step}
              </button>
            ))}
          </div>

          <button
            disabled={currentStep === 11}
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white disabled:opacity-30 disabled:cursor-not-allowed font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
