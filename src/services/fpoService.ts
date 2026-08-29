import { FPOAggregationCluster, BuyerRequirement, FarmerLot } from '../types';
import { DEMO_BUYER_ABC, DEMO_FPO_AKOLA } from '../data/sampleData';

export class FPOService {
  private static clusters: FPOAggregationCluster[] = [];

  public static generateDefaultCluster(): FPOAggregationCluster {
    const targetRequirement: BuyerRequirement = {
      id: 'req_soybean_abc',
      buyerId: 'buyer_abc_agro',
      buyerName: 'Anand Kulkarni',
      businessName: 'ABC Agro Foods Pvt Ltd',
      location: 'MIDC Phase 1, Akola',
      district: 'Akola',
      crop: 'Soybean',
      requiredQuantity: 100, // 100 quintals required
      fulfilledQuantity: 0,
      qualityRequired: 'Grade A',
      offeredPrice: 5200, // ₹5,200/q
      requiredDate: '2026-09-08',
      verificationStatus: 'Verified',
      reliabilityScore: 94,
      distanceKm: 35,
      status: 'Open',
      createdAt: '2026-08-28T09:30:00Z',
    };

    const contributingFarmers = [
      {
        farmerId: 'user_ramesh_patil',
        farmerName: 'Ramesh Patil',
        lotId: 'lot_ramesh_soybean_01',
        quantity: 20,
        quality: 'Grade A' as const,
        payoutRatePerQ: 5120, // Net payout after ₹80 FPO service fee
        estimatedPayout: 20 * 5120,
      },
      {
        farmerId: 'farmer_ganesh_wankhede',
        farmerName: 'Ganesh Wankhede',
        lotId: 'lot_ganesh_soybean',
        quantity: 15,
        quality: 'Grade A' as const,
        payoutRatePerQ: 5120,
        estimatedPayout: 15 * 5120,
      },
      {
        farmerId: 'farmer_vitthal_ghatole',
        farmerName: 'Vitthal Ghatole',
        lotId: 'lot_vitthal_soybean',
        quantity: 30,
        quality: 'Grade A' as const,
        payoutRatePerQ: 5120,
        estimatedPayout: 30 * 5120,
      },
      {
        farmerId: 'farmer_sunil_baviskar',
        farmerName: 'Sunil Baviskar',
        lotId: 'lot_sunil_soybean',
        quantity: 25,
        quality: 'Grade A' as const,
        payoutRatePerQ: 5120,
        estimatedPayout: 25 * 5120,
      },
      {
        farmerId: 'farmer_dnyaneshwar_kute',
        farmerName: 'Dnyaneshwar Kute',
        lotId: 'lot_dnyaneshwar_soybean',
        quantity: 10,
        quality: 'Grade A' as const,
        payoutRatePerQ: 5120,
        estimatedPayout: 10 * 5120,
      },
    ];

    const allocatedQuantity = contributingFarmers.reduce((sum, f) => sum + f.quantity, 0);

    return {
      id: 'cluster_fpo_akola_soybean_100q',
      fpoId: DEMO_FPO_AKOLA.id,
      fpoName: DEMO_FPO_AKOLA.fpoName,
      targetBuyerRequirement: targetRequirement,
      targetQuantity: 100,
      allocatedQuantity,
      contributingFarmers,
      isComplete: allocatedQuantity >= 100,
      potentialFpoMarginPerQ: 80, // FPO retains ₹80/q for grading, assaying & logistics orchestration
      totalGrossValue: allocatedQuantity * 5200,
    };
  }

  public static createCluster(
    fpoId: string,
    fpoName: string,
    requirement: BuyerRequirement,
    lots: FarmerLot[]
  ): FPOAggregationCluster {
    let allocated = 0;
    const contributors = [];

    for (const lot of lots) {
      if (allocated >= requirement.requiredQuantity) break;
      const takeQty = Math.min(lot.quantity, requirement.requiredQuantity - allocated);
      allocated += takeQty;

      contributors.push({
        farmerId: lot.farmerId,
        farmerName: lot.farmerName,
        lotId: lot.id,
        quantity: takeQty,
        quality: lot.quality,
        payoutRatePerQ: requirement.offeredPrice - 80,
        estimatedPayout: takeQty * (requirement.offeredPrice - 80),
      });
    }

    return {
      id: `cluster_${Date.now()}`,
      fpoId,
      fpoName,
      targetBuyerRequirement: requirement,
      targetQuantity: requirement.requiredQuantity,
      allocatedQuantity: allocated,
      contributingFarmers: contributors,
      isComplete: allocated >= requirement.requiredQuantity,
      potentialFpoMarginPerQ: 80,
      totalGrossValue: allocated * requirement.offeredPrice,
    };
  }
}
