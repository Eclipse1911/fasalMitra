import { LogisticsEstimate } from '../types';
import { MAHARASHTRA_MARKETS } from '../data/sampleData';

/**
 * Haversine formula to calculate distance between two lat/lng points in kilometers.
 */
function haversineDistanceKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class LogisticsService {
  /**
   * Calculate realistic transportation cost across Maharashtra road logistics.
   * Model:
   * - Base vehicle mobilization charge (pickup & loading): ₹1,200 / ₹2,400 / ₹4,500
   * - Distance rate: ₹22/km (light) / ₹32/km (medium) / ₹48/km (heavy)
   * - Weight rate: ₹0.45 / quintal / km
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

    // Vehicle selection based on load — IMPORTANT: check largest first
    let vehicleType = 'Mini Pickup Truck (Tata Ace / Bolero Maxi)';
    let baseRate = 1200;
    let kmRate = 22;

    if (safeQty > 100) {
      vehicleType = 'Heavy Transport Truck (10-Wheeler Multi-Axle)';
      baseRate = 4500;
      kmRate = 48;
    } else if (safeQty > 40) {
      vehicleType = 'Medium Commercial Vehicle (Eicher 6-Wheeler)';
      baseRate = 2400;
      kmRate = 32;
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
   * Estimate road distance between a farmer's district and a destination using
   * Haversine formula on real APMC market lat/lng coordinates.
   * Applies a 1.3x road multiplier for Maharashtra terrain (winding state highways).
   */
  public static estimateDistanceKm(fromDistrict: string, toLocationName: string): number {
    const ROAD_MULTIPLIER = 1.3;

    // Find origin market (farmer's district)
    const fromMarket = MAHARASHTRA_MARKETS.find(
      m => m.district.toLowerCase() === fromDistrict.toLowerCase()
    );

    // Find destination market by name or district
    const toMarket = MAHARASHTRA_MARKETS.find(
      m => toLocationName.toLowerCase().includes(m.name.toLowerCase()) ||
           toLocationName.toLowerCase().includes(m.district.toLowerCase()) ||
           m.name.toLowerCase().includes(toLocationName.toLowerCase())
    );

    if (fromMarket && toMarket) {
      if (fromMarket.id === toMarket.id) {
        return 15; // Same market, local transport only
      }
      const straightLine = haversineDistanceKm(
        fromMarket.latitude, fromMarket.longitude,
        toMarket.latitude, toMarket.longitude
      );
      return Math.round(straightLine * ROAD_MULTIPLIER);
    }

    // Fallback: if one side is found, estimate from average
    if (fromMarket || toMarket) {
      return 95;
    }

    return 95; // Default fallback
  }
}

