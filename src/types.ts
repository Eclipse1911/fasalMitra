export type UserRole = 'farmer' | 'buyer' | 'fpo' | 'admin';

export type Language = 'en' | 'mr' | 'hi';

export type NavigationTab = 
  | 'dashboard' 
  | 'my_produce' 
  | 'market_intelligence' 
  | 'find_buyers' 
  | 'net_realization' 
  | 'sell_vs_hold' 
  | 'fpo_aggregation' 
  | 'transactions' 
  | 'interactive_map' 
  | 'admin_analytics';

export interface FarmerProduceLot {
  id: string;
  farmerId: string;
  farmerName: string;
  crop: CropType;
  quantityQuintals: number;
  qualityGrade: QualityGrade;
  moisturePercentage: number;
  district: string;
  taluka: string;
  harvestDate: string;
  targetPrice?: number;
  storageAvailable: boolean;
  status: 'Available' | 'Matched' | 'Sold' | 'Negotiating';
  createdAt: string;
}

export type CropType = 
  | 'Soybean' 
  | 'Cotton' 
  | 'Onion' 
  | 'Wheat' 
  | 'Tur' 
  | 'Chana' 
  | 'Maize' 
  | 'Tomato';

export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C' | 'Fair Average Quality (FAQ)';

export type HarvestStatus = 'Harvested' | 'Ready in 7 Days' | 'Ready in 15 Days' | 'In Field';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  district: string;
  state: string;
  village?: string;
  avatar?: string;
  rating?: number;
  badge?: string;
}

export interface FarmerProfile extends UserProfile {
  primaryCrop: CropType;
  totalAcreage?: number;
  storageAvailable: boolean;
  activeLotCount?: number;
}

export interface BuyerProfile extends UserProfile {
  businessName: string;
  gstNumber?: string;
  verificationStatus: 'Verified' | 'Verification Pending' | 'Not Verified';
  reliabilityScore: number; // 0 - 100
  paymentReliability: number; // 0 - 100
  completedTransactions: number;
  preferredCrops: CropType[];
}

export interface FPOProfile extends UserProfile {
  fpoName: string;
  registrationNumber?: string;
  memberCount: number;
  totalCapacityQuintals: number;
  coveredDistricts: string[];
}

export interface CropInfo {
  id: string;
  name: CropType;
  unit: string;
  hindiName: string;
  marathiName: string;
  category: 'Oilseeds' | 'Cash Crops' | 'Vegetables' | 'Grains' | 'Pulses';
  mspPrice: number; // Minimum Support Price per quintal (INR)
  benchmarkPrice: number;
  shelfLifeDays: number;
  requiresColdStorage: boolean;
}

export interface MarketLocation {
  id: string;
  name: string;
  district: string;
  latitude: number;
  longitude: number;
  isAPMC: boolean;
  marketCessPercent: number; // e.g. 1.05%
  handlingChargesPerQ: number; // e.g. ₹25/q
}

export interface MarketPriceRecord {
  id: string;
  marketId: string;
  marketName: string;
  district: string;
  crop: CropType;
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity: number; // quintals
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendPercent: number;
  distanceKm?: number; // relative to selected farmer
}

export interface FarmerLot {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  farmerDistrict: string;
  crop: CropType;
  quantity: number; // quintals
  quality: QualityGrade;
  harvestStatus: HarvestStatus;
  availableDate: string;
  storageAvailable: boolean;
  minExpectedPrice: number;
  status: 'Available' | 'Negotiating' | 'Matched' | 'Aggregated' | 'Sold';
  createdAt: string;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  businessName: string;
  location: string;
  district: string;
  crop: CropType;
  requiredQuantity: number; // quintals
  fulfilledQuantity: number;
  qualityRequired: QualityGrade;
  offeredPrice: number; // INR per quintal
  requiredDate: string;
  verificationStatus: 'Verified' | 'Verification Pending' | 'Not Verified';
  reliabilityScore: number;
  distanceKm?: number;
  status: 'Open' | 'Partially Filled' | 'Completed' | 'Expired';
  createdAt: string;
}

export interface StorageFacility {
  id: string;
  name: string;
  type: 'Cold Storage' | 'Dry Warehouse' | 'WDRA Accredited Godown';
  location: string;
  district: string;
  totalCapacity: number; // quintals
  availableCapacity: number;
  costPerDayPerQ: number; // INR / quintal / day
  distanceKm: number;
  rating: number;
  accredited: boolean;
  contactNumber: string;
}

