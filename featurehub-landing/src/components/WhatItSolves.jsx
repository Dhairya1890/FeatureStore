import React from 'react';
import ArchitectureDiagram from './ArchitectureDiagram';

export default function WhatItSolves() {
  return (
    <section className="py-space-xl mt-space-xl">
      {/* Section Header */}
      <div className="flex flex-col mb-space-xl">
        <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">
          Architectural Resolution
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs tracking-tight">
          The problem with most ML systems
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-space-xs">
          Data engineering and model deployment pipelines fail at the handoff. FeatureHub guarantees unified feature semantics across training and live inference.
        </p>
      </div>

      {/* Grid Layout: Left Column Problems, Right Column Architecture Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
        {/* Left Column: Problem Stack */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-space-md">
          {/* Problem Item 1 */}
          <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant hover:border-outline transition-colors relative overflow-hidden group">
            <div className="flex items-start gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-error-container/20 border border-error/30 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-error"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-mono text-label-mono text-error font-semibold">
                    01. FAILURE MODE
                  </span>
                  <span className="text-on-surface-variant font-body-sm text-body-sm">•</span>
                  <span className="font-headline-md text-body-lg text-on-surface">
                    Training-Serving Skew
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                  Discrepancies between complex Pandas pipelines in offline research and low-latency API logic in production lead to silent prediction decay and unlogged model degradation.
                </p>
              </div>
            </div>
          </div>

          {/* Problem Item 2 */}
          <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant hover:border-outline transition-colors relative overflow-hidden group">
            <div className="flex items-start gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-error-container/20 border border-error/30 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-error"
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
              </div>
              <div>
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-mono text-label-mono text-error font-semibold">
                    02. FAILURE MODE
                  </span>
                  <span className="text-on-surface-variant font-body-sm text-body-sm">•</span>
                  <span className="font-headline-md text-body-lg text-on-surface">
                    Data Leakage
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                  Future state features accidentally contaminate offline training sets. Models register unrealistically high offline AUC metrics that instantly implode upon true edge production deployment.
                </p>
              </div>
            </div>
          </div>

          {/* Problem Item 3 */}
          <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant hover:border-outline transition-colors relative overflow-hidden group">
            <div className="flex items-start gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-error-container/20 border border-error/30 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-error"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-mono text-label-mono text-error font-semibold">
                    03. FAILURE MODE
                  </span>
                  <span className="text-on-surface-variant font-body-sm text-body-sm">•</span>
                  <span className="font-headline-md text-body-lg text-on-surface">
                    Feature Reimplementation
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                  Disjointed teams duplicate sliding window aggregates across SQL warehouses, Spark jobs, and Go microservices without a singular source of lineage or computational deduplication.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Architecture Flow */}
        <div className="lg:col-span-7 rounded-2xl bg-surface-container border border-outline-variant p-space-md sm:p-space-lg flex flex-col justify-between relative shadow-xl">
          <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm mb-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span className="font-label-mono text-label-mono text-on-surface tracking-wider uppercase">
                Unified Data Contract Topography
              </span>
            </div>
            <span className="font-label-mono text-label-mono text-secondary">
              ACTIVE TOPOLOGY
            </span>
          </div>

          <ArchitectureDiagram />
        </div>
      </div>
    </section>
  );
}
