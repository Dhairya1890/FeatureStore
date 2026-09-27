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
 * GET ${apiBase}/registry
 * Returns { fetch, refetch, features: [], data, latencyMs, loading, error }
 */
export function useFeatureRegistry(autoFetch = true) {
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState(null);
  const [latencyMs, setLatencyMs] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchRegistry = useCallback(async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (CONFIG.apiKey) {
        headers['x-api-key'] = CONFIG.apiKey;
      }

      const res = await fetch(`${CONFIG.apiBase}/registry`, {
        headers,
      });
      const end = performance.now();
      setLatencyMs(Number((end - start).toFixed(1)));

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json);
      const list = Array.isArray(json) ? json : (json.features || []);
      setFeatures(list);
      return json;
    } catch (err) {
      const end = performance.now();
      setLatencyMs(Number((end - start).toFixed(1)));
      setError(err.message || 'Failed to fetch feature registry');
      setFeatures([]);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchRegistry();
    }
  }, [autoFetch, fetchRegistry]);

  return {
    fetch: fetchRegistry,
    refetch: fetchRegistry,
    features,
    data,
    latencyMs,
    loading,
    error,
  };
}

/**
 * Hook 4: useWriteFeature
 * POST ${apiBase}/features/write
 * Writes a feature value to the online Redis store.
 * Returns { write, data, latencyMs, loading, error, reset }
 */
export function useWriteFeature() {
  const [data, setData] = useState(null);
  const [latencyMs, setLatencyMs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const write = useCallback(
    async ({
      entity_type = 'user',
      entity_id,
      feature_name,
      value,
      ttl = 3600,
    }) => {
      setLoading(true);
      setError(null);
      const start = performance.now();

      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        if (CONFIG.apiKey) {
          headers['x-api-key'] = CONFIG.apiKey;
        }

        const res = await fetch(`${CONFIG.apiBase}/features/write`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            entity_type: entity_type || 'user',
            entity_id,
            feature_name,
            value: parseFloat(value),
            ttl: parseInt(ttl, 10) || 3600,
          }),
        });

        const end = performance.now();
        const latency = Number((end - start).toFixed(1));
        setLatencyMs(latency);

        if (!res.ok) {
          let errMsg = `HTTP ${res.status}`;
          try {
            const errData = await res.json();
            if (errData.detail) errMsg = errData.detail;
          } catch (_) {}
          throw new Error(errMsg);
        }

        const json = await res.json();
        setData(json);
        return json;
      } catch (err) {
        const end = performance.now();
        const latency = Number((end - start).toFixed(1));
        setLatencyMs(latency);
        setError(err.message || 'Failed to write feature');
        setData(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    write,
    data,
    latencyMs,
    loading,
    error,
    reset: () => {
      setData(null);
      setError(null);
      setLatencyMs(null);
    },
  };
}


