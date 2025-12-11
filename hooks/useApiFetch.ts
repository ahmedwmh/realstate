import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiFetchOptions<T> {
  endpoint: string;
  cache?: RequestCache;
  enabled?: boolean;
  transform?: (data: any) => T;
}

interface UseApiFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching data from API endpoints
 * Reduces code duplication and provides consistent error handling
 */
export function useApiFetch<T = any>({
  endpoint,
  cache = 'no-store',
  enabled = true,
  transform,
}: UseApiFetchOptions<T>): UseApiFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use refs to store values that shouldn't trigger re-fetches
  const transformRef = useRef(transform);
  transformRef.current = transform;
  
  // Track if we're currently fetching to prevent concurrent requests
  const isFetchingRef = useRef(false);
  
  // Track the last fetched endpoint/cache to prevent unnecessary re-fetches
  const lastEndpointRef = useRef<string | null>(null);
  const lastCacheRef = useRef<RequestCache | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Skip if disabled
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Skip if already fetching the same endpoint with same cache
    if (isFetchingRef.current && lastEndpointRef.current === endpoint && lastCacheRef.current === cache) {
      return;
    }

    // Skip if we've already fetched this exact endpoint/cache combo
    if (lastEndpointRef.current === endpoint && lastCacheRef.current === cache && hasFetchedRef.current) {
      return;
    }

    let cancelled = false;
    isFetchingRef.current = true;
    lastEndpointRef.current = endpoint;
    lastCacheRef.current = cache;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const response = await fetch(endpoint, { cache });
        
        if (cancelled) return;
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        
        if (cancelled) return;
        
        // Transform data if transform function provided (using ref to get latest version)
        const transformedData = transformRef.current ? transformRef.current(jsonData) : jsonData;
        
        // Ensure array data is actually an array, or use empty array as fallback
        if (Array.isArray(jsonData)) {
          setData(Array.isArray(transformedData) ? (transformedData as T) : ([] as unknown as T));
        } else {
          setData((transformedData ?? null) as T | null);
        }
        
        hasFetchedRef.current = true;
      } catch (err) {
        if (cancelled) return;
        
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        console.error(`Error fetching ${endpoint}:`, error);
        setError(error);
        setData(null);
        hasFetchedRef.current = false;
      } finally {
        if (!cancelled) {
          setLoading(false);
          isFetchingRef.current = false;
        }
      }
    };

    fetchData();

    // Cleanup function to cancel fetch if component unmounts or dependencies change
    return () => {
      cancelled = true;
      isFetchingRef.current = false;
    };
  }, [endpoint, cache, enabled]); // Only depend on endpoint, cache, and enabled

  const refetch = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    // Reset fetch tracking for manual refetch
    hasFetchedRef.current = false;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, { cache });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      
      // Transform data if transform function provided
      const transformedData = transformRef.current ? transformRef.current(jsonData) : jsonData;
      
      // Ensure array data is actually an array, or use empty array as fallback
      if (Array.isArray(jsonData)) {
        setData(Array.isArray(transformedData) ? (transformedData as T) : ([] as unknown as T));
      } else {
        setData((transformedData ?? null) as T | null);
      }
      
      hasFetchedRef.current = true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      console.error(`Error fetching ${endpoint}:`, error);
      setError(error);
      setData(null);
      hasFetchedRef.current = false;
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [endpoint, cache]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
