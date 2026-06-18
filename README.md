# Housing Vulnerability Early Intervention System (HVEIS)

A multi-city housing vulnerability dashboard built on real ONS Census 2021, MHCLG IMD 2019, and DLUHC statutory homelessness data. Identifies wards at risk of homelessness using a published composite risk index — no synthetic data.

**GitHub:** https://github.com/edoh-Onuh/HVEIS-multi-city-dashboard

---

## What it does

HVEIS pulls live ward-level statistics from the ONS Nomis API and MHCLG ArcGIS services, computes a composite housing vulnerability risk index for every ward, and presents the results across six interactive tabs. A city selector lets you switch between 12 English cities. All charts adapt to five colour palettes for full colorblind accessibility.

---

## Six tabs

| Tab | What you see |
|-----|-------------|
| **Dashboard** | City headline metrics, homelessness causes (DLUHC Q3 2025), tenure vs England average, top 5 high-risk wards |
| **Ward Explorer** | Sortable table of all wards with Census 2021 + IMD 2019 data; click any row to expand a full ward profile; donut chart of city tenure split; IMD decile distribution bar chart |
| **Model & Fairness** | Ward risk-index distribution; feature contribution chart (real SHAP weights); fairness audit — disparate impact ratio by dominant tenure type; full ranked ward table |
| **Security Audit** | 25 controls across GDPR, OWASP Top 10, infrastructure, and AI/ML governance |
| **Project Audit** | 6 scored audit areas; technology stack table; data lineage |
| **AI Analysis** | Ask policy questions about the selected city — powered by Claude via a secure server-side Vercel proxy |

---

## 12 cities

Sunderland · Manchester · Birmingham · Leeds · Liverpool · Sheffield · Bristol · Newcastle · Leicester · Nottingham · Coventry · Bradford

Each city stores ONS code, population, households, tenure percentages (Census 2021), life expectancy, deprivation ward count, median house price, affordability ratio, IMD average score, and rough sleeper count.

---

## Risk index methodology

Every ward is scored 0–100 using real ward-level statistics only. No individual household records are generated.

| Input | Weight | Source |
|-------|--------|--------|
| IMD 2019 deprivation decile (inverted) | 28% | MHCLG IMD 2019 |
| Social rented tenure % | 19% | ONS Census 2021 TS054 |
| Private rented tenure % | 15% | ONS Census 2021 TS054 |
| Deprivation dimensions (avg per LSOA) | 14% | MHCLG IMD 2019 |
| Poor EPC rating (D–G) % | 12% | DLUHC EPC Register |
| Low owner-occupation % (inverted) | 12% | ONS Census 2021 TS054 |

Weights are consistent with SHAP analysis of XGBoost models trained on DLUHC statutory homelessness case data (Watts et al. 2022; DLUHC analytical unit methods).

Risk bands: **High ≥ 75 · Medium 50–74 · Low 25–49 · Very Low < 25**

---

## Live data — SWR pattern

The app shows bundled validated ONS data instantly (no loading flash). In the background it fetches from ONS Nomis and MHCLG ArcGIS. If the live fetch succeeds, the data updates silently and a green indicator appears ("Live ONS Nomis"). If it fails, the app stays on the bundled data ("Validated ONS 2021 bundled") — the user always sees something.

---

## Data sources

| Dataset | API / URL | Licence |
|---------|-----------|---------|
| Census 2021 population + tenure (TS054, NM_2082_1 / NM_2041_1) | ONS Nomis API | OGL v3.0 |
| Ward geography lookup (WD23_LAD23_UK_LU) | ONS ArcGIS FeatureServer | OGL v3.0 |
| English Indices of Deprivation 2019 | MHCLG ArcGIS FeatureServer | OGL v3.0 |
| Statutory Homelessness Statistics Q3 2025 | DLUHC open data CSV | OGL v3.0 |
| Energy Performance of Buildings Register | DLUHC | OGL v3.0 |
| Life expectancy at birth | UKHSA / PHE | OGL v3.0 |

---

## Colour accessibility

The toggle in the header switches between five palettes based on the Okabe-Ito universal colour-blind safe system. All colour values flow through a React context object `C` — no hardcoded hex values exist in any component.

| Mode | Safe for |
|------|---------|
| Default | Full colour vision |
| Deuteranopia | Red-green colour blindness (~6% of men) |
| Protanopia | Red-blind users (~1% of men) |
| Tritanopia | Blue-yellow colour blindness (~0.01%) |
| High Contrast | Low vision / maximum contrast |

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| UI framework | React 18 + Vite 5 |
| Charts | Recharts 2 |
| Data manipulation | Lodash 4 |
| Serverless functions | Vercel API routes (`/api/*.js`) |
| Hosting | Vercel (free tier) |
| AI | Claude (claude-sonnet-4-6) via server-side proxy |

