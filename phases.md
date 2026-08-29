# AgriLink (SIH26132) - Phase Documentation Directory

This directory contains detailed technical specifications, workflows, architecture diagrams, and granular deliverables for each phase of the **Smart Farmer Market Linkage & Price Discovery Platform** (SIH Problem Statement SIH26132).

The platform is an AI-powered market intelligence and buyer-matching engine that answers one question for a farmer: *given my crop, quantity, location and quality, where and when should I sell to get the best expected net realization?*

---

## Phase Documentation Index

1. **Phase 0: Project Setup & Scope Lock** `[PLANNED]`
   *Repo layout (Next.js frontend / FastAPI backend / PostgreSQL), environment setup, synthetic data schema contracts, and freezing the 4-day "Must Build" scope vs. Future Scope (see Phase 12).*

2. **Phase 1: Synthetic Dataset & Data Layer** `[PLANNED]`
   *Market, buyer, farmer, logistics, storage, and historical price datasets (Akola/Washim/Amravati/Buldhana sample mandis). Seed scripts, Prototype Data Disclaimer, and the data-access API layer other phases depend on.*

3. **Phase 2: Farmer Dashboard & Profile** `[PLANNED]`
   *Farmer onboarding (location, crop, quantity, quality/grade, harvest date, storage availability, selling radius). "Ramesh Patil" demo persona used as the reference profile for all later phases.*

4. **Phase 3: Market Price Intelligence** `[PLANNED]`
   *Current/modal/min/max price display, nearby-market comparison table, arrival volume, and historical price charting (Recharts/Chart.js) across mandis for a selected crop.*

5. **Phase 4: AI Price Trend & Forecast** `[PLANNED]`
   *Basic time-series/regression forecasting model over the historical dataset producing a 7-day expected price range, trend direction, and confidence score. Outputs clearly labeled as *estimates*, not guarantees.*

6. **Phase 5: Buyer Marketplace & Verification** `[PLANNED]`
   *Buyer requirement postings (crop, quantity, quality, offer price, required-by date), verification status, reliability score, and payment-history fields (e.g. "ABC Foods Pvt Ltd - 91/100").*

7. **Phase 6: AI Buyer Matching & Quality Compatibility** `[PLANNED]`
   *Ranking engine scoring buyers against a farmer's lot on crop/quantity/quality/location/price/date/reliability/distance, producing a % match with a natural-language "why" explanation. Includes quality/moisture compatibility checks (green/red flag).*

8. **Phase 7: Logistics & Net Realization Calculator** `[PLANNED]`
   *Selling price − transport cost − storage cost = net realization, computed per option (mandi, buyer, hold). Core innovation layer: highest price ≠ highest profit.*

9. **Phase 8: Sell-vs-Store AI Recommendation Engine** `[PLANNED]`
   *Combines Phase 4 forecast + Phase 7 net realization + risk to recommend SELL NOW / HOLD / a specific buyer, with an LLM-generated plain-language justification. This is the platform's central intelligence and main dashboard screen.*

10. **Phase 9: FPO Aggregation** `[PLANNED]`
    *Bulk-lot formation: identifying nearby farmers/FPO members holding the same crop and combining their lots to meet a large buyer requirement (e.g. 5 farmers → 108 quintals vs. a 100-quintal order). Includes the FPO dashboard (total produce, matching demand, market opportunity).*

11. **Phase 10: Transaction Workflow & Payment Tracking (Simulated)** `[PLANNED]`
    *Matched → Accepted → Dispatched → Delivered → Paid status pipeline, simulated for the hackathon without real financial integration.*

12. **Phase 11: End-to-End Demo & Presentation Flow** `[PLANNED]`
    *Scripted judge-facing walkthrough: farmer login → crop/quantity entry → market comparison → buyer matching → net realization comparison → AI recommendation → FPO aggregation demo → transaction tracking. Target: complete story in a few minutes.*

13. **Phase 12: Future Scope & Production Hardening** `[FUTURE / OUT OF HACKATHON SCOPE]`
    *Real UPI payments/escrow, real logistics-provider APIs, live government/e-NAM data integration, Aadhaar authentication, real-time GPS tracking, multilingual voice assistant, computer-vision-based quality grading, real buyer KYC, and production deployment.*

---

## Notes

- Phases 0-11 correspond to the "Must Build" feature set for the 4-day build window.
- Phase 12 items are intentionally deferred so development time is spent on the decision-intelligence layer (forecasting, matching, net realization, sell/hold) that differentiates this platform from existing mandi-price and marketplace tools like e-NAM.
- Each phase folder (once created) should contain its own spec, data contract, and a short demo script consistent with the flow in Phase 11.
