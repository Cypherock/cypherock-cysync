import React from 'react';

import { Flex, Container } from '../../atoms';

export interface DialogBoxBackgroundBarProps {
  leftComponent?: React.ReactNode;
  middleComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  useLightPadding?: boolean;
}

export const DialogBoxBackgroundBar: React.FC<
  DialogBoxBackgroundBarProps & { position: 'top' | 'bottom' }
> = ({
  leftComponent,
  middleComponent,
  rightComponent,
  position,
  useLightPadding,
}) => {
  const positionProps = position === 'top' ? { top: 0 } : { bottom: 0 };

  return (
    <Flex
      position="absolute"
      {...positionProps}
      width="full"
      justify="space-between"
      align="center"
      p={{
        def: 1,
        lg: useLightPadding ? '20' : 5,
      }}
    >
      <Flex width="auto" justify="flex-start">
        <Container>{leftComponent}</Container>
      </Flex>

      <Flex width="auto" justify="center">
        <Container>{middleComponent}</Container>
      </Flex>

      <Flex width="auto" justify="flex-end">
        <Container>{rightComponent}</Container>
      </Flex>
    </Flex>
  );
};

DialogBoxBackgroundBar.defaultProps = {
  leftComponent: undefined,
  middleComponent: undefined,
  rightComponent: undefined,
  useLightPadding: undefined,
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
