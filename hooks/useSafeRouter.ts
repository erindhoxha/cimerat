import { useMemo } from 'react';
import { useRouter } from 'expo-router';

// Shared across the whole app, so a quick double tap (or tapping two cards at once) opens one page, not two
const LOCK_MS = 600;
let lastPush = 0;

// expo-router's router, with push() ignoring repeat calls while a page is opening
export const useSafeRouter = () => {
  const router = useRouter();

  return useMemo(
    () => ({
      ...router,
      push: ((...args: Parameters<typeof router.push>) => {
        const now = Date.now();
        if (now - lastPush < LOCK_MS) return;
        lastPush = now;
        router.push(...args);
      }) as typeof router.push,
    }),
    [router],
  );
};
