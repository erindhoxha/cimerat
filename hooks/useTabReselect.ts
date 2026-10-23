import { useEffect, useRef } from 'react';
import type { TabName } from '@/components/BottomBar/BottomBar';

// The bottom bar lives in the root layout (outside the tab navigator), so it can't emit React
// Navigation's tabPress. This tiny event lets a tab screen react when its tab is tapped again.
const listeners = new Set<(tab: TabName) => void>();

export const emitTabReselect = (tab: TabName) => listeners.forEach((listener) => listener(tab));

export const useTabReselect = (tab: TabName, onReselect: () => void) => {
  const callback = useRef(onReselect);
  callback.current = onReselect;

  useEffect(() => {
    const listener = (pressed: TabName) => pressed === tab && callback.current();
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [tab]);
};
