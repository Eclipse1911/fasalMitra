import { LogisticsEstimate } from '../types';

export class LogisticsService {
  /**
   * Calculate realistic transportation cost across Maharashtra road logistics.
   * Model:
   * - Base vehicle mobilization charge (pickup & loading): ₹1,200
   * - Distance rate: ₹22/km
   * - Weight rate: ₹1.8 / quintal / km for distances > 10 km
   * - Minimum per trip cost: ₹1,500
   */
  public static calculateEstimate(
    fromLocation: string,
    toLocation: string,
    distanceKm: number,
    quantityQuintals: number
  ): LogisticsEstimate {
    const safeDistance = Math.max(5, Math.round(distanceKm));
    const safeQty = Math.max(1, quantityQuintals);

    // Vehicle selection based on load
    let vehicleType = 'Mini Pickup Truck (Tata Ace / Bolero Maxi)';
    let baseRate = 1200;
    let kmRate = 22;

    if (safeQty > 40) {
      vehicleType = 'Medium Commercial Vehicle (Eicher 6-Wheeler)';
      baseRate = 2400;
      kmRate = 32;
    } else if (safeQty > 100) {
      vehicleType = 'Heavy Transport Truck (10-Wheeler Multi-Axle)';
      baseRate = 4500;
      kmRate = 48;
    }

    // Cost formula: base + distance + quantity handling
    const rawTransport = baseRate + (safeDistance * kmRate) + (safeDistance * safeQty * 0.45);
    const totalTransportCost = Math.round(Math.max(1500, rawTransport));
    const costPerQuintal = Math.round((totalTransportCost / safeQty) * 10) / 10;
    
    // Average speed ~35 km/h on state highways + 1.5h loading/unloading
    const transitHours = Math.round((1.5 + safeDistance / 35) * 10) / 10;

    return {
      fromLocation,
      toLocation,
      distanceKm: safeDistance,
      totalTransportCost,
      costPerQuintal,
      transitDurationHours: transitHours,
      vehicleType,
    };
  }

  /**
   * Helper to estimate distance between two Maharashtra locations
   */
  public static estimateDistanceKm(fromDistrict: string, toLocationName: string): number {
    const lowerFrom = fromDistrict.toLowerCase();
    const lowerTo = toLocationName.toLowerCase();

    if (lowerFrom.includes('akola')) {
      if (lowerTo.includes('akola')) return 15;
      if (lowerTo.includes('washim')) return 65;
      if (lowerTo.includes('amravati')) return 90;
      if (lowerTo.includes('buldhana') || lowerTo.includes('khamgaon')) return 75;
      if (lowerTo.includes('nagpur')) return 245;
      if (lowerTo.includes('latur')) return 260;
      if (lowerTo.includes('nashik') || lowerTo.includes('lasalgaon')) return 340;
      if (lowerTo.includes('aurangabad') || lowerTo.includes('sambhajinagar')) return 230;
      if (lowerTo.includes('pune')) return 480;
      if (lowerTo.includes('jalgaon')) return 160;
      if (lowerTo.includes('yavatmal')) return 140;
      if (lowerTo.includes('solapur')) return 360;
      return 110;
    }

    if (lowerFrom.includes('nashik')) {
      if (lowerTo.includes('nashik') || lowerTo.includes('lasalgaon')) return 20;
      if (lowerTo.includes('pune')) return 210;
      if (lowerTo.includes('mumbai')) return 170;
      if (lowerTo.includes('aurangabad') || lowerTo.includes('sambhajinagar')) return 190;
      return 280;
    }

    return 95;
  }
}