export interface LogisticsEstimate {
  fromLocation: string;
  toLocation: string;
  distanceKm: number;
  totalTransportCost: number;
  costPerQuintal: number;
  transitDurationHours: number;
  vehicleType: string;
}

export interface NetRealizationBreakdown {
  destinationName: string;
  destinationType: 'LOCAL_MANDI' | 'DISTANT_MANDI' | 'DIRECT_BUYER' | 'FPO_AGGREGATION' | 'WAREHOUSE_HOLD';
  offeredPricePerQ: number;
  quantityQuintals: number;
  grossValue: number;
  distanceKm: number;
  transportCost: number;
  transportCostPerQ: number;
  storageCost: number;
  storageCostPerQ: number;
  mandiCessAndHandling: number;
  netRealizationTotal: number;
  netRealizationPerQ: number;
  gainVsLocalMandiPerQ: number;
  gainVsLocalMandiTotal: number;
}

export interface MatchScoreDetails {
  totalScore: number; // 0 - 100
  cropScore: number; // max 25
  quantityScore: number; // max 20
  qualityScore: number; // max 15
  priceScore: number; // max 20
  distanceScore: number; // max 10
  dateScore: number; // max 5
  reliabilityScore: number; // max 5
  explanation: string;
  strengths: string[];
  caveats: string[];
}

export interface BuyerMatchItem {
  requirement: BuyerRequirement;
  matchScore: MatchScoreDetails;
  netRealization: NetRealizationBreakdown;
}

export interface PriceForecastPoint {
  date: string;
  historicalModal?: number;
  forecastPrice: number;
  confidenceLower: number;
  confidenceUpper: number;
  projectedArrivals: number;
}

export interface PriceForecastResult {
  crop: CropType;
  marketDistrict: string;
  currentPrice: number;
  forecast7Days: number;
  forecast14Days: number;
  trendDirection: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  trendGrowthPercent: number;
  confidenceScore: number; // e.g. 74%
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  keyDrivers: string[];
  historicalSeries: { date: string; price: number; arrivals: number }[];
  forecastSeries: PriceForecastPoint[];
}

export type ActionRecommendation = 'SELL_LOCAL_MANDI' | 'SELL_DIRECT_BUYER' | 'SELL_DISTANT_MANDI' | 'HOLD_FOR_UPSIDE' | 'JOIN_FPO_AGGREGATION';

export interface AIRecommendation {
  recommendedAction: ActionRecommendation;
  recommendedActionTitle: string;
  recommendedDestination: string;
  recommendedPricePerQ: number;
  expectedNetRealizationPerQ: number;
  expectedTotalRealization: number;
  currentBestImmediateNetPerQ: number;
  potentialUpsidePerQ: number;
  potentialTotalUpside: number;
  confidenceScore: number; // e.g. 72%
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeHorizonDays: number;
  reasons: string[];
  riskFactors: string[];
  alternatives: {
    title: string;
    action: ActionRecommendation;
    destination: string;
    netRealizationPerQ: number;
    pros: string;
    cons: string;
  }[];
}

export interface FPOAggregationCluster {
  id: string;
  fpoId: string;
  fpoName: string;
  targetBuyerRequirement: BuyerRequirement;
  targetQuantity: number;
  allocatedQuantity: number;
  contributingFarmers: {
    farmerId: string;
    farmerName: string;
    lotId: string;
    quantity: number;
    quality: QualityGrade;
    payoutRatePerQ: number;
    estimatedPayout: number;
  }[];
  isComplete: boolean;
  potentialFpoMarginPerQ: number;
  totalGrossValue: number;
}

export interface TransactionRecord {
  id: string;
  transactionNumber: string;
  farmerName: string;
  farmerLocation: string;
  buyerName: string;
  businessName: string;
  crop: CropType;
  quantityQuintals: number;
  agreedPricePerQ: number;
  grossValue: number;
  transportCost: number;
  storageCost: number;
  netRealization: number;
  status: 'Lot Created' | 'Buyer Matched' | 'Offer Accepted' | 'Produce Dispatched' | 'Delivered' | 'Paid';
  stepIndex: number; // 0 to 5
  paymentStatus: 'Pending' | 'Processing' | 'Paid' | 'Delayed';
  settlementDateEstimate: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'price_alert' | 'buyer_offer' | 'storage_alert' | 'transaction' | 'recommendation';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
