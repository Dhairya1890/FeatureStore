# FeatureHub Landing Page

Production-ready Vite + React landing page for FeatureHub, a production-grade ML feature store. Styled with Tailwind CSS matching the dark-themed design with purple accents from the Stitch reference.

## Project Structure

```
featurehub-landing/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Fixed blur header, text logo, hardcoded GitHub SVG icon
│   │   ├── Hero.jsx                 # Full viewport hero, live stat chips with skeleton loaders
│   │   ├── WhatItSolves.jsx         # 3 ML failure modes + interactive topology
│   │   ├── ArchitectureDiagram.jsx  # Inline SVG diagram (Sources -> FeatureHub -> Training/Inference)
│   │   ├── DemoStrip.jsx            # Live query sandbox, latency badge, syntax highlighted JSON
│   │   ├── NavCards.jsx             # 2x2 grid (Grafana, Docs, Flower, Locust) with purple hover
│   │   ├── HowItWorks.jsx           # 3-column architectural decision matrix
│   │   └── Footer.jsx               # Author, tech stack, and GitHub repo link
│   ├── hooks/
│   │   └── useFeatureHub.js         # useSystemStats, useOnlineFeatures, useFeatureRegistry
│   ├── config.js                    # Single source of truth for URLs and constants
│   ├── App.jsx                      # Main app assembling sections and ambient glow
│   └── main.jsx                     # Entrypoint
├── index.html                       # Fonts, dark theme, smooth scroll behavior
├── package.json
├── vite.config.js
└── tailwind.config.js               # Design tokens matching Stitch specification
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

Runs on [http://localhost:5173](http://localhost:5173).

### 3. Production Build

```bash
npm run build
npm run preview
```
