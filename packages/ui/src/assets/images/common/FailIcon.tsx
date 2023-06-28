import React from 'react';

import { IconProps } from './DeviceUpdateIcon';

import { theme } from '../../../themes/theme.styled';

export const FailIcon: React.FC<IconProps> = ({ color }) => (
  <svg
    width="56"
    height="48"
    viewBox="0 0 56 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="28" cy="24" r="22.5" stroke={color} strokeWidth="3" />
    <path
      d="M37 15L19 33M19 15L37 33"
      stroke={color}
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

FailIcon.defaultProps = {
  color: theme.palette.warn.main,
} as IconProps;
