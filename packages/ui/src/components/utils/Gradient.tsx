import { css } from 'styled-components';

const buttonAnimationData = {
  duration: '0.3s',
  curve: 'ease-out',
};

// Original Cypherock golden gradient stops
const cysyncGoldenStops = {
  start: '#E9B873',
  mid: '#FEDD8F',
  end: '#B78D51',
  midPercent: '37.17%',
};

// New Odix primary gradient stops
const odixPrimaryStops = {
  start: '#E1A68C',
  mid: '#FFC8AF',
  end: '#B37D65',
  midPercent: '37%',
};

// Determine current vendor's stops
// Add safety checks for window.cysyncEnv in case it's run in an environment where it's not defined
const currentPrimaryStops =
  typeof window !== 'undefined' && (window as any).cysyncEnv?.VENDOR === 'odix'
    ? odixPrimaryStops
    : cysyncGoldenStops;

export const goldenGradient = (cssProperty: 'background' | 'color') => {
  const { start, mid, end, midPercent } = currentPrimaryStops; // Use the determined stops

  switch (cssProperty) {
    case 'background':
      return css`
        @property --a {
          syntax: '<angle>';
          inherits: false;
          initial-value: 90deg;
        }
        transition: --a ${buttonAnimationData.duration}
          ${buttonAnimationData.curve};
        ${cssProperty}: linear-gradient(
            var(--a),
            ${start} 0%,
            ${mid} ${midPercent},
            ${end} 100%
          );
        &:hover {
          --a: 180deg;
        }
      `;
    case 'color':
      return css`
        @property --a {
          syntax: '<angle>';
          inherits: false;
          initial-value: 90deg;
        }
        transition: --a ${buttonAnimationData.duration}
          ${buttonAnimationData.curve};
        background: linear-gradient(
          var(--a),
          ${start} 0%,
          ${mid} ${midPercent},
          ${end} 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text; /* Standard property */
        text-fill-color: transparent; /* Standard property */
        &:hover {
          --a: 180deg;
        }
      `;
    default:
      return null;
  }
};

export const silverGradient = (cssProperty: 'background' | 'color') => {
  // Silver gradient stops (these are not changing based on vendor in this example)
  const silverStart = '#A2ADB3';
  const silverMid1 = '#F3F1F2';
  const silverMid2 = '#BCC3C9';
  const silverEnd = '#DCDFE4';

  switch (cssProperty) {
    case 'background':
      return css`
        @property --a {
          syntax: '<angle>';
          inherits: false;
          initial-value: 90deg;
        }
        transition: --a ${buttonAnimationData.duration}
          ${buttonAnimationData.curve};
        ${cssProperty}: linear-gradient(
            var(--a),
            ${silverStart} 1.67%,
            ${silverMid1} 35.99%,
            ${silverMid2} 66.2%,
            ${silverEnd} 100%
          );
        &:hover {
          --a: 180deg;
        }
      `;
    case 'color':
      return css`
        @property --a {
          syntax: '<angle>';
          inherits: false;
          initial-value: 90deg;
        }
        transition: --a ${buttonAnimationData.duration}
          ${buttonAnimationData.curve};
        background: linear-gradient(
          var(--a),
          ${silverStart} 1.67%,
          ${silverMid1} 35.99%,
          ${silverMid2} 66.2%,
          ${silverEnd} 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text; /* Standard property */
        text-fill-color: transparent; /* Standard property */
        &:hover {
          --a: 180deg;
        }
      `;
    default:
      return null;
  }
};
