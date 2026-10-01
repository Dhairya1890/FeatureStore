import React from 'react';
import { useSystemStats } from '../hooks/useFeatureHub';
import CONFIG from '../config';

export default function Hero() {
  const { featuresRegistered, jobsCompleted, uptime, loading, error } = useSystemStats();

  const handleScrollToDemo = (e) => {
    e.preventDefault();
    const demoElement = document.getElementById('demo');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center relative py-space-xl">
      {/* Atmospheric Sub-grid Canvas */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-20 [background-image:radial-gradient(#958ea0_1px,transparent_1px)] [background-size:28px_28px]"></div>

      {/* Badge / Status Pill */}
      <div className="inline-flex items-center gap-space-sm px-space-md py-1.5 rounded-full bg-surface-container border border-outline-variant shadow-md">
        <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#00e5a0] animate-pulse"></span>
        <span className="font-label-mono text-label-mono text-secondary tracking-widest uppercase">
          Open Source ML Infrastructure
        </span>
      </div>

      {/* Massive Heading */}
      <h1 className="font-headline-lg text-headline-lg md:text-display-hero text-on-surface tracking-tight mt-space-lg max-w-4xl">
        The feature store your{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-fixed to-secondary">
          ML system deserves
        </span>
      </h1>

      {/* Subheading */}
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-space-md leading-relaxed px-4">
        Eliminate training-serving skew and data leakage. Define features once, serve them everywhere — in training and at inference, consistently.
      </p>

      {/* Inline Live Stat Chips */}

      {/* CTA Row */}
      <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-xl">
        {/* <a
          href="#demo"
          onClick={handleScrollToDemo}
          className="inline-flex items-center gap-space-sm px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary font-headline-md text-code-base font-semibold shadow-[0_0_24px_rgba(160,120,255,0.35)] hover:bg-primary transition-all duration-200"
        >
          <span>Explore the system</span>
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </a> */}
        <a
          href={CONFIG.docsUrl}
          rel="noreferrer"
          target="_blank"
          className="inline-flex items-center gap-space-sm px-space-lg py-space-sm rounded-lg bg-surface-container border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-colors"
        >
          <span className="font-body-md text-body-md">API Documentation</span>
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>

      {/* Micro telemetry ticker */}
      <div className="mt-space-xl flex flex-wrap items-center justify-center gap-space-xs text-on-surface-variant font-label-mono text-label-mono opacity-60">
        <span>KERNEL: v1.4-LTS</span>
        <span>•</span>
        <span>RUNTIME: ASYNC-FASTAPI</span>
        <span>•</span>
        <span>CACHE: IN-MEMORY REDIS TIER</span>
      </div>
    </section>
  );
}
