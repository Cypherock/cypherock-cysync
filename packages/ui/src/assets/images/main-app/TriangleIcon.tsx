import React, { FC } from 'react';

interface TriangleIconProps {
  direction?: 'up' | 'down';
}

export const TriangleIcon: FC<TriangleIconProps> = ({ direction = 'up' }) => (
  <svg
    width="9"
    height="7"
    transform={direction === 'down' ? 'scale(1 -1)' : 'scale(1 1)'}
    viewBox="0 0 9 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id="Vector"
      d="M0.94213 6.99997C0.775807 6.99997 0.649257 6.92592 0.56248 6.77782C0.475702 6.62944 0.479318 6.48293 0.573327 6.3383L4.1312 0.643535C4.21797 0.506138 4.34091 0.437439 4.5 0.437439C4.65909 0.437439 4.78203 0.506138 4.8688 0.643535L8.42667 6.3383C8.52068 6.48293 8.5243 6.62944 8.43752 6.77782C8.35074 6.92592 8.22419 6.99997 8.05787 6.99997H0.94213Z"
      fill="white"
    />
  </svg>
);

TriangleIcon.defaultProps = {
  direction: 'up',
};
