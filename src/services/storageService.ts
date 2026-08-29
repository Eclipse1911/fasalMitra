import { StorageFacility } from '../types';
import { SAMPLE_STORAGE_FACILITIES } from '../data/sampleData';

export class StorageService {
  private static facilities: StorageFacility[] = [...SAMPLE_STORAGE_FACILITIES];

  public static getNearbyFacilities(district: string = 'Akola'): StorageFacility[] {
    return this.facilities.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  public static getFacilitiesForDistrict(district: string = 'Akola'): StorageFacility[] {
    return this.getNearbyFacilities(district);
  }

  public static getFacilities(): StorageFacility[] {
    return this.facilities;
  }

  public static getBestFacilityForHold(
    district: string = 'Akola',
    quantityQuintals: number = 20,
    cropRequiresCold: boolean = false
  ): StorageFacility | null {
    const sorted = this.facilities.filter(f => {
      if (cropRequiresCold) {
        return f.type === 'Cold Storage';
      }
      return f.availableCapacity >= quantityQuintals;
    }).sort((a, b) => a.costPerDayPerQ - b.costPerDayPerQ);

    return sorted.length > 0 ? sorted[0] : (this.facilities[0] || null);
  }

  public static calculateStorageCost(
    quantityQuintals: number,
    days: number,
    costPerDayPerQ: number = 4.0
  ): { totalCost: number; costPerQuintal: number } {
    const totalCost = Math.round(quantityQuintals * days * costPerDayPerQ);
    const costPerQuintal = Math.round(days * costPerDayPerQ);
    return { totalCost, costPerQuintal };
  }
}
