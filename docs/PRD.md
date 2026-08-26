# Product Requirements Document (PRD)

## Smart Farmer Market Linkage & Price Discovery Platform

**Problem Statement ID:** SIH26132
**Project Type:** AI-powered Agricultural Market Intelligence & Decision Support Platform
**Target Users:** Farmers, FPOs, Buyers
**Primary Region:** Maharashtra, India
**Status:** Prototype / Hackathon MVP

---

## 1. Product Overview

The Smart Farmer Market Linkage & Price Discovery Platform is an AI-powered agricultural market intelligence and buyer-matching system designed to help farmers and Farmer Producer Organizations (FPOs) make better selling decisions.

Instead of simply displaying mandi prices, the platform combines:

* Market prices
* Buyer demand
* Farmer crop and quantity
* Quality requirements
* Transportation costs
* Storage costs
* Historical price trends
* Buyer reliability
* FPO aggregation opportunities

The system evaluates these factors and recommends **where, when, and to whom the farmer should sell their produce** to maximize expected net realization.

### One-Line Description

> An AI-powered agricultural market intelligence platform that helps Maharashtra farmers and FPOs decide where, when and to whom to sell their produce by combining market prices, buyer demand, logistics, storage and historical trends to maximize expected net realization.

---

# 2. Problem

Small farmers and FPOs often lack a complete picture of the best selling opportunity for their produce.

A farmer may know the price at the nearest mandi but may not know:

* Whether another nearby market offers a better price
* Which buyers currently need the crop
* What buyers are willing to pay
* What quality or grade is required
* Whether selling immediately or storing would be better
* How much transportation will cost
* Which buyers are reliable
* Whether nearby farmers can combine their produce to fulfil a larger order

Existing platforms provide parts of this information, but farmers still have to interpret it themselves.

The platform therefore focuses on the question:

> **“Given my crop, quantity, location and quality, where and when should I sell to get the best expected net realization?”**

---

# 3. Product Goals

## Primary Goals

1. Help farmers identify the most profitable selling option.
2. Compare nearby markets automatically.
3. Match farmers with relevant buyers.
4. Calculate expected net realization after transportation and storage costs.
5. Provide AI-assisted sell-now vs hold recommendations.
6. Enable FPOs to aggregate produce from multiple farmers.
7. Provide buyer reliability and verification information.
8. Provide transparent explanations for AI recommendations.

## Secondary Goals

1. Reduce manual market comparison.
2. Improve access to buyer demand information.
3. Reduce failed farmer-buyer matches caused by quantity or quality mismatches.
4. Demonstrate an end-to-end agricultural transaction workflow.
5. Create a scalable architecture that can later integrate real market and government data.

---

# 4. Target Users

## 4.1 Farmer

A farmer who wants to determine the best selling opportunity for their crop.

### Farmer needs

* Current market prices
* Nearby market comparison
* Buyer offers
* Buyer reliability
* Transportation costs
* Storage options
* Price trends
* Sell/hold recommendation
* Transaction tracking

---

## 4.2 Farmer Producer Organization (FPO)

An organization representing multiple farmers.

### FPO needs

* View available member produce
* Aggregate farmer lots
* Identify bulk buyer requirements
* Find matching buyers
* Track potential market opportunities
* Monitor pending transactions

---

## 4.3 Buyer

A business or organization looking to purchase agricultural produce.

### Buyer needs

* Post crop requirements
* Specify quantity
* Specify quality/grade
* Specify location
* Specify required delivery date
* Specify offered price
* Receive relevant farmer/FPO matches

---

# 5. Core Product Features

## 5.1 Farmer Profile

Farmers provide:

* Name
* Location
* Crop
* Quantity
* Quality/grade
* Expected harvest date
* Preferred selling radius
* Storage availability

### Example

```text
Farmer: Ramesh Patil
Location: Akola
Crop: Soybean
Quantity: 20 quintals
Quality: Grade A
Harvest: Ready
Storage: Available
```

---

# 6. Market Price Intelligence

