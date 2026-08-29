import React, { useState, useMemo, useEffect } from 'react';
import {
  UserRole,
  NavigationTab,
  Language,
  FarmerProduceLot,
  CropType,
  QualityGrade,
  BuyerMatchItem,
  TransactionRecord,
  FPOAggregationCluster,
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { MarketIntelligence } from './components/MarketIntelligence';
import { NetRealizationCalculator } from './components/NetRealizationCalculator';
import { BuyerMarketplace } from './components/BuyerMarketplace';
import { SellVsHoldAnalysis } from './components/SellVsHoldAnalysis';
import { FpoAggregationView } from './components/FpoAggregationView';
import { TransactionTracker } from './components/TransactionTracker';
import { InteractiveMap } from './components/InteractiveMap';
import { AdminDashboard } from './components/AdminDashboard';
import { MyProduceView } from './components/MyProduceView';
import { AboutProjectModal } from './components/AboutProjectModal';
import { DemoTourModal } from './components/DemoTourModal';
import { AIChatAdvisor } from './components/AIChatAdvisor';

import {
  DEMO_FARMER_RAMESH,
  SAMPLE_BUYER_REQUIREMENTS,
  SAMPLE_STORAGE_FACILITIES,
  MAHARASHTRA_CROPS,
} from './data/sampleData';
import { MarketService } from './services/marketService';
import { MatchingService } from './services/matchingService';
import { RecommendationService } from './services/recommendationService';
import { TransactionService } from './services/transactionService';

export default function App() {
  // Global Application States
  const [currentRole, setCurrentRole] = useState<UserRole>('farmer');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Modals
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);

  useEffect(() => {
    const syncLanguage = () => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        if (currentLanguage === 'en') {
          // Attempt to reset to English
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
          if (select.value !== 'en' && select.value !== '') {
            select.value = 'en';
            select.dispatchEvent(new Event('change'));
          }
        } else {
          if (select.value !== currentLanguage) {
            select.value = currentLanguage;
            select.dispatchEvent(new Event('change'));
          }
        }
      }
    };

    // Retry a few times in case the script is still loading
    syncLanguage();
    const interval = setInterval(syncLanguage, 1000);
    return () => clearInterval(interval);
  }, [currentLanguage]);

  // Active Produce Lot and Farmer State
  const [produceLots, setProduceLots] = useState<FarmerProduceLot[]>([
    {
      id: 'lot_soybean_01',
      farmerId: 'farmer_01',
      farmerName: 'Ramesh Patil',
      crop: 'Soybean',
      quantityQuintals: 20,
      qualityGrade: 'Grade A',
      moisturePercentage: 9.5,
      district: 'Akola',
      taluka: 'Murtizapur',
      harvestDate: '2026-10-18',
      targetPrice: 5300,
      storageAvailable: true,
      status: 'Available',
      createdAt: '2026-10-18',
    },
    {
      id: 'lot_cotton_02',
      farmerId: 'farmer_01',
      farmerName: 'Ramesh Patil',
      crop: 'Cotton',
      quantityQuintals: 15,
      qualityGrade: 'Grade A',
      moisturePercentage: 7.8,
      district: 'Akola',
      taluka: 'Murtizapur',
      harvestDate: '2026-10-10',
      targetPrice: 7500,
      storageAvailable: true,
      status: 'Available',
      createdAt: '2026-10-10',
    },
  ]);

  const [activeLotId, setActiveLotId] = useState<string>('lot_soybean_01');
  const activeLot = produceLots.find((l) => l.id === activeLotId) || produceLots[0];

  // Dynamic Market & AI Data derived from active lot
  const marketPrices = useMemo(() => {
    return MarketService.getMarketPricesForCrop(activeLot.crop);
  }, [activeLot.crop]);

  const matchedBuyers = useMemo(() => {
    return MatchingService.findMatches(
      activeLot.crop,
      activeLot.quantityQuintals,
      activeLot.qualityGrade,
      activeLot.district,
      activeLot.targetPrice || 5000,
      SAMPLE_BUYER_REQUIREMENTS
    );
  }, [activeLot]);

  const recommendation = useMemo(() => {
    return RecommendationService.getComprehensiveRecommendation({
      crop: activeLot.crop,
      quantityQuintals: activeLot.quantityQuintals,
      qualityGrade: activeLot.qualityGrade,
      farmerDistrict: activeLot.district,
      storageAvailableOnFarm: activeLot.storageAvailable,
      availableBuyers: SAMPLE_BUYER_REQUIREMENTS,
    });
  }, [activeLot]);

  // Transaction Ledger State
  const [transactions, setTransactions] = useState<TransactionRecord[]>(
    TransactionService.getTransactionsForFarmer('farmer_01')
  );

  // Handlers
  const handleAddProduceLot = (newLotData: Omit<FarmerProduceLot, 'id' | 'createdAt'>) => {
    const newLot: FarmerProduceLot = {
      ...newLotData,
      id: `lot_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProduceLots((prev) => [newLot, ...prev]);
    setActiveLotId(newLot.id);
    setActiveTab('dashboard');
  };

  const handleSelectLotToAnalyze = (lot: FarmerProduceLot) => {
    setActiveLotId(lot.id);
    setActiveTab('dashboard');
  };

  const handleAdvanceTransaction = (id: string) => {
    const updated = TransactionService.advanceStep(id);
    if (updated) {
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  const handleCreateDirectDeal = (match: BuyerMatchItem) => {
    const tx = TransactionService.createTransactionFromMatch(
      match,
      activeLot.farmerId,
      activeLot.farmerName,
      activeLot.quantityQuintals
    );
    setTransactions((prev) => [tx, ...prev]);
    setActiveTab('transactions');
  };

  const handleAcceptOptionFromAnalysis = (
    optionType: string,
    dest: string,
    price: number,
    net: number
  ) => {
    const tx = TransactionService.createTransaction({
      farmerId: activeLot.farmerId,
      farmerName: activeLot.farmerName,
      buyerId: 'buyer_abc',
      businessName: dest,
      crop: activeLot.crop,
      quantityQuintals: activeLot.quantityQuintals,
      qualityGrade: activeLot.qualityGrade,
      agreedPricePerQ: price,
      transportCost: Math.round(activeLot.quantityQuintals * 140),
      netRealization: Math.round(net * activeLot.quantityQuintals),
      deliveryLocation: dest,
      status: 'Offer Accepted',
      paymentStatus: 'Processing',
      settlementDateEstimate: '2 Business Days via Direct DBT',
    });
    setTransactions((prev) => [tx, ...prev]);
    setActiveTab('transactions');
  };

  const handleCommitFpoCluster = (cluster: FPOAggregationCluster) => {
    const tx = TransactionService.createTransaction({
      farmerId: activeLot.farmerId,
      farmerName: `${activeLot.farmerName} (via Akola FPO)`,
      buyerId: cluster.targetBuyerRequirement.id,
      businessName: cluster.targetBuyerRequirement.businessName,
      crop: cluster.targetBuyerRequirement.crop,
      quantityQuintals: activeLot.quantityQuintals,
      qualityGrade: activeLot.qualityGrade,
      agreedPricePerQ: cluster.targetBuyerRequirement.offeredPrice,
      transportCost: 0,
      netRealization: activeLot.quantityQuintals * 5120,
      deliveryLocation: cluster.targetBuyerRequirement.location,
      status: 'Produce Dispatched',
      paymentStatus: 'Processing',
      settlementDateEstimate: '1 Business Day via FPO Escrow',
    });
    setTransactions((prev) => [tx, ...prev]);
  };

  // Demo Tour Step Execution
  const handleExecuteDemoStep = (stepNumber: number) => {
    setIsDemoTourOpen(false);

    switch (stepNumber) {
      case 1:
        setCurrentRole('farmer');
        setActiveTab('dashboard');
        break;
      case 2:
        setCurrentRole('farmer');
        setActiveLotId('lot_soybean_01');
        setActiveTab('dashboard');
        break;
      case 3:
        setActiveTab('market_intelligence');
        break;
      case 4:
        setActiveTab('find_buyers');
        break;
      case 5:
        setActiveTab('net_realization');
        break;
      case 6:
      case 7:
        setActiveTab('sell_vs_hold');
        break;
      case 8:
        setActiveTab('find_buyers');
        break;
      case 9:
        setCurrentRole('fpo');
        setActiveTab('fpo_aggregation');
        break;
      case 10:
      case 11:
        setCurrentRole('farmer');
        setActiveTab('transactions');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Universal Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(r) => setCurrentRole(r)}
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        currentLanguage={currentLanguage}
        onLanguageChange={(l) => setCurrentLanguage(l)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        unreadNotificationCount={3}
      />

      {/* Main App Layout: Sidebar (Left) + View Content (Right) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Sticky Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t)}
          userRole={currentRole}
          activeCrop={activeLot.crop}
          activeQuantity={activeLot.quantityQuintals}
          onOpenDemoTour={() => setIsDemoTourOpen(true)}
          onOpenAboutModal={() => setIsAboutModalOpen(true)}
        />

        {/* Dynamic Main Workspace Router */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: Farmer Overview Dashboard */}
          {activeTab === 'dashboard' && (
            <FarmerDashboard
              farmerName={DEMO_FARMER_RAMESH.name}
              district={activeLot.district}
              crop={activeLot.crop}
              quantity={activeLot.quantityQuintals}
              quality={activeLot.qualityGrade}
              recommendation={recommendation}
              marketPrices={marketPrices}
              matchedBuyers={matchedBuyers}
              onNavigateTab={(t) => setActiveTab(t)}
              onOpenDemoTour={() => setIsDemoTourOpen(true)}
            />
          )}

          {/* TAB 2: My Produce Lots */}
          {activeTab === 'my_produce' && (
            <MyProduceView
              lots={produceLots}
              onAddLot={handleAddProduceLot}
              onSelectLotToAnalyze={handleSelectLotToAnalyze}
            />
          )}

          {/* TAB 3: Market Intelligence & Price Comparison */}
          {activeTab === 'market_intelligence' && (
            <MarketIntelligence
              currentCrop={activeLot.crop}
              farmerDistrict={activeLot.district}
              farmerQuantity={activeLot.quantityQuintals}
              marketPrices={marketPrices}
              onNavigateTab={(t) => setActiveTab(t)}
            />
          )}

          {/* TAB 4: Find Buyers / Procurement Marketplace */}
          {activeTab === 'find_buyers' && (
            <BuyerMarketplace
              currentCrop={activeLot.crop}
              farmerQuantity={activeLot.quantityQuintals}
              farmerQuality={activeLot.qualityGrade}
              farmerDistrict={activeLot.district}
              matchedBuyers={matchedBuyers}
              allRequirements={SAMPLE_BUYER_REQUIREMENTS}
              onSelectBuyerForDeal={handleCreateDirectDeal}
              onNavigateTab={(t) => setActiveTab(t)}
              userRole={currentRole}
            />
          )}

          {/* TAB 5: Net Realization Calculator */}
          {activeTab === 'net_realization' && (
            <NetRealizationCalculator
              initialPrice={5200}
              initialQuantity={activeLot.quantityQuintals}
              initialCrop={activeLot.crop}
              initialDistrict={activeLot.district}
            />
          )}

          {/* TAB 6: Sell vs Hold Temporal Intelligence */}
          {activeTab === 'sell_vs_hold' && (
            <SellVsHoldAnalysis
              crop={activeLot.crop}
              quantity={activeLot.quantityQuintals}
              quality={activeLot.qualityGrade}
              district={activeLot.district}
              storageAvailable={activeLot.storageAvailable}
              recommendation={recommendation}
              storageFacilities={SAMPLE_STORAGE_FACILITIES}
              marketPrices={marketPrices}
              onAcceptOption={handleAcceptOptionFromAnalysis}
            />
          )}

          {/* TAB 7: FPO Collective Aggregation */}
          {activeTab === 'fpo_aggregation' && (
            <FpoAggregationView
              onCommitAggregation={handleCommitFpoCluster}
            />
          )}

          {/* TAB 8: Transaction Tracker & Escrow */}
          {activeTab === 'transactions' && (
            <TransactionTracker
              transactions={transactions}
              onAdvanceStep={handleAdvanceTransaction}
            />
          )}

          {/* TAB 9: Spatial Map */}
          {activeTab === 'interactive_map' && (
            <InteractiveMap
              currentCrop={activeLot.crop}
              farmerDistrict={activeLot.district}
              farmerQuantity={activeLot.quantityQuintals}
            />
          )}

          {/* TAB 10: Admin / Macro State Analytics */}
          {activeTab === 'admin_analytics' && (
            <AdminDashboard />
          )}

        </main>
      </div>

      {/* Global Modals */}
      <AboutProjectModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onJumpToStep={handleExecuteDemoStep}
      />

      {/* AI Chat Advisor — Floating over all views */}
      <AIChatAdvisor
        crop={activeLot.crop}
        quantity={activeLot.quantityQuintals}
        district={activeLot.district}
        currentPrice={marketPrices.find(m => m.district === activeLot.district && m.crop === activeLot.crop)?.modalPrice || 5000}
        recommendation={recommendation}
        language={currentLanguage}
      />

      {/* Persistent Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-8 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900">FasalMitr AI</span>
            <span>•</span>
            <span>SIH 2026 Problem Statement #26132</span>
            <span>•</span>
            <span className="text-indigo-600 font-semibold">Agricultural Price Discovery Engine</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="hover:text-indigo-600 font-semibold transition cursor-pointer"
            >
              Project Architecture & Vision
            </button>
            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="hover:text-indigo-600 font-semibold transition cursor-pointer"
            >
              11-Step Evaluation Script
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
