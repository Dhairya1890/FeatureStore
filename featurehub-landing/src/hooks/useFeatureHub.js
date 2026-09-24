import { useState, useEffect, useCallback } from 'react';
import CONFIG from '../config';

/**
 * Hook 1: useSystemStats
 * On mount, GET ${apiBase}/health
 * Returns { featuresRegistered, jobsCompleted, uptime, loading, error }
 * Polls every 30 seconds.
 */
export function useSystemStats() {
  const [stats, setStats] = useState({
    featuresRegistered: null,
    jobsCompleted: null,
    uptime: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();

    const fetchStats = async (isInitial = false) => {
      if (isInitial) {
        setStats((prev) => ({ ...prev, loading: true, error: null }));
      }
      try {
        const res = await fetch(`${CONFIG.apiBase}/health`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        if (isMounted) {
          setStats({
            featuresRegistered: data.features_registered ?? null,
            jobsCompleted: data.jobs_completed ?? null,
            uptime: data.uptime ?? null,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          setStats((prev) => ({
            ...prev,
            loading: false,
            error: err.message || 'Failed to fetch system stats',
          }));
        }
      }
    };

    fetchStats(true);
    const intervalId = setInterval(() => {
      fetchStats(false);
    }, 30000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(intervalId);
    };
  }, []);

  return stats;
}

/**
 * Hook 2: useOnlineFeatures
 * NOT called on mount.
 * Returns { fetch: async fn, data, latencyMs, loading, error }
 * The fetch fn calls POST ${apiBase}/features/online with body { entity_id: entityId },
 * measures latency with performance.now() before and after, sets latencyMs in state.
 */
export function useOnlineFeatures(entityId) {
  const [data, setData] = useState(null);
  const [latencyMs, setLatencyMs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOnline = useCallback(
    async (targetId) => {
      const idToFetch = targetId || entityId;
      if (!idToFetch) return;

      setLoading(true);
      setError(null);
      const start = performance.now();

      try {
        const headers = {
          'Content-Type' : 'application/json',
        };
        if(CONFIG.apiKey){
          headers['x-api-key'] = CONFIG.apiKey;
        }
        const res = await fetch(`${CONFIG.apiBase}/features/online`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            entity_id: idToFetch,
            entity_ids: [idToFetch],
            feature_names: CONFIG.features || ['user_age', 'account_balance'],
          }),
        });
        const end = performance.now();
        const latency = Number((end - start).toFixed(1));
        setLatencyMs(latency);

        if (!res.ok) {
          throw new Error(`Server returned HTTP ${res.status}`);
        }

        const json = await res.json();
        setData(json);
        return json;
      } catch (err) {
        const end = performance.now();
        const latency = Number((end - start).toFixed(1));
        setLatencyMs(latency);
        setError(err.message || 'Failed to fetch online features');
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [entityId]
  );

  return {
    fetch: fetchOnline,
    data,
    latencyMs,
    loading,
    error,
  };
}

/**
 * Hook 3: useFeatureRegistry
 * On mount, GET ${apiBase}/features
 * Returns { features: [], loading, error }
 */
export function useFeatureRegistry() {
  const [registry, setRegistry] = useState({
    features: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchRegistry = async () => {
      try {
        const res = await fetch(`${CONFIG.apiBase}/features`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        if (isMounted) {
          setRegistry({
            features: Array.isArray(data) ? data : (data.features || []),
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          setRegistry({
            features: [],
            loading: false,
            error: err.message || 'Failed to fetch feature registry',
          });
        }
      }
    };

    fetchRegistry();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return registry;
}