The system displays:

* Current market price
* Modal price
* Minimum price
* Maximum price
* Historical prices
* Arrival volume
* Price trend
* Nearby market comparison

### Example

| Market   |    Price |
| -------- | -------: |
| Akola    | ₹5,000/q |
| Washim   | ₹5,150/q |
| Amravati | ₹5,080/q |
| Buldhana | ₹4,950/q |

The system should automatically compare these options instead of requiring the farmer to manually evaluate them.

---

# 7. Price Trend & Forecasting

The system uses historical market data to estimate potential future prices.

### Inputs

* Crop
* Market
* Date
* Modal price
* Minimum price
* Maximum price
* Arrival quantity

### Outputs

* Current price
* Expected price range
* Price trend
* Confidence score
* Sell-now vs wait comparison

### Example

```text
Current Price: ₹5,000/q

Expected 7-Day Range:
₹5,050 – ₹5,250

Trend:
Increasing

Confidence:
72%
```

Predictions must always be presented as **estimates rather than guaranteed prices**.

---

# 8. Buyer Marketplace

Buyers can publish purchase requirements.

### Buyer listing contains

* Buyer name
* Crop
* Required quantity
* Required quality
* Location
* Offered price
* Required date
* Verification status
* Reliability score

### Example

```text
Buyer A
Crop: Soybean
Required: 100 tonnes
Quality: Grade A
Location: Akola
Offer: ₹5,200/q
Required by: 5 September
```

---

# 9. AI Buyer Matching

The system ranks buyers according to their compatibility with a farmer's produce.

### Matching factors

* Crop compatibility
* Quantity compatibility
* Quality compatibility
* Location
* Offered price
* Required date
* Buyer reliability
* Transportation distance

### Example

```text
Buyer A
Match: 94%
Offer: ₹5,200/q
Distance: 35 km
Quality: Grade A
Status: Verified

Buyer B
Match: 82%
Offer: ₹5,150/q
Distance: 60 km
```

The system should also explain why a buyer received a higher ranking.

---

# 10. Net Realization Calculator

The platform's core intelligence should focus on **net realization rather than simply the highest selling price**.

### Formula

```text
Net Realization =
Selling Price
- Transportation Cost
- Storage Cost
- Other Applicable Costs
```

### Example

```text
Buyer A
Selling Price: ₹5,200/q
Transport: ₹150/q
Storage: ₹0

Net Realization: ₹5,050/q
```

This prevents the system from recommending an option solely because it has the highest listed price.

---

# 11. Sell vs Store Recommendation

The system compares two major strategies:

### Sell Now

```text
Current Price
- Transport Cost
- Other Costs
= Current Net Realization
```

### Store

```text
Expected Future Price
- Storage Cost
- Transport Cost
- Risk
= Expected Future Realization
```

The AI then recommends:

```text
SELL NOW
```

or

```text
HOLD
```

The recommendation should include a reason and risk level.

---

# 12. AI Recommendation Engine

The recommendation engine combines:

* Market prices
* Buyer offers
* Transportation costs
* Storage costs
* Historical trends
* Forecasted prices
* Buyer reliability
* Farmer requirements

### Example Recommendation

```text
Recommended Option:
Buyer A

Expected Realization:
₹5,050/q

Alternative:
Akola Mandi — ₹4,850/q

Hold Option:
₹5,130/q expected

Risk:
Medium
```

### Explainability

The AI should provide a human-readable explanation such as:

> Buyer A is recommended because its offer remains higher after transportation costs, while its quantity and quality requirements match the farmer's lot.

---

# 13. FPO Aggregation

The platform should allow multiple farmers to combine their produce to fulfil large buyer requirements.

### Example

```text
Farmer A → 15 q
Farmer B → 20 q
Farmer C → 25 q
Farmer D → 40 q

Total → 100 q

Buyer Requirement → 100 q
```

The system identifies compatible farmer lots and creates a potential bulk lot.

This is an important feature because individual small farmers may not have enough produce to fulfil large buyer orders.

---

