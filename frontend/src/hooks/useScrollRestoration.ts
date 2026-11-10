import { useRef, useCallback } from 'react';

/**
 * Smart Scroll Restoration Hook
 * Preserves route scroll offsets and restores them on back navigation or internal transitions.
 */
export function useScrollRestoration() {
  const scrollPositionsRef = useRef<Record<string, number>>({});
  const previousRouteRef = useRef<string>('home');

  const saveScrollPosition = useCallback((route: string) => {
    if (typeof window !== 'undefined') {
      scrollPositionsRef.current[route] = window.scrollY;
    }
  }, []);

  const restoreScrollPosition = useCallback((route: string) => {
    if (typeof window !== 'undefined') {
      const saved = scrollPositionsRef.current[route] ?? 0;
      window.scrollTo({ top: saved, behavior: 'smooth' });
    }
  }, []);

  const scrollToTarget = useCallback((elementId: string) => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  return {
    scrollPositionsRef,
    previousRouteRef,
    saveScrollPosition,
    restoreScrollPosition,
    scrollToTarget
  };
}

export default useScrollRestoration;
