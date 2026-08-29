import { CropInfo, MarketLocation, MarketPriceRecord, CropType } from '../types';
import {
  MAHARASHTRA_CROPS,
  MAHARASHTRA_MARKETS,
  generateSyntheticMarketPrices,
} from '../data/sampleData';

export class MarketService {
  private static prices: MarketPriceRecord[] = generateSyntheticMarketPrices('Akola');

  public static getCrops(): CropInfo[] {
    return MAHARASHTRA_CROPS;
  }

  public static getMarkets(): MarketLocation[] {
    return MAHARASHTRA_MARKETS;
  }

  public static getPrices(crop?: CropType, district?: string): MarketPriceRecord[] {
    let list = this.prices;
    if (crop) {
      list = list.filter(p => p.crop === crop);
    }
    if (district && district !== 'All Districts') {
      list = list.filter(p => p.district.toLowerCase() === district.toLowerCase());
    }
    return list;
  }

  public static getMarketPricesForCrop(crop: CropType): MarketPriceRecord[] {
    return this.getPrices(crop);
  }

  public static getPriceForMarketAndCrop(marketId: string, crop: CropType): MarketPriceRecord | undefined {
    return this.prices.find(p => p.marketId === marketId && p.crop === crop);
  }

  public static getBestPrice(crop: CropType): MarketPriceRecord | undefined {
    const list = this.prices.filter(p => p.crop === crop);
    if (list.length === 0) return undefined;
    return list.reduce((best, curr) => curr.modalPrice > best.modalPrice ? curr : best, list[0]);
  }
}
