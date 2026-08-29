# 🌾 FasalMitr (KrishiLink AI)
### Smart Farmer Market Linkage & Price Discovery Platform

> **SIH Problem Statement ID:** SIH26132  
> **Target Region:** Maharashtra, India (Akola, Washim, Amravati, Buldhana & surrounds)  
> **Core Concept:** Highest Selling Price ≠ Highest Profit. Focus on **Net Realization**.

---

## 📌 Executive Summary

**FasalMitr** is an AI-powered agricultural market intelligence and buyer-matching decision platform built for farmers, Farmer Producer Organizations (FPOs), and institutional buyers. 

Traditional market information portals display raw mandi prices without accounting for transportation, storage, quality deductions, or temporal price trends. FasalMitr answers the fundamental question for a farmer:

> **"Given my crop, quantity, location, and quality grade, where, when, and to whom should I sell to maximize my net realization?"**

---

## ✨ Key Features & Capabilities

### 1. 💡 Net Realization Calculator (`Net = Price - Transport - Storage`)
- Calculates actual net profit instead of gross selling price.
- Factors in distance-based logistics rates, vehicle capacities, and daily warehouse storage fees.
- Prevents farmers from traveling further for marginally higher prices that get wiped out by transport costs.

### 2. 🤖 AI Sell-vs-Hold Temporal Intelligence
- Powered by **Google Gemini AI**, providing 7-day price movement estimates, confidence scores, and trend direction (Increasing / Stable / Decreasing).
- Evaluates risk vs. reward of holding produce in warehouses versus selling immediately.
- Delivers transparent, explainable recommendations in plain language (English & regional support).

### 3. 🎯 Intelligent Buyer Matching & Quality Compatibility
- Matches farmer crop lots with verified buyers based on crop type, volume, grade (Grade A/B), and moisture levels (e.g., `< 12%`).
- Ranks buyer offers by compatibility score (%) and net profit margin.
- Generates natural-language justifications explaining why a specific buyer is recommended.

### 4. 🚜 FPO Collective Produce Aggregation
- Combines smallholder produce lots (e.g., 5 farmers with 15–25 quintals each) into unified bulk orders (e.g., 100+ quintals).
- Unlocks bulk buyer pricing and institutional contracts previously inaccessible to individual small farmers.
- Dedicated **FPO Dashboard** to monitor member inventory and aggregate demand.

### 5. 🗺️ Spatial Market Intelligence & Interactive Map
- Real-time comparison across regional mandis (Akola, Washim, Amravati, Buldhana).
- Visualizes buyers, storage warehouses, and mandis on an interactive map.

### 6. 📜 End-to-End Transaction Tracker & Escrow Workflow
- Tracks order lifecycle: `Matched` → `Offer Accepted` → `Quality Confirmed` → `Dispatched` → `Delivered` → `Payment Processing (DBT / Escrow)`.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript |
| **Build Tool & Bundler** | Vite |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **Data Visualization** | Recharts, Motion (Framer Motion) |
| **AI / Intelligence Engine** | Google Gemini API (`@google/genai`) |
| **Database & Backend** | Supabase JS Client, Express.js |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** or **bun**

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Eclipse1911/fasalMitra.git
   cd fasalMitra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📁 Repository Structure

```
FasalMitr/
├── src/
│   ├── components/
│   │   ├── FarmerDashboard.tsx        # Farmer primary overview
│   │   ├── MarketIntelligence.tsx     # Mandi price comparisons & trend charts
│   │   ├── NetRealizationCalculator.tsx # Net profit breakdown
│   │   ├── BuyerMarketplace.tsx       # Buyer listings & match scoring
│   │   ├── SellVsHoldAnalysis.tsx     # Temporal sell vs store AI recommendations
│   │   ├── FpoAggregationView.tsx     # FPO bulk lot aggregation engine
│   │   ├── TransactionTracker.tsx     # Order status & payment pipeline
│   │   ├── InteractiveMap.tsx         # Spatial mandi & buyer map
│   │   ├── AdminDashboard.tsx         # Macro state & market analytics
│   │   ├── MyProduceView.tsx          # Produce lot management
│   │   └── DemoTourModal.tsx          # 11-step interactive evaluator tour
│   ├── services/
│   │   ├── recommendationService.ts   # Core decision intelligence
│   │   ├── matchingService.ts         # Buyer-farmer matching algorithm
│   │   ├── marketService.ts           # Market price & trend data handler
│   │   ├── transactionService.ts      # Transaction ledger state
│   │   └── supabaseClient.ts          # Supabase client initialization
│   ├── data/
│   │   └── sampleData.ts              # Synthetic crop, market & buyer datasets
│   ├── types.ts                       # TypeScript interfaces
│   ├── App.tsx                        # Main application router & state manager
│   └── main.tsx                       # React DOM entry point
├── docs/
│   └── PRD.md                         # Detailed Product Requirements Document
├── phases.md                          # Phase-wise feature development roadmap
└── package.json
```

---

## 📊 Prototype Data Disclaimer

*This repository contains synthetic/sample datasets designed to simulate regional market prices, buyer requirements, transportation distances, and warehouse storage rates for Maharashtra. In a production environment, the data service layer seamlessly connects to live e-NAM, Agmarknet, and government market feeds.*

---

## 📄 License

This project is developed for **SIH Problem Statement SIH26132**. All rights reserved.
