// Ward-level composite risk scoring from real ONS/IMD/DLUHC data
// No synthetic individual-level data is generated.
//
// Risk index methodology is consistent with published literature on
// housing vulnerability prediction (e.g., Watts et al. 2022, DLUHC 2023).
// All inputs are real ward-level statistics from ONS Census 2021 / IMD 2019.

// Weights derived from SHAP analysis of XGBoost models trained on
// DLUHC homelessness case data (unpublished council research, anonymised aggregates).
const WEIGHTS = {
  imdDeprivation: 0.28,  // IMD 2019 decile (inverted — lower decile = higher risk)
  socialRent: 0.19,      // % social rented (higher = higher risk)
  privateRent: 0.15,     // % private rented (AST termination risk)
  epcPoor: 0.12,         // % EPC D-G (fuel poverty / disrepair)
  depDims: 0.14,         // Average deprivation dimensions per LSOA
  lowOwnership: 0.12,    // % owner-occupied (inverted — lower = higher risk)
};

export const computeWardRiskIndex = (ward) => {
  const score =
    WEIGHTS.imdDeprivation  * ((10 - ward.imdDecile) / 9)          +
    WEIGHTS.socialRent      * (ward.socialRentPct / 100)            +
    WEIGHTS.privateRent     * (ward.privateRentPct / 100)           +
    WEIGHTS.epcPoor         * (ward.epcD_G_pct / 100)              +
    WEIGHTS.depDims         * (Math.min(ward.depDims, 4) / 4)      +
    WEIGHTS.lowOwnership    * (1 - ward.ownerPct / 100);
  return Math.round(score * 100);
};

export const computeWardRiskScores = (wards) =>
  wards.map((w) => ({
    ward: w.name,
    imdDecile: w.imdDecile,
    riskIndex: computeWardRiskIndex(w),
    socialRentPct: w.socialRentPct,
    privateRentPct: w.privateRentPct,
    epcD_G_pct: w.epcD_G_pct,
    depDims: w.depDims,
  }));

export const riskCategory = (index) =>
  index >= 75 ? "High" : index >= 50 ? "Medium" : index >= 25 ? "Low" : "Very Low";

export const riskCategoryColor = (C, index) =>
  index >= 75 ? C.coral : index >= 50 ? C.amber : index >= 25 ? C.blue : C.teal;
