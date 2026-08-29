import { GoogleGenAI } from '@google/genai';
import type { AIRecommendation, BuyerMatchItem, MarketPriceRecord, CropType } from '../types';

// Client-side Gemini integration for hackathon demo.
// In production, API calls should be proxied through a backend server.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!apiKey) return null;
  if (!aiInstance) {
    try {
      aiInstance = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.warn('Gemini AI initialization failed:', e);
      return null;
    }
  }
  return aiInstance;
}

export function isGeminiConfigured(): boolean {
  return Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');
}

/**
 * Generate a natural-language AI explanation for the Sell vs Hold recommendation.
 * Replaces the hardcoded template strings with Gemini-generated insights.
 */
export async function generateSellVsHoldExplanation(params: {
  crop: CropType;
  quantity: number;
  district: string;
  currentPrice: number;
  forecastPrice7d: number;
  trendDirection: string;
  trendPercent: number;
  bestBuyerOffer: number;
  bestBuyerName: string;
  storageCostPerDay: number;
  transportCostLocal: number;
  recommendation: AIRecommendation;
}): Promise<string> {
  const ai = getAI();
  if (!ai) return getFallbackSellHoldExplanation(params);

  const prompt = `You are an agricultural market intelligence advisor for Indian farmers in Maharashtra.

A farmer has the following situation:
- Crop: ${params.crop}
- Quantity: ${params.quantity} quintals
- Location: ${params.district}, Maharashtra
- Current mandi price: ₹${params.currentPrice}/quintal
- 7-day forecast price: ₹${params.forecastPrice7d}/quintal (${params.trendDirection}, ${params.trendPercent > 0 ? '+' : ''}${params.trendPercent}%)
- Best buyer offer: ₹${params.bestBuyerOffer}/quintal from ${params.bestBuyerName}
- Nearby storage cost: ₹${params.storageCostPerDay}/quintal/day
- Local transport cost: ₹${params.transportCostLocal}/quintal

The AI system recommends: ${params.recommendation.recommendedActionTitle}
Expected net realization: ₹${params.recommendation.expectedNetRealizationPerQ}/quintal

Write a brief (3-4 sentences), clear, farmer-friendly explanation in simple English of why this recommendation makes sense. Include specific numbers. Be honest about risks. Do not use bullet points or markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    return response.text?.trim() || getFallbackSellHoldExplanation(params);
  } catch (e) {
    console.warn('Gemini sell/hold explanation failed, using fallback:', e);
    return getFallbackSellHoldExplanation(params);
  }
}

function getFallbackSellHoldExplanation(params: {
  crop: CropType;
  district: string;
  currentPrice: number;
  forecastPrice7d: number;
  bestBuyerOffer: number;
  bestBuyerName: string;
  recommendation: AIRecommendation;
}): string {
  return params.recommendation.reasons.join(' ');
}

/**
 * Generate a natural-language justification for why a specific buyer is recommended.
 */
export async function generateBuyerMatchJustification(
  match: BuyerMatchItem,
  farmerCrop: CropType,
  farmerQuantity: number,
  farmerDistrict: string,
  localMandiPrice: number
): Promise<string> {
  const ai = getAI();
  if (!ai) return match.matchScore.explanation;

  const req = match.requirement;
  const prompt = `You are an agricultural market advisor for farmers in Maharashtra, India.

A farmer in ${farmerDistrict} has ${farmerQuantity} quintals of ${farmerCrop}. The local mandi price is ₹${localMandiPrice}/quintal.

A buyer has been matched:
- Business: ${req.businessName}
- Offered price: ₹${req.offeredPrice}/quintal (₹${req.offeredPrice - localMandiPrice}/q ${req.offeredPrice > localMandiPrice ? 'above' : 'below'} mandi)
- Required quantity: ${req.requiredQuantity} quintals
- Quality needed: ${req.qualityRequired}
- Distance: ${req.distanceKm} km
- Reliability score: ${req.reliabilityScore}/100
- Verification: ${req.verificationStatus}
- Match score: ${match.matchScore.totalScore}%
- Net realization after transport: ₹${match.netRealization.netRealizationPerQ}/quintal

Match strengths: ${match.matchScore.strengths.join('; ')}
${match.matchScore.caveats.length > 0 ? 'Concerns: ' + match.matchScore.caveats.join('; ') : ''}

Write a concise (2-3 sentences) farmer-friendly explanation of why this buyer is a good match. Include specific numbers. Be honest about any trade-offs.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    return response.text?.trim() || match.matchScore.explanation;
  } catch (e) {
    console.warn('Gemini buyer justification failed, using fallback:', e);
    return match.matchScore.explanation;
  }
}

