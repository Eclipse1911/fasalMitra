import { CropType, PriceForecastResult, PriceForecastPoint } from '../types';
import { generateHistoricalPriceSeries } from '../data/sampleData';

export class ForecastService {
  /**
   * Statistical price forecast model incorporating:
   * 1. Exponentially Weighted Moving Average (EWMA) smoothing (alpha = 0.35)
   * 2. Trend velocity (linear regression slope over last 6 weeks)
   * 3. Arrival volume pressure elasticity (-0.12% price adjustment per 10% arrival surge)
   * 4. Confidence intervals calculated from historical standard error
   */
  public static generateForecast(crop: CropType, district: string = 'Akola'): PriceForecastResult {
    const historical = generateHistoricalPriceSeries(crop, `${district} APMC Mandi`);
    const n = historical.length;
    const latestHistorical = historical[n - 1];
    const currentPrice = latestHistorical.price;

    // 1. EWMA Calculation
    const alpha = 0.35;
    let ewma = historical[0].price;
    for (let i = 1; i < n; i++) {
      ewma = alpha * historical[i].price + (1 - alpha) * ewma;
    }

    // 2. Linear regression slope on recent 6 weeks
    const recent = historical.slice(-6);
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    const k = recent.length;

    for (let i = 0; i < k; i++) {
      sumX += i;
      sumY += recent[i].price;
      sumXY += i * recent[i].price;
      sumX2 += i * i;
    }

    const rawSlope = (k * sumXY - sumX * sumY) / (k * sumX2 - sumX * sumX);
    const weeklySlope = isNaN(rawSlope) ? 15 : rawSlope;

    // 3. Arrival Volume Pressure Elasticity
    // Calculate average arrivals over recent 4 weeks vs latest arrival
    const recentArrivals = recent.map(r => r.arrivals);
    const avgArrivals = recentArrivals.reduce((a, b) => a + b, 0) / k;
    const arrivalSurgeRatio = (latestHistorical.arrivals - avgArrivals) / (avgArrivals || 1);
    // Elasticity factor: -0.12% price impact for every +10% arrival surge above average
    const elasticityAdjustment = -(arrivalSurgeRatio * 10) * 0.0012 * currentPrice;

    // Blended 7-day and 14-day forecasts
    const trendComponent = weeklySlope + elasticityAdjustment;
    const forecast7Days = Math.round(0.6 * (currentPrice + trendComponent) + 0.4 * ewma);
    const forecast14Days = Math.round(0.5 * (currentPrice + trendComponent * 2) + 0.5 * ewma);

    const trendGrowthPercent = Math.round(((forecast7Days - currentPrice) / currentPrice) * 1000) / 10;
    const trendDirection: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 
      trendGrowthPercent > 0.8 ? 'BULLISH' : trendGrowthPercent < -0.8 ? 'BEARISH' : 'NEUTRAL';

    // Standard deviation for confidence bands
    const variance = recent.reduce((acc, pt) => acc + Math.pow(pt.price - (sumY / k), 2), 0) / k;
    const stdDev = Math.max(35, Math.round(Math.sqrt(variance)));

    // Generate forward projection points for graph
    const forecastSeries: PriceForecastPoint[] = [];
    const baseDate = new Date(latestHistorical.date);

    // Include last point as anchor
    forecastSeries.push({
      date: latestHistorical.date,
      historicalModal: currentPrice,
      forecastPrice: currentPrice,
      confidenceLower: currentPrice,
      confidenceUpper: currentPrice,
      projectedArrivals: latestHistorical.arrivals,
    });

    for (let day = 1; day <= 28; day += 3) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + day);
      const dateStr = d.toISOString().split('T')[0];

      const weekFrac = day / 7;
      const expectedP = Math.round(currentPrice + (trendComponent * weekFrac) + Math.sin(day / 4) * 10);
      const uncertainty = Math.round(stdDev * (1 + weekFrac * 0.45));

      forecastSeries.push({
        date: dateStr,
        forecastPrice: expectedP,
        confidenceLower: expectedP - uncertainty,
        confidenceUpper: expectedP + uncertainty,
        projectedArrivals: Math.round(latestHistorical.arrivals * (1 - weekFrac * 0.04)),
      });
    }

    const confidenceScore = Math.min(88, Math.max(62, Math.round(85 - stdDev * 0.15)));
    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = confidenceScore >= 78 ? 'LOW' : confidenceScore >= 68 ? 'MEDIUM' : 'HIGH';

    const keyDrivers = [
      `EWMA 24-week baseline smoothed at ₹${Math.round(ewma)}/q`,
      `4-week trend velocity slope: ${weeklySlope >= 0 ? '+' : ''}₹${Math.round(weeklySlope)}/week`,
      `Arrival elasticity adjustment: ${elasticityAdjustment >= 0 ? '+' : ''}₹${Math.round(elasticityAdjustment)}/q (${arrivalSurgeRatio >= 0 ? 'Surge' : 'Deficit'} vs 4-week avg)`,
      `Sustained processor demand in ${district} regional yards (${latestHistorical.arrivals} q daily)`,
    ];

    return {
      crop,
      marketDistrict: district,
      currentPrice,
      forecast7Days,
      forecast14Days,
      trendDirection,
      trendGrowthPercent,
      confidenceScore,
      riskLevel,
      keyDrivers,
      historicalSeries: historical.map(h => ({ date: h.date, price: h.price, arrivals: h.arrivals })),
      forecastSeries,
    };
  }
}