# 14. Quality Matching

The system compares buyer quality requirements with farmer lot quality.

### Example

```text
Buyer Requirement:
Crop: Soybean
Grade: A
Moisture: <12%
Quantity: 100 q

Farmer Lot:
Crop: Soybean
Grade: A
Moisture: 11.5%
Quantity: 20 q

Result:
QUALITY COMPATIBLE
```

If requirements are not met:

```text
QUALITY MISMATCH

Reason:
Moisture requirement not satisfied.
```

---

# 15. Logistics Intelligence

The system accounts for transportation when evaluating selling options.

Instead of only showing:

```text
Buyer is 80 km away
```

the system should calculate:

```text
Selling Price
- Transport Cost
= Net Realization
```

The prototype may use simulated transportation data.

---

# 16. Buyer Verification & Reliability

Buyer profiles should contain:

* Verification status
* Business name
* Location
* Previous transactions
* Rating
* Required documents
* Payment history
* Reliability score

### Example

```text
ABC Foods Pvt Ltd

Verified Buyer

Reliability Score:
91/100
```

For the prototype, this information can be simulated.

---

# 17. Transaction Tracking

The platform should demonstrate the complete transaction lifecycle.

```text
Matched
   ↓
Accepted
   ↓
Quality Confirmed
   ↓
Transport Arranged
   ↓
Dispatched
   ↓
Delivered
   ↓
Payment Processing
   ↓
Paid
```

Actual financial transactions are not required for the MVP.

---

# 18. Payment Tracking

The prototype should simulate payment status.

### Example

```text
Transaction #1024

✓ Order Accepted
✓ Produce Dispatched
✓ Delivery Confirmed
🟡 Payment Processing

Amount:
₹1,02,000
```

---

# 19. Farmer Dashboard

The farmer dashboard is the primary user interface.

It should display:

* Farmer profile
* Crop information
* Quantity
* Current market prices
* Nearby markets
* Recommended buyers
* Net realization
* Sell/hold recommendation
* Price trends
* Active transactions

### Main Dashboard Example

```text
YOUR MARKET RECOMMENDATION

Soybean | 20 Quintals | Akola

BEST OPTION
Buyer A

Expected Realization:
₹5,050/q

Total Expected Value:
₹1,01,000

WHY?
✓ Good buyer price
✓ Low transport cost
✓ Quantity matched
✓ Quality requirements satisfied
✓ Buyer verified
```

---

# 20. FPO Dashboard

The FPO dashboard should display:

* Total available produce
* Crop-wise quantities
* Member farmers
* Buyer requirements
* Potential bulk orders
* Average market price
* Expected realization
* Pending transactions

### Example

```text
Soybean Available:
850 quintals

Matching Buyer Demand:
1,200 quintals

Potential Market Opportunity:
₹X
```

---

# 21. Data Model

The prototype will use synthetic/sample datasets.

## Market Dataset

```text
market_id
market_name
district
crop
date
min_price
max_price
modal_price
arrival_quantity
```

## Buyer Dataset

```text
buyer_id
buyer_name
location
crop
required_quantity
quality_required
offered_price
required_date
verification_status
reliability_score
```

## Farmer Dataset

```text
farmer_id
name
location
crop
quantity
quality
harvest_date
storage_available
```

## Logistics Dataset

```text
route_id
from_location
to_location
distance
estimated_transport_cost
vehicle_type
```

## Storage Dataset

```text
storage_id
location
capacity
available_capacity
storage_type
cost_per_day
```

## Historical Price Dataset

```text
date
crop
market
modal_price
arrival_quantity
```

---

# 22. Prototype Data Disclaimer

The hackathon prototype uses synthetic/sample datasets designed to simulate market prices, farmer lots, buyer demand, logistics and storage information.

These datasets are used only to demonstrate the platform's intelligence and workflow.

In a production deployment, the data layer can be replaced with authorized government, market, buyer and logistics data sources.

---

# 23. AI/ML Components

The platform uses AI/ML for three primary tasks.

