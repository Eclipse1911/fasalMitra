import { BuyerRequirement, FarmerLot, MatchScoreDetails, QualityGrade, BuyerMatchItem, CropType } from '../types';
import { RealizationService } from './realizationService';

export class MatchingService {
  /**
   * Deterministic 7-Factor Buyer Matching Algorithm
   */
  public static calculateMatchScore(
    lot: { crop: string; quantity: number; quality: QualityGrade; minExpectedPrice: number; availableDate: string; district: string },
    req: BuyerRequirement,
    benchmarkMarketPrice: number = 5050
  ): MatchScoreDetails {
    // 1. Crop Match (Weight: 25 pts)
    let cropScore = 0;
    if (lot.crop.toLowerCase() === req.crop.toLowerCase()) {
      cropScore = 25;
    }

    // 2. Quantity Match (Weight: 20 pts)
    // Checks if farmer's lot is a viable portion (e.g. 10% to 100%) of buyer demand
    let quantityScore = 0;
    const remainingReq = Math.max(1, req.requiredQuantity - req.fulfilledQuantity);
    if (lot.quantity <= remainingReq) {
      // Lot fits cleanly inside requirement
      const ratio = lot.quantity / remainingReq;
      if (ratio >= 0.15 && ratio <= 1.0) {
        quantityScore = 20;
      } else {
        quantityScore = 16;
      }
    } else {
      // Farmer has more than buyer needs, partial fill possible
      quantityScore = 15;
    }

    // 3. Quality Match (Weight: 15 pts)
    let qualityScore = 0;
    const gradeWeight: Record<QualityGrade, number> = {
      'Grade A': 3,
      'Grade B': 2,
      'Grade C': 1,
      'Fair Average Quality (FAQ)': 2,
    };
    const lotGradeVal = gradeWeight[lot.quality] || 2;
    const reqGradeVal = gradeWeight[req.qualityRequired] || 2;

    if (lotGradeVal >= reqGradeVal) {
      qualityScore = 15; // Exceeds or meets
    } else if (lotGradeVal === reqGradeVal - 1) {
      qualityScore = 8; // Slightly lower
    } else {
      qualityScore = 2;
    }

    // 4. Price Competitiveness (Weight: 20 pts)
    let priceScore = 0;
    const priceDiff = req.offeredPrice - benchmarkMarketPrice;
    if (priceDiff >= 150) {
      priceScore = 20; // Premium >= ₹150/q above mandi
    } else if (priceDiff >= 50) {
      priceScore = 17;
    } else if (priceDiff >= 0) {
      priceScore = 14;
    } else if (priceDiff >= -100) {
      priceScore = 9;
    } else {
      priceScore = 4;
    }

    // 5. Distance Proximity (Weight: 10 pts)
    let distanceScore = 0;
    const dist = req.distanceKm ?? 50;
    if (dist <= 25) {
      distanceScore = 10;
    } else if (dist <= 60) {
      distanceScore = 8;
    } else if (dist <= 120) {
      distanceScore = 6;
    } else if (dist <= 250) {
      distanceScore = 4;
    } else {
      distanceScore = 2;
    }

    // 6. Date Compatibility (Weight: 5 pts)
    let dateScore = 5;
    if (req.requiredDate && lot.availableDate) {
      const avail = new Date(lot.availableDate).getTime();
      const reqD = new Date(req.requiredDate).getTime();
      const diffDays = (reqD - avail) / (1000 * 3600 * 24);
      if (diffDays >= 0 && diffDays <= 14) {
        dateScore = 5;
      } else if (diffDays < 0) {
        dateScore = 2; // Required date before availability
      } else {
        dateScore = 4;
      }
    }

    // 7. Buyer Reliability (Weight: 5 pts)
    let reliabilityScore = 0;
    if (req.reliabilityScore >= 90) {
      reliabilityScore = 5;
    } else if (req.reliabilityScore >= 80) {
      reliabilityScore = 4;
    } else if (req.reliabilityScore >= 70) {
      reliabilityScore = 3;
    } else {
      reliabilityScore = 1;
    }

    const totalScore = Math.min(100, Math.round(cropScore + quantityScore + qualityScore + priceScore + distanceScore + dateScore + reliabilityScore));

    const strengths: string[] = [];
    const caveats: string[] = [];

    if (cropScore === 25) strengths.push(`Exact crop match for ${lot.crop}`);
    if (qualityScore === 15) strengths.push(`Quality grade (${lot.quality}) fully meets buyer's standard`);
    if (priceScore >= 17) strengths.push(`Attractive offer of ₹${req.offeredPrice.toLocaleString()}/q (₹${priceDiff >= 0 ? '+' : ''}${priceDiff}/q vs local mandi)`);
    if (distanceScore >= 8) strengths.push(`Close logistics radius (${dist} km away) minimizing freight expense`);
    if (reliabilityScore >= 4) strengths.push(`High buyer trust index (${req.reliabilityScore}/100) with ${req.verificationStatus} status`);

    if (distanceScore <= 4) caveats.push(`Longer transit distance (${dist} km) increases freight deduction`);
    if (priceScore <= 9) caveats.push(`Offer is slightly below or near baseline modal market rates`);
    if (req.verificationStatus !== 'Verified') caveats.push(`Buyer verification is currently pending`);

    const explanation = `Strong ${totalScore}% match. ${req.businessName} accepts ${lot.quality} ${lot.crop}, requires ${req.requiredQuantity} quintals, offers ₹${req.offeredPrice.toLocaleString()}/q, and is situated ${dist} km away in ${req.district}.`;

    return {
      totalScore,
      cropScore,
      quantityScore,
      qualityScore,
      priceScore,
      distanceScore,
      dateScore,
      reliabilityScore,
      explanation,
      strengths,
      caveats,
    };
  }

  /**
   * Match a farmer lot with all open buyer requirements
   */
  public static matchLotWithBuyers(
    lot: { crop: string; quantity: number; quality: QualityGrade; minExpectedPrice: number; availableDate: string; district: string },
    requirements: BuyerRequirement[],
    benchmarkMarketPrice: number = 5050,
    baselineLocalNetPerQ: number = 4850
  ): BuyerMatchItem[] {
    const relevant = requirements.filter(r => r.crop.toLowerCase() === lot.crop.toLowerCase() && r.status === 'Open');

    const matches: BuyerMatchItem[] = relevant.map(req => {
      const matchScore = this.calculateMatchScore(lot, req, benchmarkMarketPrice);
      const netRealization = RealizationService.calculate({
        destinationName: req.businessName,
        destinationType: 'DIRECT_BUYER',
        offeredPricePerQ: req.offeredPrice,
        quantityQuintals: lot.quantity,
        distanceKm: req.distanceKm ?? 35,
        isAPMC: false,
        baselineLocalNetPerQ,
      });

      return {
        requirement: req,
        matchScore,
        netRealization,
      };
    });

    return matches.sort((a, b) => b.matchScore.totalScore - a.matchScore.totalScore);
  }

  public static findMatches(
    crop: CropType,
    quantity: number,
    quality: QualityGrade,
    district: string,
    minExpectedPrice: number,
    requirements: BuyerRequirement[]
  ): BuyerMatchItem[] {
    return this.matchLotWithBuyers(
      {
        crop,
        quantity,
        quality,
        district,
        minExpectedPrice,
        availableDate: new Date().toISOString().split('T')[0],
      },
      requirements
    );
  }
}
