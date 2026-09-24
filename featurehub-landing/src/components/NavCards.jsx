import React from 'react';
import CONFIG from '../config';

const navItems = [
  {
    title: 'Metrics (Grafana)',
    href: CONFIG.grafanaUrl,
    description:
      'Live latency, throughput, and system health telemetry exported directly via Prometheus scrapers.',
    port: 'PORT: 3000',
    icon: (
      // Chart geometric SVG
      <svg
        className="w-6 h-6 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="3" y1="20" x2="21" y2="20" />
      </svg>
    ),
  },
  {
    title: 'API Explorer (FastAPI /docs)',
    href: CONFIG.docsUrl,
    description:
      'Browse, test, and introspect every ingestion, materialization, and point-in-time join endpoint interactively.',
    port: 'SPEC: OpenAPI 3.1',
    icon: (
      // Terminal geometric SVG
      <svg
        className="w-6 h-6 text-secondary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    title: 'Job Monitor (Flower) (Under Construction)',
    href: CONFIG.flowerUrl,
    description:
      'Track offline materialization pipelines, DAG execution stages, and background Celery asynchronous workers.',
    port: 'PORT: 5555',
    icon: (
      // Layers geometric SVG
      <svg
        className="w-6 h-6 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    title: 'Load Testing (Locust)',
    href: CONFIG.locustUrl,
    description:
      'Execute high-concurrency synthetic load tests, stress test multi-get Redis pipelines, and monitor throughput degradation.',
    port: 'PORT: 8089',
    icon: (
      // Gauge geometric SVG
      <svg
        className="w-6 h-6 text-secondary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a10 10 0 0 0-10 10c0 4.14 2.52 7.7 6.13 9.21" />
        <path d="M21.87 12A10 10 0 0 0 12 2" />
        <path d="M12 12l4-4" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
];

function NavCardsComponent() {
  return (
    <section className="py-space-xl mt-space-lg" id="explore">
      <div className="flex flex-col mb-space-xl">
        <span className="font-label-mono text-label-mono text-secondary uppercase tracking-widest">
          Observability &amp; Control
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs tracking-tight">
          Everything running live
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-space-xs">
          FeatureHub integrates natively with industry-standard telemetry, orchestration, and documentation engines out of the box.
        </p>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {navItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="p-space-lg rounded-xl bg-surface-container border border-outline-variant border-l-4 border-l-transparent hover:border-l-primary hover:border-outline transition-all duration-300 group flex flex-col justify-between relative shadow-lg overflow-hidden"
          >
            <div className="flex items-start justify-between mb-space-md">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center group-hover:border-primary/50 transition-colors">
                {item.icon}
              </div>
              <span className="font-label-mono text-label-mono px-2 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-on-surface-variant group-hover:text-primary transition-colors flex items-center gap-1">
                Open &rarr;
              </span>
            </div>

            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                {item.description}
              </p>
            </div>

            <div className="mt-space-md pt-space-sm border-t border-outline-variant flex items-center justify-between text-on-surface-variant font-label-mono text-label-mono">
              <span>{item.port}</span>
              <span className="text-secondary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                {item.meta}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

const NavCards = React.memo(NavCardsComponent);
export default NavCards;
