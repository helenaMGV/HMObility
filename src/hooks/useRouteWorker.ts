import { useEffect, useRef, useState, useCallback } from 'react';

interface RouteWorkerMessage {
  type: string;
  payload: any;
  id?: string;
  error?: string;
}

interface UseRouteWorkerReturn {
  calculateRoute: (
    origin: [number, number],
    destination: [number, number],
    osmRoutes: [number, number][][],
    maxPoints?: number
  ) => Promise<{ route: [number, number][]; length: number }>;
  simplifyRoute: (
    route: [number, number][],
    tolerance: number
  ) => Promise<[number, number][]>;
  updatePosition: (
    route: [number, number][],
    progress: number
  ) => Promise<{ position: [number, number]; angle: number; segmentIndex: number }>;
  calculateDistance: (route: [number, number][]) => Promise<number>;
  isReady: boolean;
  isProcessing: boolean;
}

export const useRouteWorker = (): UseRouteWorkerReturn => {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const pendingRequests = useRef<Map<string, { resolve: Function; reject: Function }>>(new Map());

  useEffect(() => {
    // Crear worker
    const worker = new Worker(
      new URL('../workers/route-calculator.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event: MessageEvent<RouteWorkerMessage>) => {
      const { type, payload, id, error } = event.data;

      if (type === 'WORKER_READY') {
        setIsReady(true);
        return;
      }

      if (id && pendingRequests.current.has(id)) {
        const { resolve, reject } = pendingRequests.current.get(id)!;
        pendingRequests.current.delete(id);

        if (error) {
          reject(new Error(error));
        } else {
          resolve(payload);
        }

        if (pendingRequests.current.size === 0) {
          setIsProcessing(false);
        }
      }
    };

    worker.onerror = (error) => {
      console.error('Worker error:', error);
      setIsReady(false);
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const sendMessage = useCallback(
    <T,>(type: string, payload: any): Promise<T> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current || !isReady) {
          reject(new Error('Worker not ready'));
          return;
        }

        const id = `${type}-${Date.now()}-${Math.random()}`;
        pendingRequests.current.set(id, { resolve, reject });
        setIsProcessing(true);

        workerRef.current.postMessage({ type, payload, id });

        // Timeout de 10 segundos
        setTimeout(() => {
          if (pendingRequests.current.has(id)) {
            pendingRequests.current.delete(id);
            reject(new Error('Worker timeout'));
            if (pendingRequests.current.size === 0) {
              setIsProcessing(false);
            }
          }
        }, 10000);
      });
    },
    [isReady]
  );

  const calculateRoute = useCallback(
    async (
      origin: [number, number],
      destination: [number, number],
      osmRoutes: [number, number][][],
      maxPoints: number = 20
    ) => {
      return sendMessage<{ route: [number, number][]; length: number }>(
        'CALCULATE_ROUTE',
        { origin, destination, osmRoutes, maxPoints }
      );
    },
    [sendMessage]
  );

  const simplifyRoute = useCallback(
    async (route: [number, number][], tolerance: number) => {
      const result = await sendMessage<{ route: [number, number][] }>(
        'SIMPLIFY_ROUTE',
        { route, tolerance }
      );
      return result.route;
    },
    [sendMessage]
  );

  const updatePosition = useCallback(
    async (route: [number, number][], progress: number) => {
      return sendMessage<{ position: [number, number]; angle: number; segmentIndex: number }>(
        'UPDATE_POSITION',
        { route, progress }
      );
    },
    [sendMessage]
  );

  const calculateDistance = useCallback(
    async (route: [number, number][]) => {
      const result = await sendMessage<{ distance: number }>(
        'CALCULATE_DISTANCE',
        { route }
      );
      return result.distance;
    },
    [sendMessage]
  );

  return {
    calculateRoute,
    simplifyRoute,
    updatePosition,
    calculateDistance,
    isReady,
    isProcessing,
  };
};