/**
 * Generate a daily market intelligence narrative summary for the dashboard.
 */
export async function generateMarketInsightSummary(params: {
  crop: CropType;
  district: string;
  marketPrices: MarketPriceRecord[];
  recommendation: AIRecommendation;
}): Promise<string> {
  const ai = getAI();
  if (!ai) return getFallbackMarketSummary(params);

  const topMarkets = params.marketPrices
    .filter(m => m.crop === params.crop)
    .sort((a, b) => b.modalPrice - a.modalPrice)
    .slice(0, 5)
    .map(m => `${m.marketName}: ₹${m.modalPrice}/q (${m.trend} ${m.trendPercent > 0 ? '+' : ''}${m.trendPercent}%)`)
    .join('\n');

  const prompt = `You are a market intelligence analyst for agricultural commodities in Maharashtra, India.

Today's market snapshot for ${params.crop} near ${params.district}:
${topMarkets}

Current AI recommendation: ${params.recommendation.recommendedActionTitle} at ${params.recommendation.recommendedDestination}
Expected net realization: ₹${params.recommendation.expectedNetRealizationPerQ}/quintal

Write a brief (3-4 sentences) daily market intelligence summary for a farmer. Mention the best-performing market, the overall trend direction, and one actionable insight. Use simple language. Do not use bullet points or headers.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    return response.text?.trim() || getFallbackMarketSummary(params);
  } catch (e) {
    console.warn('Gemini market summary failed, using fallback:', e);
    return getFallbackMarketSummary(params);
  }
}

function getFallbackMarketSummary(params: {
  crop: CropType;
  district: string;
  marketPrices: MarketPriceRecord[];
  recommendation: AIRecommendation;
}): string {
  const best = params.marketPrices
    .filter(m => m.crop === params.crop)
    .sort((a, b) => b.modalPrice - a.modalPrice)[0];

  if (!best) return `Market data for ${params.crop} is being updated.`;

  return `${params.crop} prices in the ${params.district} region are currently ${best.trend === 'UP' ? 'trending upward' : best.trend === 'DOWN' ? 'softening' : 'stable'}. The highest modal price today is ₹${best.modalPrice.toLocaleString()}/q at ${best.marketName} (${best.trend === 'UP' ? '+' : ''}${best.trendPercent}% weekly movement). ${params.recommendation.recommendedActionTitle === 'SELL DIRECTLY TO VERIFIED BUYER' ? 'Direct buyer offers currently exceed mandi rates after accounting for transport savings.' : 'Monitor arrival volumes before committing to a selling channel.'}`;
}

/**
 * Conversational crop advisor — answers farmer questions in natural language.
 */
export async function askCropAdvisor(
  question: string,
  context: {
    crop: CropType;
    quantity: number;
    district: string;
    currentPrice: number;
    recommendation: AIRecommendation;
    language?: 'en' | 'hi' | 'mr';
  }
): Promise<string> {
  const ai = getAI();
  if (!ai) {
    return 'AI advisor is not available. Please configure your Gemini API key in the .env file (VITE_GEMINI_API_KEY).';
  }

  const langInstruction = context.language === 'hi'
    ? 'Respond in Hindi (Devanagari script).'
    : context.language === 'mr'
    ? 'Respond in Marathi (Devanagari script).'
    : 'Respond in simple English.';

  const prompt = `You are FasalMitr AI, a friendly agricultural market advisor for farmers in Maharashtra, India.

Context about the farmer:
- Crop: ${context.crop}, Quantity: ${context.quantity} quintals
- Location: ${context.district}, Maharashtra
- Current mandi price: ₹${context.currentPrice}/quintal
- Current recommendation: ${context.recommendation.recommendedActionTitle}
- Expected net realization: ₹${context.recommendation.expectedNetRealizationPerQ}/quintal

${langInstruction}

The farmer asks: "${question}"

Give a helpful, concise answer (3-5 sentences). Use specific numbers from the context when relevant. If the question is outside agricultural market topics, politely redirect. Do not use markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    return response.text?.trim() || 'I could not generate a response. Please try again.';
  } catch (e) {
    console.warn('Gemini crop advisor failed:', e);
    return 'AI advisor encountered an error. Please try again in a moment.';
  }
}
