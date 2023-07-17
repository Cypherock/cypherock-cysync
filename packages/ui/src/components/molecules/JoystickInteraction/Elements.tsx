import React from 'react';
import { styled, useTheme } from 'styled-components';

import {
  DirectionProps,
  JoystickArrowProps,
  directionMap,
  indicatorMap,
  textColorMap,
  getArrowColorMap,
  bgColorMap,
  JoystickCenterProps,
} from './types';

import { JoystickArrowIcon } from '../../../assets';
import { theme } from '../../../themes/theme.styled';
import { Typography, Container } from '../../atoms';
import { Indicator } from '../../atoms/Indicator';

export const JoystickIndicator: React.FC<DirectionProps> = ({ state }) => (
  <Indicator state={state ? indicatorMap[state] : undefined} />
);

export const Circle = styled.div`
  width: 156px;
  height: 156px;
  border: 1px solid ${theme.palette.border.popup};
  background: ${theme.palette.background.input};
  border-radius: 78px;
  position: relative;
`;

export const Text: React.FC<{ text: string } & DirectionProps> = props => {
  const { text, state = 'unselected' } = props;
  return (
    <Typography
      variant="h6"
      $fontWeight="medium"
      color={textColorMap[state] as any}
    >
      {text}
    </Typography>
  );
};

export const JoystickArrow: React.FC<JoystickArrowProps> = props => {
  const { type, state = 'unselected' } = props;
  const arrowColorMap = getArrowColorMap(useTheme());
  return (
    <JoystickArrowIcon
      position="absolute"
      fill={arrowColorMap[state]}
      {...directionMap[type]}
    />
  );
};

export const Ring: React.FC<JoystickCenterProps> = ({ children, ...props }) => (
  <Container
    height={120}
    width={120}
    $bgColor={bgColorMap[props.state ?? 'selected'] as any}
    $borderRadius={60}
    {...props}
  >
    <Container height={116} width={116} $bgColor="primary" $borderRadius={58}>
      {children}
    </Container>
  </Container>
);
