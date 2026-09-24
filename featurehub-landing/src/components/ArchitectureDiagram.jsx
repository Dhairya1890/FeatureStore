import React from 'react';

export default function ArchitectureDiagram() {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-surface-container-lowest/60 border border-outline-variant p-2 sm:p-4">
      <svg
        viewBox="0 0 860 490"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-full select-none"
        aria-label="FeatureHub Architecture Flow Diagram"
      >
        <defs>
          {/* Subtle Glow Filter for FeatureHub Center Box */}
          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#a078ff" floodOpacity="0.45" />
          </filter>

          <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.5" />
          </filter>

          {/* Gradients */}
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#23005c" />
            <stop offset="100%" stopColor="#1c2024" />
          </linearGradient>

          <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#262a2f" />
            <stop offset="100%" stopColor="#181c20" />
          </linearGradient>

          {/* Arrow Markers */}
          <marker
            id="arrowDown"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#958ea0" />
          </marker>

          <marker
            id="arrowLeftPurple"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#d0bcff" />
          </marker>

          <marker
            id="arrowRightGreen"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#6cffbf" />
          </marker>
        </defs>

        {/* ---------------- 1. TOP TIER: 4 DATA SOURCES ---------------- */}
        {/* Source 1: User Events */}
        <g id="source-user-events" filter="url(#cardShadow)">
          <rect x="25" y="20" width="180" height="64" rx="8" fill="url(#cardGrad)" stroke="#494454" strokeWidth="1" />
          <circle cx="45" cy="42" r="5" fill="#a078ff" />
          <text x="58" y="40" fill="#e0e3e8" fontSize="13" fontWeight="600" fontFamily="'Geist', sans-serif">User Events</text>
          <text x="58" y="58" fill="#958ea0" fontSize="10.5" fontFamily="'JetBrains Mono', monospace">Kafka · Clickstream</text>
        </g>

        {/* Source 2: Transactions */}
        <g id="source-transactions" filter="url(#cardShadow)">
          <rect x="235" y="20" width="180" height="64" rx="8" fill="url(#cardGrad)" stroke="#494454" strokeWidth="1" />
          <circle cx="255" cy="42" r="5" fill="#a078ff" />
          <text x="268" y="40" fill="#e0e3e8" fontSize="13" fontWeight="600" fontFamily="'Geist', sans-serif">Transactions</text>
          <text x="268" y="58" fill="#958ea0" fontSize="10.5" fontFamily="'JetBrains Mono', monospace">PostgreSQL CDC · OLTP</text>
        </g>

        {/* Source 3: Product Catalog */}
        <g id="source-product-catalog" filter="url(#cardShadow)">
          <rect x="445" y="20" width="180" height="64" rx="8" fill="url(#cardGrad)" stroke="#494454" strokeWidth="1" />
          <circle cx="465" cy="42" r="5" fill="#a078ff" />
          <text x="478" y="40" fill="#e0e3e8" fontSize="13" fontWeight="600" fontFamily="'Geist', sans-serif">Product Catalog</text>
          <text x="478" y="58" fill="#958ea0" fontSize="10.5" fontFamily="'JetBrains Mono', monospace">Inventory · Metadata</text>
        </g>

        {/* Source 4: External APIs */}
        <g id="source-external-apis" filter="url(#cardShadow)">
          <rect x="655" y="20" width="180" height="64" rx="8" fill="url(#cardGrad)" stroke="#494454" strokeWidth="1" />
          <circle cx="675" cy="42" r="5" fill="#a078ff" />
          <text x="688" y="40" fill="#e0e3e8" fontSize="13" fontWeight="600" fontFamily="'Geist', sans-serif">External APIs</text>
          <text x="688" y="58" fill="#958ea0" fontSize="10.5" fontFamily="'JetBrains Mono', monospace">Scores · Third-party</text>
        </g>

        {/* ---------------- 2. ARROWS DOWN FROM SOURCES ---------------- */}
        {/* Line 1 */}
        <path d="M 115 84 L 115 130 Q 115 145 160 145 L 290 145" stroke="#494454" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        {/* Line 2 */}
        <path d="M 325 84 L 325 145" stroke="#494454" strokeWidth="1.5" fill="none" />
        {/* Line 3 */}
        <path d="M 535 84 L 535 145" stroke="#494454" strokeWidth="1.5" fill="none" />
        {/* Line 4 */}
        <path d="M 745 84 L 745 130 Q 745 145 700 145 L 570 145" stroke="#494454" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

        {/* Convergence Ingestion Arrow Down */}
        <line x1="430" y1="140" x2="430" y2="168" stroke="#a078ff" strokeWidth="2" markerEnd="url(#arrowDown)" />
        <rect x="390" y="142" width="80" height="18" rx="4" fill="#101418" stroke="#494454" strokeWidth="1" />
        <text x="430" y="154.5" fill="#cbc3d7" fontSize="9.5" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">INGESTION</text>

        {/* ---------------- 3. CENTER BOX: FEATUREHUB ---------------- */}
        <g id="center-featurehub" filter="url(#purpleGlow)">
          <rect
            x="190"
            y="175"
            width="480"
            height="145"
            rx="12"
            fill="url(#purpleGrad)"
            stroke="#a078ff"
            strokeWidth="1.8"
          />
          {/* Badge */}
          <rect x="210" y="193" width="168" height="20" rx="4" fill="#340080" stroke="#a078ff" strokeWidth="1" />
          <text x="294" y="206.5" fill="#d0bcff" fontSize="9.5" fontWeight="600" fontFamily="'JetBrains Mono', monospace" textAnchor="middle" letterSpacing="0.08em">
            ZERO-SKEW CONTRACT ENGINE
          </text>

          {/* Title */}
          <text x="210" y="238" fill="#ffffff" fontSize="18" fontWeight="700" fontFamily="'Geist', sans-serif">
            FeatureHub Core Store &amp; Engine
          </text>

          {/* Description */}
          <text x="210" y="258" fill="#cbc3d7" fontSize="11" fontFamily="'Inter', sans-serif">
            Synchronous dual-write registry: Point-in-time Offline Store + Hot Redis Cache
          </text>

          {/* Two internal feature pills */}
          <rect x="210" y="274" width="215" height="30" rx="6" fill="#181c20" stroke="#494454" strokeWidth="1" />
          <circle cx="225" cy="289" r="4" fill="#d0bcff" />
          <text x="236" y="293" fill="#e0e3e8" fontSize="10.5" fontFamily="'JetBrains Mono', monospace">
            AS-OF Timestamp Enforcement
          </text>

          <rect x="440" y="274" width="210" height="30" rx="6" fill="#181c20" stroke="#494454" strokeWidth="1" />
          <circle cx="455" cy="289" r="4" fill="#6cffbf" />
          <text x="466" y="293" fill="#e0e3e8" fontSize="10.5" fontFamily="'JetBrains Mono', monospace">
            Multi-Key Pipeline &lt;2ms
          </text>
        </g>

        {/* ---------------- 4. ARROWS DOWN TO TRAINING & INFERENCE ---------------- */}
        {/* Left Arrow: get_historical_features() */}
        <path
          d="M 330 320 L 330 355 Q 330 375 270 375 L 205 375"
          stroke="#d0bcff"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowLeftPurple)"
        />
        {/* Method Label Box Left */}
        <g filter="url(#cardShadow)">
          <rect x="180" y="342" width="195" height="24" rx="4" fill="#101418" stroke="#d0bcff" strokeWidth="1" />
          <text
            x="277.5"
            y="358"
            fill="#d0bcff"
            fontSize="10.5"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
          >
            get_historical_features()
          </text>
        </g>

        {/* Right Arrow: get_online_features() */}
        <path
          d="M 530 320 L 530 355 Q 530 375 590 375 L 650 375"
          stroke="#6cffbf"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowRightGreen)"
        />
        {/* Method Label Box Right */}
        <g filter="url(#cardShadow)">
          <rect x="495" y="342" width="175" height="24" rx="4" fill="#101418" stroke="#6cffbf" strokeWidth="1" />
          <text
            x="582.5"
            y="358"
            fill="#6cffbf"
            fontSize="10.5"
            fontWeight="600"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
          >
            get_online_features()
          </text>
        </g>

        {/* ---------------- 5. BOTTOM TIER: CONSUMERS ---------------- */}
        {/* Left: Training Pipeline */}
        <g id="consumer-training" filter="url(#cardShadow)">
          <rect x="40" y="390" width="340" height="78" rx="10" fill="url(#cardGrad)" stroke="#a078ff" strokeWidth="1.5" />
          {/* Badge */}
          <rect x="290" y="402" width="75" height="18" rx="4" fill="#23005c" stroke="#a078ff" strokeWidth="0.8" />
          <text x="327.5" y="414" fill="#d0bcff" fontSize="9.5" fontWeight="600" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">
            OFFLINE
          </text>
          <text x="60" y="417" fill="#e0e3e8" fontSize="14" fontWeight="600" fontFamily="'Geist', sans-serif">
            Training Pipeline
          </text>
          <text x="60" y="437" fill="#958ea0" fontSize="11" fontFamily="'Inter', sans-serif">
            Point-in-time AS-OF join matrix · Zero leakage
          </text>
          <text x="60" y="453" fill="#cbc3d7" fontSize="10" fontFamily="'JetBrains Mono', monospace">
            Parquet / Apache Arrow format
          </text>
        </g>

        {/* Right: Inference Server */}
        <g id="consumer-inference" filter="url(#cardShadow)">
          <rect x="480" y="390" width="340" height="78" rx="10" fill="url(#cardGrad)" stroke="#00e5a0" strokeWidth="1.5" />
          {/* Badge */}
          <rect x="715" y="402" width="90" height="18" rx="4" fill="#003824" stroke="#6cffbf" strokeWidth="0.8" />
          <text x="760" y="414" fill="#6cffbf" fontSize="9.5" fontWeight="600" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">
            &lt; 2MS SERVE
          </text>
          <text x="500" y="417" fill="#e0e3e8" fontSize="14" fontWeight="600" fontFamily="'Geist', sans-serif">
            Inference Server
          </text>
          <text x="500" y="437" fill="#958ea0" fontSize="11" fontFamily="'Inter', sans-serif">
            Hot memory cluster · REST &amp; gRPC low-latency
          </text>
          <text x="500" y="453" fill="#6cffbf" fontSize="10" fontFamily="'JetBrains Mono', monospace">
            Redis Online Store Vector Cache
          </text>
        </g>
      </svg>
    </div>
  );
}
