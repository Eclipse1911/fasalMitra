import { NetRealizationBreakdown } from '../types';
import { LogisticsService } from './logisticsService';
import { StorageService } from './storageService';

export class RealizationService {
  /**
   * Calculate exact net realization for any destination (Mandi, Direct Buyer, FPO, or Storage Hold)
   */
  public static calculate(params: {
    destinationName: string;
    destinationType: 'LOCAL_MANDI' | 'DISTANT_MANDI' | 'DIRECT_BUYER' | 'FPO_AGGREGATION' | 'WAREHOUSE_HOLD';
    offeredPricePerQ: number;
    quantityQuintals: number;
    distanceKm: number;
    storageDays?: number;
    storageRatePerDayPerQ?: number;
    isAPMC?: boolean;
    marketCessPercent?: number;
    handlingChargesPerQ?: number;
    baselineLocalNetPerQ?: number;
  }): NetRealizationBreakdown {
    const {
      destinationName,
      destinationType,
      offeredPricePerQ,
      quantityQuintals,
      distanceKm,
      storageDays = 0,
      storageRatePerDayPerQ = 4.0,
      isAPMC = destinationType.includes('MANDI'),
      marketCessPercent = 1.05,
      handlingChargesPerQ = 25,
      baselineLocalNetPerQ = 0,
    } = params;

    const safeQty = Math.max(1, quantityQuintals);
    const grossValue = Math.round(offeredPricePerQ * safeQty);

    // 1. Transportation cost calculation
    const logEst = LogisticsService.calculateEstimate('Farmer Farm', destinationName, distanceKm, safeQty);
    const transportCost = logEst.totalTransportCost;
    const transportCostPerQ = logEst.costPerQuintal;

    // 2. Storage cost calculation
    let storageCost = 0;
    let storageCostPerQ = 0;
    if (storageDays > 0) {
      const sCalc = StorageService.calculateStorageCost(safeQty, storageDays, storageRatePerDayPerQ);
      storageCost = sCalc.totalCost;
      storageCostPerQ = sCalc.costPerQuintal;
    }

    // 3. APMC Cess / Weighment / Hamali (loading/unloading)
    let mandiCessAndHandling = 0;
    if (isAPMC) {
      const cess = Math.round(grossValue * (marketCessPercent / 100));
      const handling = Math.round(safeQty * handlingChargesPerQ);
      mandiCessAndHandling = cess + handling;
    } else {
      // Direct buyers usually absorb or share handling charges
      mandiCessAndHandling = Math.round(safeQty * 10); // nominal weighment fee
    }

    // 4. Net Realization
    const netRealizationTotal = grossValue - transportCost - storageCost - mandiCessAndHandling;
    const netRealizationPerQ = Math.round((netRealizationTotal / safeQty) * 10) / 10;

    // 5. Comparison against baseline
    const gainVsLocalMandiPerQ = baselineLocalNetPerQ > 0 ? Math.round((netRealizationPerQ - baselineLocalNetPerQ) * 10) / 10 : 0;
    const gainVsLocalMandiTotal = Math.round(gainVsLocalMandiPerQ * safeQty);

    return {
      destinationName,
      destinationType,
      offeredPricePerQ,
      quantityQuintals: safeQty,
      grossValue,
      distanceKm: logEst.distanceKm,
      transportCost,
      transportCostPerQ,
      storageCost,
      storageCostPerQ,
      mandiCessAndHandling,
      netRealizationTotal,
      netRealizationPerQ,
      gainVsLocalMandiPerQ,
      gainVsLocalMandiTotal,
    };
  }
}
