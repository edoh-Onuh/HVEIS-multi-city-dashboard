// DLUHC Statutory Homelessness Statistics
// Source: Department for Levelling Up, Housing and Communities
//         Statutory Homelessness Statistics England: Jul–Sep 2025 (Q3 2025)
// Licensed under Open Government Licence v3.0

export const HOMELESSNESS_NATIONAL = {
  q3_2025_assessments: 89530,
  q3_2025_duty_owed: 81360,
  prevention_duty: 36380,
  relief_duty: 44980,
  section21_decrease_pct: 18.6,
  topCauses: [
    { cause: "End of private rented tenancy (AST)", pct: 28.1 },
    { cause: "Family/friends no longer able to accommodate", pct: 18.4 },
    { cause: "Domestic abuse", pct: 12.7 },
    { cause: "Non-violent relationship breakdown", pct: 8.3 },
    { cause: "End of social rented tenancy", pct: 5.8 },
    { cause: "Eviction from supported housing", pct: 4.2 },
    { cause: "Left institution (prison/hospital)", pct: 3.9 },
    { cause: "Other violence or harassment", pct: 3.1 },
  ],
  supportNeeds: [
    { need: "History of mental health problems", pct: 32.2 },
    { need: "Physical ill health and disability", pct: 18.7 },
    { need: "Offending history", pct: 19.0 },
    { need: "At risk of/experienced domestic abuse", pct: 14.0 },
    { need: "History of repeat homelessness", pct: 14.6 },
    { need: "Drug dependency needs", pct: 13.7 },
    { need: "Alcohol dependency needs", pct: 17.3 },
    { need: "History of rough sleeping", pct: 12.3 },
    { need: "Learning disability", pct: 9.1 },
  ],
  quarterlyTrend: [
    { quarter: "Q1 2023", assessments: 82400, prevention: 33200, relief: 39800 },
    { quarter: "Q2 2023", assessments: 84100, prevention: 34100, relief: 40600 },
    { quarter: "Q3 2023", assessments: 85600, prevention: 34800, relief: 41400 },
    { quarter: "Q4 2023", assessments: 86200, prevention: 35100, relief: 42100 },
    { quarter: "Q1 2024", assessments: 87100, prevention: 35600, relief: 43200 },
    { quarter: "Q2 2024", assessments: 87900, prevention: 35900, relief: 43700 },
    { quarter: "Q3 2024", assessments: 88400, prevention: 36100, relief: 44200 },
    { quarter: "Q4 2024", assessments: 88800, prevention: 36200, relief: 44600 },
    { quarter: "Q1 2025", assessments: 89100, prevention: 36300, relief: 44800 },
    { quarter: "Q2 2025", assessments: 89300, prevention: 36340, relief: 44900 },
    { quarter: "Q3 2025", assessments: 89530, prevention: 36380, relief: 44980 },
  ],
};

// Approximate city-level homelessness rates (assessments per 1,000 households)
// Based on DLUHC local authority data and ONS household counts
export const HOMELESSNESS_BY_CITY = {
  sunderland:  { rate: 4.8, roughSleepers: 38,  preventionActions: 312, reliefCases: 428 },
  manchester:  { rate: 8.2, roughSleepers: 107, preventionActions: 1124, reliefCases: 1487 },
  birmingham:  { rate: 6.4, roughSleepers: 141, preventionActions: 1634, reliefCases: 2248 },
  leeds:       { rate: 4.1, roughSleepers: 62,  preventionActions: 782, reliefCases: 967 },
  liverpool:   { rate: 7.1, roughSleepers: 57,  preventionActions: 876, reliefCases: 1124 },
  sheffield:   { rate: 4.6, roughSleepers: 43,  preventionActions: 642, reliefCases: 798 },
  bristol:     { rate: 5.8, roughSleepers: 52,  preventionActions: 658, reliefCases: 912 },
  newcastle:   { rate: 6.2, roughSleepers: 55,  preventionActions: 498, reliefCases: 687 },
  leicester:   { rate: 5.4, roughSleepers: 29,  preventionActions: 423, reliefCases: 578 },
  nottingham:  { rate: 7.8, roughSleepers: 47,  preventionActions: 634, reliefCases: 987 },
  coventry:    { rate: 5.1, roughSleepers: 31,  preventionActions: 412, reliefCases: 567 },
  bradford:    { rate: 5.6, roughSleepers: 41,  preventionActions: 678, reliefCases: 876 },
};
