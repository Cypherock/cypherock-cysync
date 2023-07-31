import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';

function getMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: any) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return matches;
}

function capitalizeFirstLetter(str: string) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export const useMediaQuery = () => {
  const theme = useTheme();
  const screens = theme?.screens;

  const breakpoints: Record<string, string | boolean> = {};

  for (const bp in screens) {
    if (Object.prototype.hasOwnProperty.call(screens, bp)) {
      breakpoints[`is${capitalizeFirstLetter(bp)}`] = getMediaQuery(
        screens[bp],
      );
    }
  }

  breakpoints.active = 'def';

  if (breakpoints.isDef) breakpoints.active = 'def';
  if (breakpoints.isMd) breakpoints.active = 'md';
  if (breakpoints.isLg) breakpoints.active = 'lg';
  if (breakpoints.isXl) breakpoints.active = 'xl';

  return breakpoints;
};
