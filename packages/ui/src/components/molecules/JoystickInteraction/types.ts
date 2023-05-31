import {
  joystickArrowCompletedIcon,
  joystickArrowIcon,
  joystickArrowSelectedIcon,
} from '../../../assets/images';
import { ImageProps } from '../../atoms';
import { IndicatorState } from '../../atoms/Indicator';

export type JoystickState = 'unselected' | 'selected' | 'completed';
export type DirectionType = 'up' | 'right' | 'down' | 'left' | 'center';
export interface DirectionProps {
  state: JoystickState | undefined;
}
export type JoystickInteractionProps = Partial<
  Record<DirectionType, JoystickState>
>;

export interface JoystickArrowProps {
  state: JoystickState | undefined;
  type: DirectionType;
}

export const textColorMap: Record<JoystickState, string> = {
  unselected: 'muted',
  selected: 'gold',
  completed: 'success',
};
export const indicatorMap: Record<JoystickState, IndicatorState> = {
  unselected: 'disabled',
  selected: 'focused',
  completed: 'success',
};

export const directionMap: Record<DirectionType, Partial<ImageProps>> = {
  up: {
    rotate: -90,
    top: 24,
    left: 0.5,
    $translateX: -0.5,
  },
  down: {
    rotate: 90,
    bottom: 24,
    left: 0.5,
    $translateX: -0.5,
  },
  left: {
    rotate: -180,
    left: 24,
    top: 0.5,
    $translateY: -0.5,
  },
  right: {
    right: 24,
    top: 0.5,
    $translateY: -0.5,
  },
  center: {},
};

export const typeMap: Record<JoystickState, string> = {
  unselected: joystickArrowIcon,
  selected: joystickArrowSelectedIcon,
  completed: joystickArrowCompletedIcon,
};
