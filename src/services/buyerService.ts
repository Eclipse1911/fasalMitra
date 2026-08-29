import { BuyerRequirement, CropType } from '../types';
import { SAMPLE_BUYER_REQUIREMENTS } from '../data/sampleData';

export class BuyerService {
  private static requirements: BuyerRequirement[] = [...SAMPLE_BUYER_REQUIREMENTS];

  public static getRequirements(filters?: {
    crop?: CropType | 'All Crops';
    district?: string;
    minPrice?: number;
    quality?: string;
  }): BuyerRequirement[] {
    let list = [...this.requirements];

    if (filters?.crop && filters.crop !== 'All Crops') {
      list = list.filter(r => r.crop === filters.crop);
    }
    if (filters?.district && filters.district !== 'All Districts') {
      list = list.filter(r => r.district.toLowerCase() === filters.district!.toLowerCase());
    }
    if (filters?.quality && filters.quality !== 'All') {
      list = list.filter(r => r.qualityRequired === filters.quality);
    }

    return list;
  }

  public static addRequirement(req: Omit<BuyerRequirement, 'id' | 'createdAt' | 'status' | 'fulfilledQuantity'>): BuyerRequirement {
    const newReq: BuyerRequirement = {
      ...req,
      id: `req_${Date.now()}`,
      fulfilledQuantity: 0,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    this.requirements.unshift(newReq);
    return newReq;
  }

  public static getRequirementById(id: string): BuyerRequirement | undefined {
    return this.requirements.find(r => r.id === id);
  }

  public static updateRequirement(id: string, updates: Partial<BuyerRequirement>): void {
    const idx = this.requirements.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.requirements[idx] = { ...this.requirements[idx], ...updates };
    }
  }
}
