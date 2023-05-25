import React from 'react';
import { styled } from 'styled-components';
import { theme } from '../../themes/theme.styled';
import { ImageProps, Typography, Image, Container } from '../atoms';
import {
  joystickArrowCompletedIcon,
  joystickArrowIcon,
  joystickArrowSelectedIcon,
} from '../../assets/images';
import { UtilsProps } from '../utils';

type JoystickState = 'unselected' | 'selected' | 'completed';
type DirectionType = 'up' | 'right' | 'down' | 'left' | 'center';
interface DirectionProps {
  state: JoystickState | undefined;
}

export type JoystickInteractionProps = Partial<
  Record<DirectionType, JoystickState>
>;

const Indicator = styled.div<DirectionProps>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background: ${props => {
    if (props.state === 'completed') return theme.palette.success.main;
    if (props.state === 'selected') return theme.palette.golden;
    return 'transparent';
  }};
  ${props =>
    props.state === 'unselected' &&
    `border: 2px solid ${theme.palette.text.muted};`}
`;

const Circle = styled.div`
  width: 156px;
  height: 156px;
  border: 1px solid ${theme.palette.border.popup};
  background: ${theme.palette.background.input};
  border-radius: 78px;
  position: relative;
`;

const textColorMap: Record<JoystickState, string> = {
  unselected: 'muted',
  selected: 'gold',
  completed: 'success',
};

const Text: React.FC<{ text: string } & DirectionProps> = props => {
  const { text, state = 'unselected' } = props;
  return (
    <Typography variant="h6" font="medium" color={textColorMap[state] as any}>
      {text}
    </Typography>
  );
};

interface JoystickArrowProps {
  state: JoystickState | undefined;
  type: DirectionType;
}

const directionMap: Record<DirectionType, Partial<ImageProps>> = {
  up: {
    rotate: -90,
    top: 24,
    left: 0.5,
    translateX: -0.5,
  },
  down: {
    rotate: 90,
    bottom: 24,
    left: 0.5,
    translateX: -0.5,
  },
  left: {
    rotate: -180,
    left: 24,
    top: 0.5,
    translateY: -0.5,
  },
  right: {
    right: 24,
    top: 0.5,
    translateY: -0.5,
  },
  center: {},
};

const typeMap: Record<JoystickState, string> = {
  unselected: joystickArrowIcon,
  selected: joystickArrowSelectedIcon,
  completed: joystickArrowCompletedIcon,
};

const JoystickArrow: React.FC<JoystickArrowProps> = props => {
  const { type, state = 'unselected' } = props;
  return (
    <Image
      src={typeMap[state]}
      alt="Arrow"
      position="absolute"
      {...directionMap[type]}
    />
  );
};

const Ring: React.FC<UtilsProps> = ({ children, ...props }) => (
  <Container height={120} width={120} $bgColor="golden" rounded={60} {...props}>
    <Container height={116} width={116} $bgColor="primary" rounded={58}>
      {children}
    </Container>
  </Container>
);

export const JoystickInteraction: React.FC<
  JoystickInteractionProps
> = props => {
  const { up, right, down, left, center } = props;
  return (
    <Container mb={7} display="flex" direction="column" gap={12}>
      {center === undefined && (
        <>
          <Container>
            <Container gap={8} direction="column">
              <Text text="Up" state={up} />
              <Indicator state={up} />
            </Container>
          </Container>
          <Container gap={12}>
            <Container justify="flex-end" width={66} gap={8}>
              <Text text="Left" state={left} />
              <Indicator state={left} />
            </Container>
            <Circle>
              <JoystickArrow type="up" state={up} />
              <JoystickArrow type="right" state={right} />
              <Container
                width={14}
                height={14}
                rounded={7}
                $bgColor="muted"
                position="absolute"
                top={0.5}
                left={0.5}
                translateX={-0.5}
                translateY={-0.5}
              />
              <JoystickArrow type="down" state={down} />
              <JoystickArrow type="left" state={left} />
            </Circle>
            <Container justify="flex-start" width={66} gap={8}>
              <Indicator state={right} />
              <Text text="Right" state={right} />
            </Container>
          </Container>
          <Container>
            <Container gap={8} direction="column">
              <Indicator state={down} />
              <Text text="Down" state={down} />
            </Container>
          </Container>
        </>
      )}
      {center !== undefined && (
        <Container height={192} position="relative">
          <Ring
            position="absolute"
            $animDelay={0.6}
            animate="pulse"
            $animDuration={2}
          />
          <Ring position="absolute" animate="pulse" $animDuration={2} />
          <Ring position="absolute">
            <Container gap={8} direction="column">
              <Container width={12} height={12} rounded={6} $bgColor="golden" />
              <Typography variant="h5" color="gold">
                Press
              </Typography>
            </Container>
          </Ring>
        </Container>
      )}
    </Container>
  );
};

Indicator.defaultProps = {
  state: 'unselected',
};
