import React from 'react';

import {
  DividerHorizontalStyle,
  DividerVerticalStyle,
  DividerProps,
} from './Divider.styled';

export const Divider = ({ variant, ...props }: DividerProps) => {
  switch (variant) {
    case 'vertical':
      return <DividerVerticalStyle {...props} />;
    default:
      return <DividerHorizontalStyle {...props} />;
  }
};