## 23.1 Price Forecasting

```text
Historical Market Data
        ↓
Forecasting Model
        ↓
Expected Future Price
```

Potential approaches:

* Regression
* Time-series forecasting
* Random Forest
* XGBoost

---

## 23.2 Buyer Matching

```text
Farmer Requirements
        +
Buyer Requirements
        ↓
Matching Algorithm
        ↓
Compatibility Score
```

Potential factors:

* Crop
* Quantity
* Quality
* Location
* Price
* Required date
* Reliability

---

## 23.3 Decision Recommendation

```text
Market Data
+
Buyer Offers
+
Transport
+
Storage
+
Forecast
+
Risk
        ↓
Recommendation Engine
        ↓
Best Selling Option
```

An LLM can optionally convert the calculated recommendation into a natural-language explanation.

---

# 24. Product Differentiation

The platform should not be positioned as another mandi-price website.

### Existing Approach

```text
Farmer
  ↓
Search Market
  ↓
View Price
```

### Our Approach

```text
Farmer
  ↓
Crop + Quantity + Location + Quality
  ↓
Market Intelligence
  ↓
Buyer Matching
  ↓
Transport & Storage Analysis
  ↓
Net Realization
  ↓
Sell / Hold Recommendation
```

### Core Product Identity

> **Price Discovery → Buyer Matching → Net Realization → Decision**

---

# 25. MVP Scope

The following features are mandatory for the hackathon MVP.

### Must Build

* Farmer dashboard
* Farmer profile
* Crop/quantity/location input
* Market price comparison
* Historical price graph
* Price trend
* Basic price forecast
* Buyer marketplace
* Buyer requirements
* Buyer verification
* AI buyer matching
* Net realization calculator
* AI selling recommendation
* Sell vs hold comparison
* FPO aggregation demo
* Basic transaction tracking

---

# 26. Future Scope

The following features are intentionally outside the MVP.

* Real UPI payments
* Real escrow
* Real logistics APIs
* Real government API integrations
* Aadhaar authentication
* Real-time GPS tracking
* Blockchain
* Full multilingual voice assistant
* Advanced computer vision grading
* Real buyer KYC
* Production-scale deployment

These features can be added after validating the core product.

---

# 27. Technology Stack

## Frontend

* Next.js
* React
* Recharts / Chart.js

## Backend

* Python
* FastAPI

## Database

* PostgreSQL

## AI/ML

* Python
* XGBoost / Random Forest
* Regression / time-series forecasting
* Similarity-based buyer matching
* LLM for recommendation explanations

## Maps

* Mapbox / Leaflet

## Deployment

* Vercel
* Render / Railway
* Equivalent cloud infrastructure

---

# 28. System Architecture

```text
                    ┌─────────────┐
                    │   FARMER    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   BUYER     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────────┐
                    │  WEB APPLICATION │
                    └──────┬──────────┘
                           │
                    ┌──────▼──────┐
                    │  API SERVER  │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐    ┌────▼─────┐    ┌─────▼─────┐
    │Market Data│    │Buyer Data │    │Farmer Data│
    └─────┬─────┘    └────┬─────┘    └─────┬─────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │  AI ENGINE   │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
 ┌──────▼───────┐   ┌──────▼──────┐   ┌──────▼──────┐
 │Price Forecast│   │Buyer Matching│   │Sell/Hold    │
 │              │   │              │   │Analysis     │
 └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────────┐
                    │NET REALIZATION  │
                    └──────┬──────────┘
                           │
                    ┌──────▼──────────┐
                    │ RECOMMENDATION  │
                    └──────┬──────────┘
                           │
                    ┌──────▼──────────┐
                    │ USER DASHBOARD  │
                    └─────────────────┘
```

---

# 29. Key User Journey

## Farmer Journey

```text
Login
  ↓
Enter Crop Details
  ↓
Enter Quantity & Location
  ↓
View Nearby Markets
  ↓
View Matching Buyers
  ↓
Calculate Net Realization
  ↓
Compare Sell vs Hold
  ↓
Receive AI Recommendation
  ↓
Select Buyer
  ↓
Create Lot
  ↓
Track Transaction
```

