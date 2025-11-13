import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Lazy load components with a loading fallback
 */
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense
      fallback={
        fallback || (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Preload a lazy component
 */
export const preloadComponent = (
  importFunc: () => Promise<{ default: React.ComponentType<any> }>
) => {
  importFunc();
};
