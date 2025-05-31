import logger from '@/utils/logger';
import { useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';

export function NavigationLogger() {
  const from = useRef('');
  const segments = useSegments();

  useEffect(() => {
    const route = segments.filter(v => v[0] !== '(').join('/');
    if (!route) return;
    if (from.current.length === 0) {
      logger.info(`Route changed to [${route}]`);
      from.current = route;
    } else {
      logger.info(`Route changed from [${from.current}] to [${route}]`);
      from.current = route;
    }
  }, [segments]);

  return null;
}
