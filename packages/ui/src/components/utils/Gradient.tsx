import { css } from 'styled-components';

const buttonAnimationData = {
  duration: '0.3s',
  curve: 'ease-out',
};

export const goldenGradient = (cssProperty: 'background' | 'color') => {
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
            #e9b873 0.19%,
            #fedd8f 37.17%,
            #b78d51 100.19%
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
          #e9b873 0.19%,
          #fedd8f 37.17%,
          #b78d51 100.19%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        &:hover {
          --a: 180deg;
        }
      `;
    default:
      return null;
  }
};
