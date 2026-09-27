import React, { useState } from 'react';
import { useOnlineFeatures } from '../hooks/useFeatureHub';
import FeatureRegistry from './FeatureRegistry';
import CONFIG from '../config';

function getHighlightedHtml(data) {
  if (!data) return '';
  const json = JSON.stringify(data, null, 2)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-amber-400'; // numbers in amber
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-primary font-medium'; // keys in purple
        } else {
          cls = 'text-secondary'; // string values in green
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-primary-fixed font-semibold'; // booleans
      } else if (/null/.test(match)) {
        cls = 'text-outline';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export default function DemoStrip() {
  const [activeTab, setActiveTab] = useState('online'); // 'online' | 'registry'
  const [selectedEntity, setSelectedEntity] = useState(
    CONFIG.entities[0] || 'user_001'
  );
  const { fetch: fetchFeatures, data, latencyMs, loading, error } =
    useOnlineFeatures(selectedEntity);
  const [copied, setCopied] = useState(false);

  const handleFetch = () => {
    fetchFeatures(selectedEntity);
  };

  const handleCopy = () => {
    if (!data) return;
    const content = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getLatencyStyle = (ms) => {
    if (ms < 2) {
      return {
        badge: 'bg-secondary/10 border-secondary/30 text-secondary',
        dot: 'bg-secondary',
        label: `${ms}ms (Sub-2ms target)`,
      };
    }
    if (ms < 10) {
      return {
        badge: 'bg-amber-400/10 border-amber-400/30 text-amber-400',
        dot: 'bg-amber-400',
        label: `${ms}ms (<10ms)`,
      };
    }
    return {
      badge: 'bg-error/10 border-error/30 text-error',
      dot: 'bg-error',
      label: `${ms}ms (>10ms)`,
    };
  };

  const latencyStyle = latencyMs !== null ? getLatencyStyle(latencyMs) : null;

  return (
    <section id="demo" className="py-space-xl scroll-mt-20">
      <div className="max-w-4xl mx-auto rounded-2xl bg-surface-container border border-outline-variant p-space-lg md:p-space-xl shadow-2xl relative overflow-hidden">
        {/* Glow ambient corner */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b border-outline-variant pb-space-lg">
          <div>
            <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded bg-secondary/10 border border-secondary/30 mb-2">
              <svg
                className="w-4 h-4 text-secondary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span className="font-label-mono text-label-mono text-secondary">
                {activeTab === 'online' ? 'ONLINE TIER SANDBOX' : 'METADATA & SCHEMA REGISTRY'}
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              See it live
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              {activeTab === 'online'
                ? 'Query registered feature vectors in real time directly from the online Redis tier.'
                : 'Fetch, verify, and inspect all registered features directly from /registry.'}
            </p>
          </div>

          {/* Latency Badge: Appears after first fetch in online mode */}
          {activeTab === 'online' && latencyStyle && (
            <div
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg border self-start md:self-auto transition-all ${latencyStyle.badge}`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${latencyStyle.dot}`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${latencyStyle.dot}`}
                ></span>
              </span>
              <span className="font-label-mono text-label-mono opacity-80 uppercase">
                LATENCY:
              </span>
              <span className="font-metric-val text-code-base font-semibold">
                {latencyStyle.label}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Tabs inside See It Live Box */}
        <div className="flex items-center gap-2 mt-space-md border-b border-outline-variant/60 pb-3 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('online')}
            className={`inline-flex items-center gap-2 px-space-md py-1.5 rounded-lg text-code-base font-medium transition-all ${
              activeTab === 'online'
                ? 'bg-surface-container-high text-primary border border-primary/40 shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <svg
              className="w-4 h-4 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Online Serving (Redis)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('registry')}
            className={`inline-flex items-center gap-2 px-space-md py-1.5 rounded-lg text-code-base font-medium transition-all ${
              activeTab === 'registry'
                ? 'bg-surface-container-high text-secondary border border-secondary/40 shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <svg
              className="w-4 h-4 text-secondary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>Registered Features (/registry)</span>
          </button>
        </div>

        {activeTab === 'online' ? (
          <>
            {/* Query Control Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-space-md mt-space-lg">
              <div className="relative w-full sm:flex-1">
                <label htmlFor="entitySelect" className="sr-only">
                  Choose Entity ID
                </label>
                <select
                  id="entitySelect"
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-space-md py-space-sm font-code-base text-code-base text-on-surface appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  {CONFIG.entities.map((entityId) => (
                    <option key={entityId} value={entityId}>
                      Entity ID: {entityId}
                    </option>
                  ))}
                </select>
                {/* Custom arrow indicator */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              <button
                id="fetchBtn"
                type="button"
                onClick={handleFetch}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-headline-md text-code-base font-semibold shadow-[0_0_16px_rgba(208,188,255,0.3)] hover:bg-primary-fixed transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    {/* CSS-only loading spinner */}
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>Fetch features</span>
                  </>
                )}
              </button>
            </div>

            {/* Subtle inline error message, never crash */}
            {error && (
              <div className="mt-space-sm p-space-sm rounded-lg bg-error-container/20 border border-error/30 text-error font-code-base text-body-sm flex items-center gap-2">
                <svg
                  className="w-4 h-4 shrink-0 text-error"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                  Unable to reach online feature store: {error}. Backend URL: {CONFIG.apiBase}/features/online
                </span>
              </div>
            )}

            {/* IDE-Style Code Preview Terminal */}
            <div className="mt-space-lg rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden shadow-inner">
              {/* Window Chrome Bar */}
              <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container-high border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error/70"></span>
                  <span className="w-3 h-3 rounded-full bg-tertiary-container/70"></span>
                  <span className="w-3 h-3 rounded-full bg-secondary/70"></span>
                  <span className="ml-space-sm font-label-mono text-label-mono text-on-surface-variant truncate">
                    POST /features/online &nbsp;[{selectedEntity}]
                  </span>
                </div>

                {data && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 font-label-mono text-label-mono text-on-surface-variant hover:text-on-surface transition-colors"
                    aria-label="Copy JSON"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span className={copied ? 'text-secondary' : ''}>
                      {copied ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                )}
              </div>

              {/* Syntax Highlighted JSON Preview Container */}
              <pre className="p-space-md md:p-space-lg font-code-base text-code-base overflow-x-auto text-on-surface leading-relaxed min-h-[140px]">
                {data ? (
                  <code
                    dangerouslySetInnerHTML={{
                      __html: getHighlightedHtml(data),
                    }}
                  />
                ) : (
                  <code className="text-on-surface-variant opacity-75 font-code-base">
                    {`// Online Feature Store Sandbox\n// Select an entity above and click "Fetch features" to query the Redis online store.\n// Request: POST ${CONFIG.apiBase}/features/online\n// Body: { "entity_id": "${selectedEntity}" }`}
                  </code>
                )}
              </pre>
            </div>

            {/* Explanatory Footnote */}
            <div className="mt-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
              <div className="flex items-center gap-space-sm">
                <svg
                  className="w-4 h-4 text-secondary shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>
                  Point-in-time verified feature vector from the online Redis cluster with zero serialization overhead.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('registry')}
                className="text-primary hover:text-secondary font-label-mono text-xs underline shrink-0 text-left sm:text-right"
              >
                Inspect feature schemas →
              </button>
            </div>
          </>
        ) : (
          <div className="mt-space-lg">
            <FeatureRegistry
              onSelectFeature={(_featName) => {
                setActiveTab('online');
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
