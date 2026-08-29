import React, { useState } from 'react';
import {
  ReceiptText,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Building2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { TransactionRecord } from '../types';
import { TransactionService } from '../services/transactionService';

interface TransactionTrackerProps {
  transactions: TransactionRecord[];
  onAdvanceStep: (id: string) => void;
}

export const TransactionTracker: React.FC<TransactionTrackerProps> = ({
  transactions,
  onAdvanceStep,
}) => {
  const [selectedTxId, setSelectedTxId] = useState<string>(transactions[0]?.id || '');
  const selectedTx = transactions.find(t => t.id === selectedTxId) || transactions[0];

  const steps = [
    { title: 'Lot Created', desc: 'Farmer created produce lot' },
    { title: 'Buyer Matched', desc: 'AI matching algorithm paired requirement' },
    { title: 'Offer Accepted', desc: 'Terms & price agreement locked' },
    { title: 'Produce Dispatched', desc: 'Logistics vehicle loaded & in transit' },
    { title: 'Delivered', desc: 'Quality verified at receiving bay' },
    { title: 'Payment Settled', desc: 'Simulated direct DBT bank transfer' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <ReceiptText className="w-4 h-4" />
              <span>Direct Settlement & Logistics Escrow</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Transaction Lifecycle Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time audit trail of produce dispatch, quality weighment, and simulated settlement payments.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-amber-50 px-3.5 py-2.5 rounded-2xl border border-amber-200 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Simulated Banking:</strong> Demonstrating DBT escrow & digital contract state machines.</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Transaction List (Left) + Detail & Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Active Transactions List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h2 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Active Contracts ({transactions.length})</span>
            <span className="text-xs text-slate-400">Select to View</span>
          </h2>

          <div className="space-y-2.5">
            {transactions.map((tx) => {
              const isSelected = tx.id === selectedTx?.id;
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTxId(tx.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{tx.transactionNumber}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      tx.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      tx.paymentStatus === 'Processing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800">{tx.businessName}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>{tx.quantityQuintals} q {tx.crop}</span>
                    <span className="font-bold text-indigo-700">₹{tx.netRealization.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Selected Transaction Interactive Timeline */}
        {selectedTx && (
          <div className="lg:col-span-8 space-y-5">
            
            {/* Timeline Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Transaction ID</span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedTx.transactionNumber}</h3>
                  <p className="text-xs text-slate-500">Tracking: {selectedTx.trackingNumber}</p>
                </div>

                {/* Advance Step Action Button for Demonstration */}
                {selectedTx.stepIndex < 5 ? (
                  <button
                    id="btn-advance-tx-step"
                    onClick={() => onAdvanceStep(selectedTx.id)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Advance Stage ({steps[selectedTx.stepIndex + 1]?.title})</span>
                  </button>
                ) : (
                  <span className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Transaction Fully Settled & Completed</span>
                  </span>
                )}
              </div>

              {/* Stepper Timeline Diagram */}
              <div className="my-6">
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= selectedTx.stepIndex;
                    const isCurrent = idx === selectedTx.stepIndex;

                    return (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition mb-2 ${
                            isCurrent
                              ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                              : isCompleted
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {isCompleted && !isCurrent ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span className={`text-[11px] font-semibold ${
                          isCurrent ? 'text-amber-800 font-bold' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Agreed Rate</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ₹{selectedTx.agreedPricePerQ.toLocaleString()}/q
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Gross Invoice</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ₹{selectedTx.grossValue.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Logistics Freight</span>
                  <span className="font-semibold text-rose-600 text-sm">
                    -₹{selectedTx.transportCost.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Net Payout to Farmer</span>
                  <span className="font-bold text-indigo-700 text-sm">
                    ₹{selectedTx.netRealization.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Settlement Status Card */}
              <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Payment Status: <span className="uppercase text-indigo-700">{selectedTx.paymentStatus}</span>
                  </span>
                  <span className="text-slate-500">{selectedTx.settlementDateEstimate}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last updated: {new Date(selectedTx.updatedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
