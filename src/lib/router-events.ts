'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type TRouteState = 'idle' | 'loading' | 'complete';

export function useRouteProgress() {
  const [state, setState] = useState<TRouteState>('idle');
  const router = useRouter();

  useEffect(() => {
    function handleStart() {
      setState('loading');
    }

    function handleComplete() {
      setState('complete');
      // Auto-reset after animation completes
      const timer = setTimeout(() => setState('idle'), 1200);
      return () => clearTimeout(timer);
    }

    // Listen to route changes through navigation events
    // In Next.js 13+ app router, we need to handle this differently
const originalPush: typeof router.push = router.push;
const originalReplace: typeof router.replace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    router.push = function(...args) {
      handleStart();
      originalPush.apply(this, args as any);
      setTimeout(handleComplete, 100);
    };

    router.replace = function(...args) {
      handleStart();
      originalReplace.apply(this, args as any);
      setTimeout(handleComplete, 100);
    };

    router.back = function() {
      handleStart();
      originalBack.apply(this);
      setTimeout(handleComplete, 100);
    };

    router.forward = function() {
      handleStart();
      originalForward.apply(this);
      setTimeout(handleComplete, 100);
    };

    // Cleanup
    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [router]);

  return { state, isLoading: state === 'loading' };
}

export function useProgressBar() {
  const { isLoading } = useRouteProgress();
  return { showProgress: isLoading };
}
