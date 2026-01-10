import { css } from 'styled-components';

const buttonAnimationData = {
  duration: '0.3s',
  curve: 'ease-out',
} as const;

const GRADIENT_STOPS = {
  golden: {
    cysync: {
      start: '#E9B873',
      mid: '#FEDD8F',
      end: '#B78D51',
      midPercent: '37.17%',
    },
    odix: {
      start: '#E1A68C',
      mid: '#FFC8AF',
      end: '#B37D65',
      midPercent: '37%',
    },
  },
  silver: {
    start: '#A2ADB3',
    mid1: '#F3F1F2',
    mid2: '#BCC3C9',
    end: '#DCDFE4',
  },
} as const;

const getPrimaryStops = () => {
  const isOdix =
    typeof window !== 'undefined' &&
    (window as Window & { cysyncEnv?: { VENDOR?: string } }).cysyncEnv
      ?.VENDOR === 'odix';

  return isOdix ? GRADIENT_STOPS.golden.odix : GRADIENT_STOPS.golden.cysync;
};

const createGradientCss = (gradientValue: string, isTextGradient = false) => `
  @property --a {
    syntax: '<angle>';
    inherits: false;
    initial-value: 90deg;
  }
  transition: --a ${buttonAnimationData.duration} ${buttonAnimationData.curve};
  background: ${gradientValue};
  ${
    isTextGradient
      ? `
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;`
      : ''
  }
  &:hover {
    --a: 180deg;
  }
`;

/**
 * Creates a golden gradient CSS for background or text color
 */
export const goldenGradient = (cssProperty: 'background' | 'color') => {
  const stops = getPrimaryStops();
  const gradientValue = `linear-gradient(var(--a), ${stops.start} 0%, ${stops.mid} ${stops.midPercent}, ${stops.end} 100%)`;

  return css`
    ${createGradientCss(gradientValue, cssProperty === 'color')}
  `;
};

/**
 * Creates a silver gradient CSS for background or text color
 */
export const silverGradient = (cssProperty: 'background' | 'color') => {
  const stops = GRADIENT_STOPS.silver;
  const gradientValue = `linear-gradient(var(--a), ${stops.start} 1.67%, ${stops.mid1} 35.99%, ${stops.mid2} 66.2%, ${stops.end} 100%)`;

  return css`
    ${createGradientCss(gradientValue, cssProperty === 'color')}
  `;
};
