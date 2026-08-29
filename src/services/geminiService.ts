import { GoogleGenAI } from '@google/genai';
import type { AIRecommendation, BuyerMatchItem, MarketPriceRecord, CropType } from '../types';

// Client-side Gemini integration for hackathon demo.
// In production, API calls should be proxied through a backend server.
const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || (import.meta.env as any).GEMINI_API_KEY || '').replace(/^["']|["']$/g, '');

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
 * Full multilingual support for Marathi (मराठी), Hindi (हिंदी), and English.
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

  // Detect Devanagari script (Marathi / Hindi)
  const containsDevanagari = /[\u0900-\u097F]/.test(question);
  const isMarathi = context.language === 'mr' || (containsDevanagari && (question.includes('आहे') || question.includes('काय') || question.includes('कधी') || question.includes('विकावा') || question.includes('दर')));

  if (!ai) {
    return getSmartAdvisorFallback(question, context, isMarathi);
  }

  let langInstruction = 'Respond in simple, clear farmer-friendly English.';
  if (isMarathi || context.language === 'mr') {
    langInstruction = 'CRITICAL: Respond in authentic, simple Marathi (मराठी) using Devanagari script. Use common agricultural Marathi terms (e.g., सोयाबीन, कापूस, बाजारभाव, हमीभाव, निवडक खरेदीदार, निव्वळ नफा).';
  } else if (context.language === 'hi' || (containsDevanagari && !isMarathi)) {
    langInstruction = 'CRITICAL: Respond in clear, simple Hindi (हिंदी) using Devanagari script.';
  }

  const prompt = `You are FasalMitr AI (फसलमित्र), an expert agricultural market advisor and friend to farmers in Maharashtra, India.
You understand English, Marathi (मराठी), and Hindi.

Context about the farmer's produce:
- Crop: ${context.crop}, Quantity: ${context.quantity} quintals
- Location: ${context.district}, Maharashtra
- Current local mandi modal price: ₹${context.currentPrice}/quintal
- AI System Best Recommendation: ${context.recommendation.recommendedActionTitle} at ${context.recommendation.recommendedDestination}
- Expected Net Realization (after transport & handling): ₹${context.recommendation.expectedNetRealizationPerQ}/quintal
- Total Expected Payout: ₹${context.recommendation.expectedTotalRealization.toLocaleString()}
- Risk Level: ${context.recommendation.riskLevel}

Language Directive:
${langInstruction}

The farmer asks: "${question}"

Provide a warm, supportive, and numbers-accurate recommendation in 3-5 sentences.
If responding in Marathi, make sure it is grammatically natural and encouraging for a farmer. Include relevant numbers like ₹${context.recommendation.expectedNetRealizationPerQ}/क्विंटल. Do not use markdown bullet points or bold markers.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    return response.text?.trim() || getSmartAdvisorFallback(question, context, isMarathi);
  } catch (e) {
    console.warn('Gemini API call failed (check VITE_GEMINI_API_KEY in .env):', e);
    return getSmartAdvisorFallback(question, context, isMarathi);
  }
}

function getSmartAdvisorFallback(
  question: string,
  context: {
    crop: CropType;
    quantity: number;
    district: string;
    currentPrice: number;
    recommendation: AIRecommendation;
    language?: 'en' | 'hi' | 'mr';
  },
  forceMarathi: boolean = false
): string {
  const q = question.toLowerCase();
  const rec = context.recommendation;
  const isMr = forceMarathi || context.language === 'mr' || /[\u0900-\u097F]/.test(question);

  if (isMr) {
    if (q.includes('sell') || q.includes('wait') || q.includes('hold') || q.includes('कधी') || q.includes('विकावा') || q.includes('थांबू')) {
      return `${context.district} परिसरातील सध्याच्या बाजारभावानुसार, आमचा असा सल्ला आहे की तुम्ही तुमचे ${context.crop} ${rec.recommendedDestination} येथे विकावे. वाहतूक खर्च वजा करून तुम्हाला प्रति क्विंटल ₹${rec.expectedNetRealizationPerQ.toLocaleString()} निव्वळ उत्पन्न मिळेल (एकूण ₹${rec.expectedTotalRealization.toLocaleString()}).`;
    }

    if (q.includes('buyer') || q.includes('offer') || q.includes('price') || q.includes('दर') || q.includes('खरेदीदार')) {
      return `तुमच्या ${context.quantity} क्विंटल ${context.crop} साठी सध्या सर्वोत्कृष्ट पर्याय ${rec.recommendedDestination} हा आहे, जो ₹${rec.recommendedPricePerQ.toLocaleString()}/क्विंटल दर देतो. स्थानिक बाजार समितीपेक्षा वाहतूक व हमाली वजा करून तुम्हाला ₹${rec.expectedNetRealizationPerQ.toLocaleString()}/क्विंटल निव्वळ नफा मिळतो.`;
    }

    if (q.includes('storage') || q.includes('warehouse') || q.includes('गोदाम') || q.includes('साठवणूक')) {
      return `स्वीकृत गोदामात साठवणूक खर्च साधारण ₹४/क्विंटल/दिवस आहे. पुढील ७ दिवस धान्य साठवून ठेवणे ${rec.recommendedAction === 'HOLD_FOR_UPSIDE' ? 'फायदेशीर ठरू शकते कारण दरात तेजीची शक्यता आहे' : 'सध्याच्या थेट खरेदीदाराला विकण्यापेक्षा कमी फायदेशीर ठरेल'}.`;
    }

    return `तुमच्या ${context.district} मधील ${context.quantity} क्विंटल ${context.crop} साठी फसलमित्र AI चा सल्ला: ${rec.recommendedDestination} येथे विक्री करा. अपेक्षित निव्वळ मिळकत ₹${rec.expectedNetRealizationPerQ.toLocaleString()}/क्विंटल आहे.`;
  }

  // English fallbacks
  if (q.includes('sell') || q.includes('wait') || q.includes('hold')) {
    return `Based on market conditions in ${context.district}, our recommendation is to ${rec.recommendedActionTitle} at ${rec.recommendedDestination}. Your expected net realization is ₹${rec.expectedNetRealizationPerQ.toLocaleString()}/quintal (total ₹${rec.expectedTotalRealization.toLocaleString()}). ${rec.reasons[0] || ''}`;
  }

  if (q.includes('buyer') || q.includes('offer') || q.includes('price')) {
    return `The current top destination for your ${context.quantity} quintals of ${context.crop} is ${rec.recommendedDestination} offering ₹${rec.recommendedPricePerQ.toLocaleString()}/quintal. After logistics and handling, your net profit is ₹${rec.expectedNetRealizationPerQ.toLocaleString()}/q vs local mandi modal price of ₹${context.currentPrice.toLocaleString()}/q.`;
  }

  if (q.includes('storage') || q.includes('warehouse')) {
    return `Storage in an accredited Godown costs approx ₹4/quintal/day. Holding for 7 days is ${rec.recommendedAction === 'HOLD_FOR_UPSIDE' ? 'recommended due to bullish price momentum' : 'less profitable than immediate direct buyer fulfillment'} for your ${context.crop} lot.`;
  }

  return `For your ${context.quantity} quintals of ${context.crop} in ${context.district}, FasalMitr analysis recommends: ${rec.recommendedActionTitle} at ${rec.recommendedDestination}. Expected net realization is ₹${rec.expectedNetRealizationPerQ.toLocaleString()}/quintal. Risk level is ${rec.riskLevel}.`;
}
