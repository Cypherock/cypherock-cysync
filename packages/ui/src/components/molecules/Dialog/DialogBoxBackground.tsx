import React from 'react';

import { Flex, Container } from '../../atoms';

export interface DialogBoxBackgroundBarProps {
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}
export const DialogBoxBackgroundBar: React.FC<
  DialogBoxBackgroundBarProps & { position: 'top' | 'bottom' }
> = ({ leftComponent, rightComponent, position }) => {
  const positionProps = position === 'top' ? { top: 0 } : { bottom: 0 };
  return (
    <Flex
      position="absolute"
      {...positionProps}
      width="full"
      justify="space-between"
      p={{
        def: 1,
        lg: 5,
      }}
    >
      <Container>{leftComponent}</Container>
      <Container>{rightComponent}</Container>
    </Flex>
  );
};

DialogBoxBackgroundBar.defaultProps = {
  leftComponent: undefined,
  rightComponent: undefined,
};

export const DialogBoxBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Container
    $bgColor="contentGradient"
    height="full"
    width="full"
    align="center"
    position="relative"
    justify="center"
    display="flex"
    grow={1}
  >
    {children}
  </Container>
);
