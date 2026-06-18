# Housing Vulnerability Early Intervention System (HVEIS)

A data-driven dashboard for identifying and analysing housing vulnerability across English cities, built on real ONS Census 2021, MHCLG IMD 2019, and DLUHC statutory homelessness statistics.

## Live Demo

Deploy to Vercel in one click — see [Deployment](#deployment) below.

## Features

| Feature | Description |
|---------|-------------|
| **12 English Cities** | Sunderland, Manchester, Birmingham, Leeds, Liverpool, Sheffield, Bristol, Newcastle, Leicester, Nottingham, Coventry, Bradford |
| **Real ONS Data** | Census 2021 tenure, IMD 2019 deprivation, DLUHC homelessness statistics — all OGL v3.0 |
| **Ward Explorer** | Interactive ward-level data with sortable table and click-to-expand profiles |
| **ML Model & Fairness** | XGBoost risk scoring with SHAP feature importance and Fairlearn disparate impact audit |
| **Security Audit** | 25 controls across GDPR, OWASP Top 10, infrastructure, and AI/ML categories |
| **AI Analysis** | Ask policy questions about city data — powered by Claude claude-sonnet-4-6 via secure server-side proxy |
| **5 Colour Modes** | Default · Deuteranopia · Protanopia · Tritanopia · High Contrast (Okabe-Ito palette) |
| **Fully Responsive** | Optimised for mobile, tablet, and desktop |

## Colour Accessibility

The toggle in the top-right corner switches between five colour palettes:

- **Default** — Dark theme with teal/amber/coral accents
- **Deuteranopia** — Safe for red-green colour blindness (~6% of men) — uses Okabe-Ito blue/orange
- **Protanopia** — Safe for red-blind users (~1% of men) — same Okabe-Ito palette
- **Tritanopia** — Safe for blue-yellow colour blindness (~0.01%) — uses green/vermillion
- **High Contrast** — Maximum contrast for low vision users

All palettes use the [Okabe-Ito](https://jfly.uni-koeln.de/color/) universal colour-blind safe palette as their base.

## Data Sources

| Dataset | Source | Licence |
|---------|--------|---------|
| Census 2021 — Population, Tenure (TS054) | ONS, England and Wales | OGL v3.0 |
| English Indices of Deprivation 2019 | MHCLG | OGL v3.0 |
| Statutory Homelessness Statistics Q3 2025 | DLUHC | OGL v3.0 |
| Energy Performance of Buildings Register | DLUHC | OGL v3.0 |
| Life Expectancy at Birth | UKHSA / PHE | OGL v3.0 |

## Local Development

### Prerequisites

- Node.js 18+ (download from [nodejs.org](https://nodejs.org))
- An Anthropic API key (only needed for the AI Analysis tab)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/housing-vulnerability.git
cd housing-vulnerability

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** Without an API key, all features work except the AI Analysis tab.

### Available Scripts

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

## Deployment

### Vercel (Recommended — Free Tier)

1. Push this repository to GitHub (see [GitHub Setup](#github-setup))
2. Go to [vercel.com](https://vercel.com) and click **New Project**
3. Import your GitHub repository
4. In **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` → your key from [console.anthropic.com](https://console.anthropic.com)
5. Click **Deploy**

Vercel auto-detects Vite and uses the `vercel.json` configuration included in this repo. The `/api/analyze` serverless function runs server-side — your API key is never exposed to the browser.

### Manual Build

```bash
npm run build
# Outputs to dist/ — serve with any static host
```

## GitHub Setup

```bash
git init
git add .
git commit -m "Initial commit: HVEIS multi-city dashboard"
gh repo create housing-vulnerability --public --push
```

Or manually on [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/housing-vulnerability.git
git branch -M main
git push -u origin main
```

## Project Structure

```
housing-vulnerability/
├── api/
│   └── analyze.js              # Vercel serverless proxy for Anthropic API
├── src/
│   ├── data/
│   │   ├── cities.js           # City-level ONS data for 12 English cities
│   │   ├── wards.js            # Ward-level data per city
│   │   └── homelessness.js     # DLUHC homelessness statistics
│   ├── utils/
│   │   ├── colors.js           # Colour palettes incl. 4 colorblind modes
│   │   └── dataUtils.js        # Seeded synthetic household generation
│   ├── hooks/
│   │   └── useBreakpoint.js    # Responsive breakpoint hook
│   ├── context/
│   │   └── AppContext.jsx      # Global state: city selection, colour mode
│   ├── components/
│   │   ├── ui/                 # Shared UI: Card, Metric, Badge, Btn, Hdr
│   │   ├── CitySelector.jsx    # City dropdown
│   │   ├── ColorModeToggle.jsx # Accessibility colour mode picker
│   │   └── tabs/
│   │       ├── Overview.jsx
│   │       ├── WardExplorer.jsx
│   │       ├── ModelTab.jsx
│   │       ├── SecurityAudit.jsx
│   │       ├── ProjectAudit.jsx
│   │       └── AIAnalysis.jsx
│   └── App.jsx                 # Main app shell
├── index.html
├── main.jsx                    # Entry point
├── vite.config.js
├── vercel.json
├── .env.example
└── package.json
```

## Adding a New City

1. Add the city object to `src/data/cities.js` — follow the existing schema
2. Add ward-level data to `src/data/wards.js` under the city's `id` key
3. (Optional) Add city-specific homelessness data to `src/data/homelessness.js`

All data must be from published ONS/DLUHC sources and comply with OGL v3.0.

## Technical Notes

### CORS Fix

The original dashboard called the Anthropic API directly from the browser, which fails due to CORS. The `/api/analyze.js` Vercel serverless function proxies the request server-side, keeping the API key secure in environment variables.

### Synthetic Household Data

The 5% stratified household sample is generated deterministically from real ward-level statistics using a seeded PRNG. The same seed for a given city always produces the same dataset. This is for demonstration purposes — no real individual data is used or stored.

### Colour Blindness

Chart colours are derived from the active palette context; no hardcoded hex values exist in components. The Okabe-Ito palette was chosen because it is safe for all three main forms of colour vision deficiency simultaneously.

## Licence

Source code: [MIT](LICENSE)

Data: Open Government Licence v3.0 — © Crown copyright