---

# 30. Hackathon Demo Flow

The recommended demonstration should follow one farmer's complete journey.

### Step 1 — Login

```text
Farmer:
Ramesh Patil
```

### Step 2 — Enter Produce

```text
Crop: Soybean
Quantity: 20 quintals
Location: Akola
Quality: Grade A
```

### Step 3 — Market Comparison

Show nearby markets and prices.

### Step 4 — Buyer Matching

Show three relevant buyers.

### Step 5 — Net Realization

Compare:

```text
Akola Mandi     ₹4,850/q
Washim Mandi    ₹4,900/q
Buyer A         ₹5,050/q
Buyer B         ₹4,980/q
Hold 7 Days     ₹5,130/q*
```

### Step 6 — AI Recommendation

The system recommends the best option and explains why.

### Step 7 — FPO Aggregation

Demonstrate:

```text
Buyer Requirement: 100 quintals

Farmer A: 15 q
Farmer B: 20 q
Farmer C: 25 q
Farmer D: 40 q

Total: 100 q
```

### Step 8 — Transaction

Demonstrate:

```text
Matched
→ Accepted
→ Delivered
→ Paid
```

---

# 31. Success Metrics

The prototype should be evaluated using:

### Recommendation Quality

* Correct calculation of net realization
* Relevant buyer ranking
* Transparent recommendation reasoning

### User Experience

* Time required to identify the best selling option
* Number of manual comparisons required
* Ease of understanding recommendations

### Matching

* Percentage of compatible farmer-buyer matches
* Quantity compatibility
* Quality compatibility

### FPO Aggregation

* Number of farmer lots successfully combined
* Number of bulk buyer requirements fulfilled in simulation

### Technical

* API response time
* Forecast generation time
* Matching computation time
* System reliability

---

# 32. Non-Functional Requirements

## Performance

The dashboard should load quickly and recommendation calculations should complete within a few seconds for the prototype dataset.

## Scalability

The backend should be designed so that synthetic datasets can later be replaced by larger production datasets.

## Security

* Authentication for users
* Role-based access for Farmer, Buyer and FPO
* Secure API endpoints
* Protection of user and transaction data

## Explainability

AI recommendations should provide understandable reasons rather than only presenting a score.

## Reliability

The system should gracefully handle missing or incomplete market, buyer or logistics information.

---

# 33. Risks & Limitations

### Price Forecast Risk

Predicted prices are estimates and may not reflect actual future market prices.

### Synthetic Data

The hackathon prototype uses simulated data rather than claiming live government data connectivity.

### Buyer Reliability

Prototype reliability scores are simulated and should not be treated as real-world verification.

### Transportation

Prototype transportation costs are estimated rather than guaranteed logistics quotes.

### Market Volatility

Agricultural prices can change rapidly due to supply, demand, weather and other factors.

---

# 34. Product Principles

1. **Highest price is not always highest profit.**
2. **Recommendations must consider costs.**
3. **AI should support decisions, not blindly make them.**
4. **Recommendations should be explainable.**
5. **Buyer matching should consider quality and quantity, not only price.**
6. **Small farmers should benefit from aggregation.**
7. **Prototype data must be clearly labelled as synthetic.**

---

# 35. Final Product Vision

The long-term vision is to create an intelligent agricultural decision-support layer that sits between farmers, markets, buyers and logistics providers.

Instead of forcing farmers to manually interpret fragmented information, the platform combines the relevant data and provides a simple answer:

> **Where should I sell, when should I sell, and which buyer gives me the best expected return?**

The core product loop is:

```text
PRICE DISCOVERY
       ↓
BUYER MATCHING
       ↓
LOGISTICS ANALYSIS
       ↓
NET REALIZATION
       ↓
SELL / HOLD DECISION
       ↓
TRANSACTION
```

This transforms agricultural market information from a passive data source into an actionable decision-support system.
