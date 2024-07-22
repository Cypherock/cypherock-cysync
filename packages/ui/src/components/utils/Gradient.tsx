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

export const silverGradient = (cssProperty: 'background' | 'color') => {
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
            #A2ADB3 1.67%,
            #F3F1F2 35.99%,
            #BCC3C9 66.2%,
            #DCDFE4 100%
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
          #a2adb3 1.67%,
          #f3f1f2 35.99%,
          #bcc3c9 66.2%,
          #dcdfe4 100%
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
