import { TransactionRecord, CropType, QualityGrade, BuyerMatchItem } from '../types';
import { INITIAL_TRANSACTIONS } from '../data/sampleData';

export class TransactionService {
  private static transactions: TransactionRecord[] = [...INITIAL_TRANSACTIONS];

  public static getTransactions(): TransactionRecord[] {
    return this.transactions;
  }

  public static getTransactionsForFarmer(farmerId?: string): TransactionRecord[] {
    return this.transactions;
  }

  public static getTransactionById(id: string): TransactionRecord | undefined {
    return this.transactions.find(t => t.id === id);
  }

  public static createTransaction(params: {
    farmerId?: string;
    farmerName: string;
    farmerLocation?: string;
    buyerId?: string;
    buyerName?: string;
    businessName: string;
    crop: CropType;
    quantityQuintals: number;
    qualityGrade?: QualityGrade;
    agreedPricePerQ: number;
    grossValue?: number;
    transportCost?: number;
    storageCost?: number;
    netRealization?: number;
    deliveryLocation?: string;
    status?: TransactionRecord['status'];
    paymentStatus?: TransactionRecord['paymentStatus'];
    settlementDateEstimate?: string;
  }): TransactionRecord {
    const gross = params.grossValue ?? Math.round(params.agreedPricePerQ * params.quantityQuintals);
    const transport = params.transportCost ?? Math.round(params.quantityQuintals * 140);
    const storage = params.storageCost ?? 0;
    const net = params.netRealization ?? (gross - transport - storage);

    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      transactionNumber: `TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerName: params.farmerName,
      farmerLocation: params.farmerLocation || 'Akola, Maharashtra',
      buyerName: params.buyerName || params.businessName,
      businessName: params.businessName,
      crop: params.crop,
      quantityQuintals: params.quantityQuintals,
      agreedPricePerQ: params.agreedPricePerQ,
      grossValue: gross,
      transportCost: transport,
      storageCost: storage,
      netRealization: net,
      status: params.status || 'Offer Accepted',
      stepIndex: params.status === 'Produce Dispatched' ? 3 : 2,
      paymentStatus: params.paymentStatus || 'Processing',
      settlementDateEstimate: params.settlementDateEstimate || '2 Business Days (Simulated Direct DBT Escrow)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingNumber: `TRK-MH-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    this.transactions.unshift(newTx);
    return newTx;
  }

  public static createTransactionFromMatch(
    match: BuyerMatchItem,
    farmerId: string,
    farmerName: string,
    quantityQuintals: number
  ): TransactionRecord {
    const req = match.requirement;
    const net = match.netRealization;

    return this.createTransaction({
      farmerId,
      farmerName,
      farmerLocation: 'Murtizapur, Akola',
      buyerId: req.buyerId,
      buyerName: req.buyerName,
      businessName: req.businessName,
      crop: req.crop,
      quantityQuintals,
      qualityGrade: req.qualityRequired,
      agreedPricePerQ: req.offeredPrice,
      grossValue: net.grossValue,
      transportCost: net.transportCost,
      storageCost: net.storageCost,
      netRealization: net.netRealizationTotal,
      deliveryLocation: req.location,
      status: 'Offer Accepted',
      paymentStatus: 'Processing',
      settlementDateEstimate: '2 Business Days (Direct DBT Escrow)',
    });
  }

  public static advanceTransactionStep(id: string): TransactionRecord | undefined {
    const tx = this.transactions.find(t => t.id === id);
    if (!tx) return undefined;

    const steps: TransactionRecord['status'][] = [
      'Lot Created',
      'Buyer Matched',
      'Offer Accepted',
      'Produce Dispatched',
      'Delivered',
      'Paid',
    ];

    if (tx.stepIndex < steps.length - 1) {
      tx.stepIndex += 1;
      tx.status = steps[tx.stepIndex];
      if (tx.stepIndex === 5) {
        tx.paymentStatus = 'Paid';
        tx.settlementDateEstimate = 'Settled successfully via Direct DBT';
      } else if (tx.stepIndex >= 3) {
        tx.paymentStatus = 'Processing';
      }
      tx.updatedAt = new Date().toISOString();
    }

    return tx;
  }

  public static advanceStep(id: string): TransactionRecord | undefined {
    return this.advanceTransactionStep(id);
  }
}
