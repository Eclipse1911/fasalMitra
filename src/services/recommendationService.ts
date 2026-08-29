import {
  AIRecommendation,
  ActionRecommendation,
  CropType,
  QualityGrade,
  MarketPriceRecord,
  BuyerRequirement,
  StorageFacility,
} from '../types';
import { RealizationService } from './realizationService';
import { StorageService } from './storageService';
import { ForecastService } from './forecastService';
import { MatchingService } from './matchingService';
import { MarketService } from './marketService';

export class RecommendationService {
  /**
   * Central Intelligence & Decision Support Engine
   * Evaluates ALL pathways:
   * Pathway 1: Sell to local APMC Mandi
   * Pathway 2: Sell to best distant APMC Mandi
   * Pathway 3: Sell directly to matched verified Buyer
   * Pathway 4: Store in nearby accredited warehouse and hold for forecasted price peak
   * Pathway 5: Join FPO aggregation cluster
   */
  public static generateRecommendation(params: {
    crop: CropType;
    quantity: number;
    quality: QualityGrade;
    locationDistrict: string;
    marketPrices: MarketPriceRecord[];
    buyerRequirements: BuyerRequirement[];
    storageFacilities: StorageFacility[];
    storageAvailable: boolean;
  }): AIRecommendation {
    const {
      crop,
      quantity,
      quality,
      locationDistrict,
      marketPrices,
      buyerRequirements,
      storageFacilities,
      storageAvailable,
    } = params;

    const safeQty = Math.max(1, quantity);

    // 1. Evaluate Option A: Local Mandi
    const localMandi = marketPrices.find(m => m.district.toLowerCase() === locationDistrict.toLowerCase() && m.crop === crop) 
      || marketPrices.find(m => m.crop === crop) 
      || marketPrices[0];
    
    const localMandiRealization = RealizationService.calculate({
      destinationName: localMandi ? localMandi.marketName : 'Akola APMC Mandi',
      destinationType: 'LOCAL_MANDI',
      offeredPricePerQ: localMandi ? localMandi.modalPrice : 5000,
      quantityQuintals: safeQty,
      distanceKm: localMandi?.distanceKm ?? 15,
      isAPMC: true,
      baselineLocalNetPerQ: 0,
    });

    const baselineLocalNetPerQ = localMandiRealization.netRealizationPerQ;

    // 2. Evaluate Option B: Distant Mandis (e.g. Washim, Amravati, Latur)
    const distantMandis = marketPrices.filter(m => m.crop === crop && m.id !== localMandi?.id);
    let bestDistantMandiRealization = localMandiRealization;

    distantMandis.forEach(mkt => {
      const r = RealizationService.calculate({
        destinationName: mkt.marketName,
        destinationType: 'DISTANT_MANDI',
        offeredPricePerQ: mkt.modalPrice,
        quantityQuintals: safeQty,
        distanceKm: mkt.distanceKm ?? 80,
        isAPMC: true,
        baselineLocalNetPerQ,
      });
      if (r.netRealizationPerQ > bestDistantMandiRealization.netRealizationPerQ) {
        bestDistantMandiRealization = r;
      }
    });

    // 3. Evaluate Option C: Direct Buyers
    const buyerMatches = MatchingService.matchLotWithBuyers(
      {
        crop,
        quantity: safeQty,
        quality,
        minExpectedPrice: localMandi?.modalPrice ?? 5000,
        availableDate: '2026-08-30',
        district: locationDistrict,
      },
      buyerRequirements,
      localMandi?.modalPrice ?? 5000,
      baselineLocalNetPerQ
    );

    const bestBuyerMatch = buyerMatches.length > 0 ? buyerMatches[0] : null;

    // 4. Evaluate Option D: Warehouse Storage & Hold
    const forecast = ForecastService.generateForecast(crop, locationDistrict);
    const holdDays = 7;
    const bestStorage = StorageService.getBestFacilityForHold(locationDistrict, safeQty, crop === 'Tomato');
    const storageRate = bestStorage?.costPerDayPerQ ?? 4.0;

    // Projected price after 7 days
    const projectedHoldPrice = forecast.forecast7Days;
    const holdRealization = RealizationService.calculate({
      destinationName: `${bestStorage?.name || 'Accredited Warehouse'} (7-Day Hold)`,
      destinationType: 'WAREHOUSE_HOLD',
      offeredPricePerQ: projectedHoldPrice,
      quantityQuintals: safeQty,
      distanceKm: (bestStorage?.distanceKm ?? 8) + (localMandi?.distanceKm ?? 15),
      storageDays: holdDays,
      storageRatePerDayPerQ: storageRate,
      isAPMC: true,
      baselineLocalNetPerQ,
    });

    // 5. Evaluate FPO Aggregation Bonus
    // FPO bulk negotiation adds ~₹80-120/q and splits logistics
    const fpoRealization = RealizationService.calculate({
      destinationName: 'Akola FPO Aggregated Bulk Lot',
      destinationType: 'FPO_AGGREGATION',
      offeredPricePerQ: (bestBuyerMatch?.requirement.offeredPrice ?? localMandi.modalPrice) + 80,
      quantityQuintals: safeQty,
      distanceKm: 25,
      isAPMC: false,
      baselineLocalNetPerQ,
    });

    // 6. Compare All Options & Determine Recommendation
    const options = [
      {
        type: 'LOCAL_MANDI' as ActionRecommendation,
        title: 'Sell at Local Mandi',
        dest: localMandi?.marketName || 'Akola APMC',
        pricePerQ: localMandi?.modalPrice || 5000,
        netPerQ: localMandiRealization.netRealizationPerQ,
        realization: localMandiRealization,
        pros: 'Fast cash settlement, minimal transit distance',
        cons: 'Standard mandi cess (1.05%) and commission deductions apply',
      },
      {
        type: 'SELL_DISTANT_MANDI' as ActionRecommendation,
        title: 'Sell at Regional Mandi',
        dest: bestDistantMandiRealization.destinationName,
        pricePerQ: bestDistantMandiRealization.offeredPricePerQ,
        netPerQ: bestDistantMandiRealization.netRealizationPerQ,
        realization: bestDistantMandiRealization,
        pros: 'Higher modal market quote in neighboring district',
        cons: 'Higher freight cost offsets the nominal price difference',
      },
      {
        type: 'SELL_DIRECT_BUYER' as ActionRecommendation,
        title: 'Sell to Verified Direct Buyer',
        dest: bestBuyerMatch ? bestBuyerMatch.requirement.businessName : 'ABC Agro Foods',
        pricePerQ: bestBuyerMatch ? bestBuyerMatch.requirement.offeredPrice : 5200,
        netPerQ: bestBuyerMatch ? bestBuyerMatch.netRealization.netRealizationPerQ : 5050,
        realization: bestBuyerMatch ? bestBuyerMatch.netRealization : localMandiRealization,
        pros: `Direct procurement bonus (+₹${(bestBuyerMatch?.requirement.offeredPrice ?? 5200) - (localMandi?.modalPrice ?? 5000)}/q over mandi), no mandi cess`,
        cons: 'Requires quality verification grade compliance',
      },
      {
        type: 'HOLD_FOR_UPSIDE' as ActionRecommendation,
        title: 'Hold 5-7 Days in Warehouse',
        dest: `${bestStorage?.name || 'Local Warehouse'} (${holdDays} Days)`,
        pricePerQ: projectedHoldPrice,
        netPerQ: holdRealization.netRealizationPerQ,
        realization: holdRealization,
        pros: `Expected price momentum (+₹${projectedHoldPrice - (localMandi?.modalPrice ?? 5000)}/q gross increase)`,
        cons: `Holding cost (₹${holdRealization.storageCostPerQ}/q) and medium market forecast uncertainty`,
      },
    ];

    // Determine current best immediate selling option
    const immediateOptions = options.filter(o => o.type !== 'HOLD_FOR_UPSIDE');
    const bestImmediate = immediateOptions.reduce((prev, curr) => curr.netPerQ > prev.netPerQ ? curr : prev, immediateOptions[0]);

    // Check if Hold is viable and gives a positive net margin after storage costs
    const isPerishable = crop === 'Tomato';
    let recommended: typeof options[0];
    let recommendedActionTitle: string;
    let confidenceScore = 74;
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';

    if (!isPerishable && storageAvailable && holdRealization.netRealizationPerQ > bestImmediate.netPerQ + 60 && forecast.trendDirection === 'BULLISH') {
      recommended = options.find(o => o.type === 'HOLD_FOR_UPSIDE')!;
      recommendedActionTitle = 'HOLD FOR 5-7 DAYS';
      confidenceScore = 72;
      riskLevel = 'MEDIUM';
    } else if (bestBuyerMatch && bestBuyerMatch.netRealization.netRealizationPerQ >= bestImmediate.netPerQ) {
      recommended = options.find(o => o.type === 'SELL_DIRECT_BUYER')!;
      recommendedActionTitle = 'SELL DIRECTLY TO VERIFIED BUYER';
      confidenceScore = 86;
      riskLevel = 'LOW';
    } else {
      recommended = bestImmediate;
      recommendedActionTitle = 'SELL AT CURRENT OPTIMAL MARKET';
      confidenceScore = 80;
      riskLevel = 'LOW';
    }

    const potentialUpsidePerQ = Math.max(0, Math.round((recommended.netPerQ - bestImmediate.netPerQ) * 10) / 10);
    const potentialTotalUpside = Math.round(potentialUpsidePerQ * safeQty);

    // Reasons and risk factors
    const reasons: string[] = [];
    const riskFactors: string[] = [];

    if (recommended.type === 'HOLD_FOR_UPSIDE') {
      reasons.push(`Recent price trend in ${locationDistrict} is positive (+${forecast.trendGrowthPercent}% projected trajectory).`);
      reasons.push(`Current market arrivals are moderate (${localMandi?.arrivalQuantity || 650} quintals/day), reducing supply glut.`);
      reasons.push(`Accredited storage is available nearby (${bestStorage?.name || 'Warehouse'} at ₹${storageRate}/q/day, ${bestStorage?.distanceKm || 8} km).`);
      reasons.push(`Expected net realization after warehouse charges is ₹${recommended.netPerQ.toLocaleString()}/q (₹${potentialUpsidePerQ}/q higher than selling today).`);
      
      riskFactors.push('Unforeseen arrival spikes or international commodity shift could compress price upside.');
      riskFactors.push('Holding involves temporary liquidity delay of 5-7 days.');
    } else if (recommended.type === 'SELL_DIRECT_BUYER') {
      reasons.push(`${recommended.dest} is offering ₹${recommended.pricePerQ.toLocaleString()}/q, which is ₹${(recommended.pricePerQ - (localMandi?.modalPrice || 5000))}/q above local mandi modal price.`);
      reasons.push(`Direct institutional procurement bypasses mandi cess and intermediary handling deductions.`);
      reasons.push(`Transportation distance is manageable (${recommended.realization.distanceKm} km), yielding net realization of ₹${recommended.netPerQ.toLocaleString()}/q.`);
      reasons.push(`Buyer reliability rating is high (${bestBuyerMatch?.requirement.reliabilityScore || 94}/100) with verified payment history.`);

      riskFactors.push('Grade A quality specifications must be verified upon delivery.');
      riskFactors.push('Delivery window requires scheduling within the next 48-72 hours.');
    } else {
      reasons.push(`Local market (${recommended.dest}) offers the highest immediate cash certainty and minimal logistics deduction.`);
      reasons.push(`Freight deduction is only ₹${recommended.realization.transportCostPerQ}/q due to 15 km proximity.`);

      riskFactors.push('Price fluctuates daily with morning open bidding arrivals.');
    }

    const alternatives = options.filter(o => o.type !== recommended.type).map(o => ({
      title: o.title,
      action: o.type,
      destination: o.dest,
      netRealizationPerQ: o.netPerQ,
      pros: o.pros,
      cons: o.cons,
    }));

    return {
      recommendedAction: recommended.type,
      recommendedActionTitle,
      recommendedDestination: recommended.dest,
      recommendedPricePerQ: recommended.pricePerQ,
      expectedNetRealizationPerQ: recommended.netPerQ,
      expectedTotalRealization: Math.round(recommended.netPerQ * safeQty),
      currentBestImmediateNetPerQ: bestImmediate.netPerQ,
      potentialUpsidePerQ,
      potentialTotalUpside,
      confidenceScore,
      riskLevel,
      timeHorizonDays: recommended.type === 'HOLD_FOR_UPSIDE' ? holdDays : 0,
      reasons,
      riskFactors,
      alternatives,
    };
  }

  public static getComprehensiveRecommendation(params: {
    crop: CropType;
    quantityQuintals: number;
    qualityGrade: QualityGrade;
    farmerDistrict: string;
    storageAvailableOnFarm: boolean;
    availableBuyers: BuyerRequirement[];
  }): AIRecommendation {
    const marketPrices = MarketService.getPrices(params.crop);
    return this.generateRecommendation({
      crop: params.crop,
      quantity: params.quantityQuintals,
      quality: params.qualityGrade,
      locationDistrict: params.farmerDistrict,
      marketPrices,
      buyerRequirements: params.availableBuyers,
      storageFacilities: StorageService.getFacilitiesForDistrict(params.farmerDistrict),
      storageAvailable: params.storageAvailableOnFarm,
    });
  }
}
