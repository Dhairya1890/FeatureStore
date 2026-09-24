import React from 'react';

const steps = [
  {
    category: 'Guaranteed Consistency',
    title: 'Point-in-time correctness',
    description:
      'Offline store backed by a normalized Entity-Attribute-Value (EAV) schema. SQL-level timestamp window enforcement ensures historical join states only see events up to the observation timestamp, yielding mathematically proven zero data leakage.',
    snippet: 'AS-OF JOIN (t_event <= t_obs)',
    icon: (
      <svg
        className="w-5 h-5 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    category: 'Low-Latency Serving',
    title: 'Sub-2ms serving',
    description:
      'Dual-tier Redis memory store features automatic TTL expiration per feature entity, non-blocking atomic pipeline fetching, connection pool pre-warming, and fail-open resilience when upstream networks experience jitter.',
    snippet: 'PIPELINE MGET user:* TTL_SYNC',
    icon: (
      <svg
        className="w-5 h-5 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    category: 'Single Source of Truth',
    title: 'One definition',
    description:
      "Python decorator-based registry declarative format: @feature(name='...', ttl=3600). Features are declared once in git and compile automatically to both SQL offline queries and Redis serialization codecs.",
    snippet: '@feature(name="avg_spend", ttl=86400)',
    icon: (
      <svg
        className="w-5 h-5 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

function HowItWorksComponent() {
  return (
    <section className="py-space-xl my-space-lg">
      <div className="flex flex-col mb-space-xl">
        <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">
          Under The Hood
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs tracking-tight">
          Engineering Decisions
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-space-xs">
          Architected for zero data leakage and extreme predictability under mission-critical workloads.
        </p>
      </div>

      {/* Three Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {steps.map((step) => (
          <div
            key={step.title}
            className="p-space-lg rounded-xl bg-surface-container border border-outline-variant flex flex-col justify-between relative shadow-lg"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center mb-space-md">
                {step.icon}
              </div>
              <span className="font-label-mono text-label-mono text-primary uppercase">
                {step.category}
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface mt-1 font-bold">
                {step.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="mt-space-lg pt-space-sm border-t border-outline-variant">
              <div className="font-label-mono text-label-mono text-on-surface-variant bg-surface-container-lowest p-2 rounded truncate">
                {step.snippet}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const HowItWorks = React.memo(HowItWorksComponent);
export default HowItWorks;
