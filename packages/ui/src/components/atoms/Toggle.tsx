import React, { ChangeEvent, useMemo } from 'react';
import styled from 'styled-components';

import { Flex } from './Flex';
import { LangDisplay } from './LangDisplay';
import { Throbber } from './Throbber';
import { Typography } from './Typography';

import { goldenGradient } from '../utils/Gradient';

export interface ToggleProps {
  checked: boolean;
  onToggle?: (checked: boolean) => void;
  variant?: 'large' | 'tiny';
  onText?: string;
  offText?: string;
  isLoading?: boolean;
}

interface ToggleAttributes {
  checked: boolean;
  $discSize: number;
  $discMargin: number;
  $width: number;
}

const ToggleSwitch = styled.label<ToggleAttributes>`
  cursor: pointer;
  position: relative;
  display: inline-block;
  width: ${({ $width, $discSize, $discMargin }) =>
    Math.max($width, $discSize + 2 * $discMargin)}px;
  height: ${({ $discSize, $discMargin }) => $discSize + 2 * $discMargin}px;
  border-radius: ${({ $discSize, $discMargin }) =>
    $discSize / 2 + $discMargin}px;
  ${({ checked, theme }) =>
    checked
      ? goldenGradient('background')
      : `background-color: ${theme.palette.background.separator}`};
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
`;

const Slider = styled.span<ToggleAttributes>`
  position: absolute;
  height: ${({ $discSize }) => $discSize}px;
  width: ${({ $discSize }) => $discSize}px;
  top: ${({ $discMargin }) => $discMargin}px;
  bottom: ${({ $discMargin }) => $discMargin}px;
  left: ${({ checked, $discSize, $discMargin }) =>
    checked ? `calc(100% - ${$discSize + $discMargin}px)` : `${$discMargin}px`};
  background-color: ${({ checked, theme }) =>
    checked
      ? theme.palette.background.toggleActive
      : theme.palette.background.toggle};
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
  border-radius: 50%;
`;

const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const CheckedNode = styled.div<ToggleAttributes>`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  opacity: ${({ checked }) => (checked ? 1 : 0)};
  padding-right: ${({ $discMargin, $discSize }) => $discSize + $discMargin}px;
  padding-left: ${({ $discMargin }) => $discMargin}px;
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
`;

const UnCheckedNode = styled.div<ToggleAttributes>`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  opacity: ${({ checked }) => (checked ? 0 : 1)};
  padding-left: ${({ $discMargin, $discSize }) => $discSize + $discMargin}px;
  padding-right: ${({ $discMargin }) => $discMargin}px;
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
`;

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onToggle,
  variant,
  onText,
  offText,
  isLoading,
}) => {
  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    if (onToggle) {
      onToggle(event.target.checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (onToggle) {
        onToggle(!checked);
      }
    }
  };

  const variantProps = useMemo(() => {
    if (variant === 'large')
      return {
        $width: 72,
        $discMargin: 4,
        $discSize: 24,
      };
    return {
      $discSize: 10,
      $discMargin: 3,
      $width: 32,
    };
  }, [variant]);

  const toggleAttributes = {
    ...variantProps,
    checked,
  };

  return (
    <ToggleSwitch {...toggleAttributes} tabIndex={0} onKeyDown={handleKeyDown}>
      {isLoading && (
        <Flex width="100%" height="100%" align="center" justify="center">
          <Throbber size={15} strokeWidth={2} />
        </Flex>
      )}
      {!isLoading && (
        <>
          <Checkbox
            type="checkbox"
            checked={checked}
            onChange={handleCheck}
            tabIndex={-1}
          />
          {variant === 'large' && onText && (
            <CheckedNode {...toggleAttributes}>
              <Typography
                $textAlign="center"
                $fontWeight="semibold"
                color="black"
              >
                <LangDisplay text={onText} />
              </Typography>
            </CheckedNode>
          )}
          {variant === 'large' && offText && (
            <UnCheckedNode {...toggleAttributes}>
              <Typography
                $textAlign="center"
                $fontWeight="semibold"
                color="muted"
              >
                <LangDisplay text={offText} />
              </Typography>
            </UnCheckedNode>
          )}
          <Slider {...toggleAttributes} />
        </>
      )}
    </ToggleSwitch>
  );
};

Toggle.defaultProps = {
  onToggle: undefined,
  onText: undefined,
  offText: undefined,
  variant: 'tiny',
  isLoading: false,
};
