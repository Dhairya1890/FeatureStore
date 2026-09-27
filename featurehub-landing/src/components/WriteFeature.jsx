import React, { useState } from 'react';
import { useWriteFeature } from '../hooks/useFeatureHub';
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

const PRESET_TEMPLATES = [
  {
    label: 'user_001 age = 29',
    entity_id: 'user_001',
    feature_name: 'user_age',
    value: 29,
    ttl: 3600,
  },
  {
    label: 'user_001 balance = $1,500.50',
    entity_id: 'user_001',
    feature_name: 'account_balance',
    value: 1500.5,
    ttl: 3600,
  },
  {
    label: 'user_002 balance = $3,200.00',
    entity_id: 'user_002',
    feature_name: 'account_balance',
    value: 3200.0,
    ttl: 3600,
  },
];

export default function WriteFeature({ onFeatureWritten }) {
  const { write, data, latencyMs, loading, error } = useWriteFeature();

  const [entityType, setEntityType] = useState('user');
  const [entityId, setEntityId] = useState(CONFIG.entities[0] || 'user_001');
  const [isCustomEntity, setIsCustomEntity] = useState(false);
  const [customEntityId, setCustomEntityId] = useState('');

  const [featureName, setFeatureName] = useState(
    CONFIG.features[0] || 'user_age'
  );
  const [isCustomFeature, setIsCustomFeature] = useState(false);
  const [customFeatureName, setCustomFeatureName] = useState('');

  const [value, setValue] = useState('28');
  const [ttl, setTtl] = useState(3600);
  const [copied, setCopied] = useState(false);

  const activeEntityId = isCustomEntity ? customEntityId : entityId;
  const activeFeatureName = isCustomFeature ? customFeatureName : featureName;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!activeEntityId || !activeFeatureName || value === '') return;

    try {
      await write({
        entity_type: entityType || 'user',
        entity_id: activeEntityId,
        feature_name: activeFeatureName,
        value: parseFloat(value),
        ttl: parseInt(ttl, 10) || 3600,
      });
    } catch (_) {
      // error handled in hook
    }
  };

  const handleApplyTemplate = (tmpl) => {
    setIsCustomEntity(false);
    setEntityId(tmpl.entity_id);
    setIsCustomFeature(false);
    setFeatureName(tmpl.feature_name);
    setValue(String(tmpl.value));
    setTtl(tmpl.ttl);
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full flex flex-col gap-space-md">
      {/* Top Banner / Template Shortcuts */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm bg-surface-container-lowest/60 p-space-sm rounded-xl border border-outline-variant/60">
        <div className="flex items-center gap-space-xs flex-wrap">
          <span className="font-label-mono text-label-mono text-on-surface-variant px-2 py-0.5">
            Quick Templates:
          </span>
          {PRESET_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.label}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="text-xs font-label-mono px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant transition-colors"
            >
              {tmpl.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-space-sm">
          <span className="font-label-mono text-label-mono px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant border border-outline-variant">
            POST /features/write
          </span>
          {latencyMs !== null && (
            <span className="font-label-mono text-label-mono text-secondary flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary/10 border border-secondary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              {latencyMs}ms
            </span>
          )}
        </div>
      </div>

      {/* Form Grid */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest/80 p-space-md rounded-xl border border-outline-variant flex flex-col gap-space-md shadow-sm"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
          {/* Entity ID Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="writeEntityId"
                className="font-label-mono text-xs text-on-surface-variant uppercase"
              >
                Entity ID
              </label>
              <button
                type="button"
                onClick={() => setIsCustomEntity(!isCustomEntity)}
                className="text-[11px] font-label-mono text-primary hover:underline"
              >
                {isCustomEntity ? 'Select preset' : 'Custom +'}
              </button>
            </div>

            {isCustomEntity ? (
              <input
                id="writeCustomEntityId"
                type="text"
                value={customEntityId}
                onChange={(e) => setCustomEntityId(e.target.value)}
                placeholder="e.g. user_999"
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 font-code-base text-code-base text-on-surface focus:outline-none focus:border-primary"
                required
              />
            ) : (
              <select
                id="writeEntityId"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 font-code-base text-code-base text-on-surface appearance-none focus:outline-none focus:border-primary cursor-pointer"
              >
                {CONFIG.entities.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Feature Name Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="writeFeatureName"
                className="font-label-mono text-xs text-on-surface-variant uppercase"
              >
                Feature Name
              </label>
              <button
                type="button"
                onClick={() => setIsCustomFeature(!isCustomFeature)}
                className="text-[11px] font-label-mono text-primary hover:underline"
              >
                {isCustomFeature ? 'Select preset' : 'Custom +'}
              </button>
            </div>

            {isCustomFeature ? (
              <input
                id="writeCustomFeatureName"
                type="text"
                value={customFeatureName}
                onChange={(e) => setCustomFeatureName(e.target.value)}
                placeholder="e.g. credit_score"
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 font-code-base text-code-base text-on-surface focus:outline-none focus:border-primary"
                required
              />
            ) : (
              <select
                id="writeFeatureName"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 font-code-base text-code-base text-on-surface appearance-none focus:outline-none focus:border-primary cursor-pointer"
              >
                {CONFIG.features.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Feature Value Field */}
          <div>
            <label
              htmlFor="writeValue"
              className="block font-label-mono text-xs text-on-surface-variant uppercase mb-1"
            >
              Feature Value (float)
            </label>
            <input
              id="writeValue"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 28.5"
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 font-code-base text-code-base text-on-surface focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* TTL Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="writeTtl"
                className="font-label-mono text-xs text-on-surface-variant uppercase"
              >
                TTL (seconds)
              </label>
              <div className="flex items-center gap-1">
                {[60, 3600, 86400].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTtl(t)}
                    className={`text-[10px] font-label-mono px-1.5 py-0.5 rounded ${
                      ttl === t
                        ? 'bg-secondary/20 text-secondary border border-secondary/30'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {t === 60 ? '1m' : t === 3600 ? '1h' : '24h'}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="writeTtl"
              type="number"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              placeholder="3600"
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 font-code-base text-code-base text-on-surface focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Submit Bar & Redis Key Preview */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md pt-space-xs border-t border-outline-variant/50">
          <div className="flex items-center gap-2 text-xs font-label-mono text-on-surface-variant truncate">
            <span>Target Redis Key:</span>
            <code className="text-secondary bg-surface-container px-2 py-0.5 rounded border border-outline-variant truncate">
              {entityType || 'user'}:{activeEntityId || '<id>'}:
              {activeFeatureName || '<feature>'}
            </code>
          </div>

          <button
            type="submit"
            disabled={loading || !activeEntityId || !activeFeatureName || value === ''}
            className="inline-flex items-center justify-center gap-space-xs px-space-lg py-2 rounded-lg bg-primary text-on-primary font-headline-md text-code-base font-semibold shadow-[0_0_16px_rgba(208,188,255,0.3)] hover:bg-primary-fixed transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                <span>Writing to Redis...</span>
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
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Write feature value</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-space-sm rounded-lg bg-error-container/20 border border-error/30 text-error font-code-base text-body-sm flex items-center gap-2">
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
            Unable to write feature to online store: {error}. Backend URL:{' '}
            {CONFIG.apiBase}/features/write
          </span>
        </div>
      )}

      {/* Success Banner & Live Verification Link */}
      {data && (
        <div className="p-space-sm rounded-xl bg-secondary/10 border border-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm text-secondary font-code-base text-body-sm">
            <svg
              className="w-4 h-4 shrink-0 text-secondary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>
              Feature value written to online store! Key: <code className="font-semibold">{data.key}</code>
            </span>
          </div>

          {onFeatureWritten && (
            <button
              type="button"
              onClick={() =>
                onFeatureWritten({
                  entityId: activeEntityId,
                  featureName: activeFeatureName,
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary text-on-secondary font-label-mono text-xs font-semibold hover:bg-secondary-fixed transition-colors self-start sm:self-auto"
            >
              <span>Query in Sandbox</span>
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Terminal View */}
      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden shadow-inner">
        <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container-high border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-error/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-secondary/70" />
            <span className="ml-space-sm font-label-mono text-label-mono text-on-surface-variant truncate">
              POST /features/write &nbsp;[{activeEntityId} → {activeFeatureName}]
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

        <pre className="p-space-md font-code-base text-code-base overflow-x-auto text-on-surface leading-relaxed min-h-[120px]">
          {data ? (
            <code
              dangerouslySetInnerHTML={{
                __html: getHighlightedHtml(data),
              }}
            />
          ) : (
            <code className="text-on-surface-variant opacity-75 font-code-base">
              {`// Online Feature Write Console\n// Enter entity ID, feature name, value, and TTL above to write directly into Redis.\n// Request: POST ${CONFIG.apiBase}/features/write\n// Payload: {\n//   "entity_type": "${entityType}",\n//   "entity_id": "${activeEntityId}",\n//   "feature_name": "${activeFeatureName}",\n//   "value": ${value || '0'},\n//   "ttl": ${ttl}\n// }`}
            </code>
          )}
        </pre>
      </div>

      {/* Explanatory Footnote */}
      <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
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
          Writes directly into Redis with format{' '}
          <code className="text-primary font-label-mono text-xs">
            {entityType}:{activeEntityId}:{activeFeatureName}
          </code>{' '}
          with hardware-accelerated TTL expiration.
        </span>
      </div>
    </div>
  );
}
