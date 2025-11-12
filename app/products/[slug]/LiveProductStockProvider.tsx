'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type LiveProductStockContextValue = {
  stock: number;
  isRefreshing: boolean;
  error: string | null;
  didSync: boolean;
};

const LiveProductStockContext = createContext<LiveProductStockContextValue | null>(null);

type ProviderProps = {
  productId: string;
  initialStock: number;
  children: ReactNode;
};

export function LiveProductStockProvider({ productId, initialStock, children }: ProviderProps) {
  const [stock, setStock] = useState(() => Math.max(0, initialStock));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [didSync, setDidSync] = useState(false);

  useEffect(() => {
    setStock(Math.max(0, initialStock));
    setDidSync(false);
  }, [initialStock]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function refreshStock() {
      setIsRefreshing(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/${productId}/stock`, {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 404 && isMounted) {
            setStock(0);
            setDidSync(true);
            return;
          }
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        if (!isMounted) return;

        const nextStock =
          typeof payload?.stock === 'number' && Number.isFinite(payload.stock)
            ? payload.stock
            : 0;

        setStock(Math.max(0, nextStock));
        setDidSync(true);
      } catch (fetchError) {
        if (!isMounted) return;
        if ((fetchError as Error).name === 'AbortError') {
          return;
        }
        console.error('[stock] Failed to refresh live stock', fetchError);
        setError('Unable to refresh live stock right now.');
      } finally {
        if (isMounted) {
          setIsRefreshing(false);
        }
      }
    }

    refreshStock();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [productId]);

  const value = useMemo<LiveProductStockContextValue>(
    () => ({
      stock,
      isRefreshing,
      error,
      didSync,
    }),
    [stock, isRefreshing, error, didSync]
  );

  return (
    <LiveProductStockContext.Provider value={value}>
      {children}
    </LiveProductStockContext.Provider>
  );
}

export function useLiveProductStock() {
  const context = useContext(LiveProductStockContext);
  if (!context) {
    throw new Error('useLiveProductStock must be used within LiveProductStockProvider');
  }
  return context;
}
