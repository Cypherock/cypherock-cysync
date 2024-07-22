import { Button, ButtonProps } from '@cypherock/cysync-ui';
import React from 'react';

export const SettingsButton: React.FC<ButtonProps> = ({
  children,
  ...props
}) => (
  <Button
    $fontSize={{ def: 12, lg: 14 }}
    px={{ def: '14', lg: 3 }}
    py={{ def: '6', lg: 1 }}
    $borderRadius={{ def: 4, lg: 6 }}
    justify="center"
    {...props}
  >
    {children}
  </Button>
);
