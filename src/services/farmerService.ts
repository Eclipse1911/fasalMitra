import { FarmerLot, CropType } from '../types';
import { INITIAL_FARMER_LOTS } from '../data/sampleData';

export class FarmerService {
  private static lots: FarmerLot[] = [...INITIAL_FARMER_LOTS];

  public static getLots(farmerId?: string): FarmerLot[] {
    if (farmerId) {
      return this.lots.filter(l => l.farmerId === farmerId);
    }
    return this.lots;
  }

  public static getAvailableLots(crop?: CropType): FarmerLot[] {
    let list = this.lots.filter(l => l.status === 'Available');
    if (crop) {
      list = list.filter(l => l.crop === crop);
    }
    return list;
  }

  public static createLot(lot: Omit<FarmerLot, 'id' | 'createdAt' | 'status'>): FarmerLot {
    const newLot: FarmerLot = {
      ...lot,
      id: `lot_${Date.now()}`,
      status: 'Available',
      createdAt: new Date().toISOString(),
    };
    this.lots.unshift(newLot);
    return newLot;
  }

  public static updateLotStatus(id: string, status: FarmerLot['status']): void {
    const idx = this.lots.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.lots[idx] = { ...this.lots[idx], status };
    }
  }
}