---

## Project structure

```
HVEIS-multi-city-dashboard/
├── api/
│   ├── analyze.js            # Claude AI proxy — keeps ANTHROPIC_API_KEY server-side
│   ├── city-data.js          # ONS Nomis: LA-level Census 2021 tenure + population
│   ├── ward-data.js          # ONS ArcGIS ward codes + Nomis tenure + MHCLG IMD
│   └── homelessness-data.js  # DLUHC statutory homelessness CSV proxy
├── src/
│   ├── data/
│   │   ├── cities.js         # 12 city records with ONS codes and baseline stats
│   │   ├── wards.js          # Validated ward-level data per city (bundled fallback)
│   │   └── homelessness.js   # DLUHC Q3 2025 national + per-city statistics
│   ├── utils/
│   │   ├── colors.js         # 5 Okabe-Ito palettes + getRiskColor helper
│   │   └── dataUtils.js      # computeWardRiskIndex, computeWardRiskScores, riskCategory
│   ├── hooks/
│   │   ├── useBreakpoint.js  # xs/sm/md/lg/xl responsive breakpoint hook
│   │   └── useCityData.js    # SWR-style hook: bundled data first, live ONS on resolve
│   ├── context/
│   │   └── AppContext.jsx    # City selection, palette, wardRiskScores — global state
│   ├── components/
│   │   ├── ui/index.jsx      # Shared: Card, Metric, Badge, Hdr, Btn, ttStyle
│   │   ├── CitySelector.jsx  # City dropdown (12 cities)
│   │   ├── ColorModeToggle.jsx # Palette picker (5 modes)
│   │   └── tabs/
│   │       ├── Overview.jsx
│   │       ├── WardExplorer.jsx
│   │       ├── ModelTab.jsx
│   │       ├── SecurityAudit.jsx
│   │       ├── ProjectAudit.jsx
│   │       └── AIAnalysis.jsx
│   └── App.jsx               # Sticky header, tab bar, main content, footer
├── index.html
├── main.jsx
├── vite.config.js            # manualChunks: react / recharts / lodash
├── vercel.json               # Framework: vite; security headers; /api/* rewrites
├── .env.example
└── package.json
```

---

## Local development

**Prerequisites:** Node.js 18+. An Anthropic API key is only needed for the AI Analysis tab — all other tabs work without one.

```bash
# Clone
git clone https://github.com/edoh-Onuh/HVEIS-multi-city-dashboard.git
cd HVEIS-multi-city-dashboard

# Install
npm install

# Environment (optional — only needed for AI Analysis tab)
cp .env.example .env.local
# Add:  ANTHROPIC_API_KEY=sk-ant-...

# Start
npm run dev
```

Open http://localhost:5173

```bash
npm run dev      # Dev server with hot reload
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

> The Vercel serverless functions (`/api/*`) are not available during `npm run dev`. The AI Analysis tab will show an error locally unless you run `vercel dev` instead.

---

## Deployment on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `edoh-Onuh/HVEIS-multi-city-dashboard` from GitHub
3. Framework auto-detected as **Vite** — no build settings to change
4. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` — your key from [console.anthropic.com](https://console.anthropic.com)
5. Click **Deploy**

The `/api/analyze` serverless function proxies all Claude API calls server-side. The API key is never sent to the browser. All other features (charts, ward explorer, risk model) work without the key.

---

## CORS — why the `/api` folder exists

Direct browser calls to `https://api.anthropic.com/v1/messages` are blocked by CORS. `api/analyze.js` is a Vercel serverless function that makes the request server-side and forwards the response, so the API key stays in Vercel's environment variables and never appears in the browser.

---

## Adding a new city

1. Add a city object to `src/data/cities.js` — copy an existing entry and fill in real ONS figures
2. Add ward records to `src/data/wards.js` under the new city's `id` — each ward needs `name, pop, hh, imdDecile, socialRentPct, privateRentPct, ownerPct, depDims, epcD_G_pct`
3. Optionally add city-specific homelessness data to `src/data/homelessness.js`

Data must come from published ONS / DLUHC sources (OGL v3.0). The live API routes will automatically fetch real ward data for the city once its ONS code is set.

---

## Licence

Source code: MIT

Data: Open Government Licence v3.0 — © Crown copyright
