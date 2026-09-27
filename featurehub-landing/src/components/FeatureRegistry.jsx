import React, { useState } from 'react';
import { useFeatureRegistry } from '../hooks/useFeatureHub';
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
      let cls = 'text-amber-400';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-primary font-medium';
        } else {
          cls = 'text-secondary';
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-primary-fixed font-semibold';
      } else if (/null/.test(match)) {
        cls = 'text-outline';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export default function FeatureRegistry({ onSelectFeature }) {
  const { fetch: fetchRegistry, features, data, latencyMs, loading, error } =
    useFeatureRegistry(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'json'
  const [filterText, setFilterText] = useState('');

  const handleCopyFeature = (name, index) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleCopyRaw = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    });
  };

  const filteredFeatures = features.filter(
    (f) =>
      f.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      f.description?.toLowerCase().includes(filterText.toLowerCase()) ||
      f.entity_type?.toLowerCase().includes(filterText.toLowerCase()) ||
      f.data_type?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-space-md">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md bg-surface-container-lowest/60 p-space-sm rounded-xl border border-outline-variant/60">
        <div className="flex items-center gap-space-sm flex-wrap">
          {/* Action button to fetch registry */}
          <button
            type="button"
            onClick={() => fetchRegistry()}
            disabled={loading}
            className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-headline-md text-code-base font-semibold shadow-[0_0_12px_rgba(208,188,255,0.25)] hover:bg-primary-fixed transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                <span>Fetching /registry...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Fetch registered features</span>
              </>
            )}
          </button>

          {/* Endpoint badge */}
          <span className="font-label-mono text-label-mono px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant border border-outline-variant">
            GET /registry
          </span>

          {/* Feature count badge */}
          {features.length > 0 && (
            <span className="font-label-mono text-label-mono px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/30">
              {features.length} {features.length === 1 ? 'feature' : 'features'}
            </span>
          )}

          {/* Latency display */}
          {latencyMs !== null && (
            <span className="font-label-mono text-label-mono text-on-surface-variant flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              {latencyMs}ms
            </span>
          )}
        </div>

        {/* View Mode Toggle & Filter */}
        <div className="flex items-center gap-space-sm">
          {features.length > 2 && (
            <div className="relative">
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter features..."
                className="bg-surface-container border border-outline-variant rounded-md px-2.5 py-1 text-code-base font-code-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary w-36 sm:w-44"
              />
              {filterText && (
                <button
                  type="button"
                  onClick={() => setFilterText('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div className="inline-flex rounded-lg border border-outline-variant p-0.5 bg-surface-container">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs font-label-mono rounded transition-colors ${
                viewMode === 'cards'
                  ? 'bg-surface-container-high text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Schema View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('json')}
              className={`px-2.5 py-1 text-xs font-label-mono rounded transition-colors ${
                viewMode === 'json'
                  ? 'bg-surface-container-high text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Raw JSON
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-space-sm rounded-lg bg-error-container/20 border border-error/30 text-error font-code-base text-body-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
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
              Unable to reach registry: {error}. Backend URL: {CONFIG.apiBase}/registry
            </span>
          </div>
          <button
            type="button"
            onClick={() => fetchRegistry()}
            className="text-xs underline hover:text-primary font-label-mono"
          >
            Retry
          </button>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          {loading && features.length === 0 ? (
            // Skeleton cards while initial loading
            <>
              <div className="p-space-md rounded-xl bg-surface-container-lowest/80 border border-outline-variant animate-pulse h-32" />
              <div className="p-space-md rounded-xl bg-surface-container-lowest/80 border border-outline-variant animate-pulse h-32" />
            </>
          ) : filteredFeatures.length === 0 ? (
            <div className="col-span-full py-8 text-center text-on-surface-variant font-code-base text-body-sm bg-surface-container-lowest/40 rounded-xl border border-outline-variant/40">
              {features.length === 0
                ? 'No registered features found. Click "Fetch registered features" above.'
                : 'No features match the filter query.'}
            </div>
          ) : (
            filteredFeatures.map((feat, idx) => (
              <div
                key={feat.name || idx}
                className="group relative p-space-md rounded-xl bg-surface-container-lowest/90 border border-outline-variant hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-code-base font-semibold text-primary group-hover:text-primary-fixed transition-colors">
                        {feat.name}
                      </span>
                      <span className="font-label-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-secondary border border-secondary/20">
                        {feat.data_type || 'float'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyFeature(feat.name, idx)}
                      className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors"
                      title="Copy feature name"
                      aria-label="Copy feature name"
                    >
                      {copiedIndex === idx ? (
                        <span className="text-secondary font-label-mono text-[11px]">
                          Copied!
                        </span>
                      ) : (
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
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                    {feat.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-space-sm pt-space-xs border-t border-outline-variant/40 flex items-center justify-between text-[11px] font-label-mono text-on-surface-variant">
                  <div className="flex items-center gap-3">
                    <span>
                      entity:{' '}
                      <span className="text-on-surface font-medium">
                        {feat.entity_type}
                      </span>
                    </span>
                    <span>
                      ttl:{' '}
                      <span className="text-on-surface font-medium">
                        {feat.ttl}s
                      </span>
                    </span>
                  </div>

                  {onSelectFeature && (
                    <button
                      type="button"
                      onClick={() => onSelectFeature(feat.name)}
                      className="text-primary hover:text-secondary inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Query</span>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Raw JSON View */}
      {viewMode === 'json' && (
        <div className="rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container-high border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-secondary/70" />
              <span className="ml-space-sm font-label-mono text-label-mono text-on-surface-variant truncate">
                GET /registry &nbsp;[{features.length} definitions]
              </span>
            </div>

            {data && (
              <button
                type="button"
                onClick={handleCopyRaw}
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
                <span className={copiedRaw ? 'text-secondary' : ''}>
                  {copiedRaw ? 'Copied!' : 'Copy'}
                </span>
              </button>
            )}
          </div>

          <pre className="p-space-md font-code-base text-code-base overflow-x-auto text-on-surface leading-relaxed max-h-[300px]">
            {data ? (
              <code
                dangerouslySetInnerHTML={{
                  __html: getHighlightedHtml(data),
                }}
              />
            ) : (
              <code className="text-on-surface-variant opacity-75 font-code-base">
                {`// Feature Registry Explorer\n// GET ${CONFIG.apiBase}/registry\n// Click "Fetch registered features" to load schema definitions.`}
              </code>
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
