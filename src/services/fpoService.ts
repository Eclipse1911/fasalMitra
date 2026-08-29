import { FPOAggregationCluster, BuyerRequirement, FarmerLot } from '../types';
import { DEMO_FPO_AKOLA, INITIAL_FARMER_LOTS, SAMPLE_BUYER_REQUIREMENTS } from '../data/sampleData';

export class FPOService {
  private static clusters: FPOAggregationCluster[] = [];

  /**
   * Dynamically generate an aggregation cluster by matching available farmer lots
   * against the first open buyer requirement for the given crop.
   * Falls back to Soybean / ABC Agro Foods if no crop specified.
   */
  public static generateDefaultCluster(crop: string = 'Soybean'): FPOAggregationCluster {
    // Find a matching buyer requirement
    const targetRequirement = SAMPLE_BUYER_REQUIREMENTS.find(
      r => r.crop === crop && r.status === 'Open'
    ) || SAMPLE_BUYER_REQUIREMENTS[0];

    // Find all available farmer lots matching the crop and quality
    const matchingLots = INITIAL_FARMER_LOTS.filter(
      lot => lot.crop === targetRequirement.crop &&
             lot.status === 'Available' &&
             lot.quality === targetRequirement.qualityRequired
    );

    return this.createCluster(
      DEMO_FPO_AKOLA.id,
      DEMO_FPO_AKOLA.fpoName,
      targetRequirement,
      matchingLots
    );
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
      potentialFpoMarginPerQ: 80, // FPO retains ₹80/q for grading, assaying & logistics orchestration
      totalGrossValue: allocated * requirement.offeredPrice,
    };
  }
}

