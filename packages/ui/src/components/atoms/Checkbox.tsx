import React from 'react';
import styled from 'styled-components';

import { Flex, FlexComponentProps } from './Flex';
import { LangDisplay } from './LangDisplay';
import { Typography } from './Typography';

interface ISize {
  size?: 'small' | 'big';
}
interface CheckBoxProps extends ISize {
  checked: boolean;
  onChange: () => void;
  id?: string;
  label?: string;
  flexProps?: FlexComponentProps;
  isDisabled?: boolean;
}

const CheckBoxWrapper = styled.div<ISize>`
  display: flex;
  width: ${({ size }) => (size === 'big' ? '16px' : '12px')};
  height: ${({ size }) => (size === 'big' ? '16px' : '12px')};
`;

const CheckBoxStyle = styled.input.attrs(props => ({
  type: 'checkbox',
  id: props.id,
}))`
  -webkit-appearance: none;
`;

const CheckBoxIcon = styled.div<ISize>`
  background-image: ${({ theme }) => theme.palette.golden};
  width: ${({ size }) => (size === 'big' ? '8px' : '7px')};
  height: ${({ size }) => (size === 'big' ? '8px' : '7px')};
  position: absolute;
  top: ${({ size }) => (size === 'big' ? '4px' : '2.75px')};
  left: ${({ size }) => (size === 'big' ? '4px' : '2.5px')};
  border-radius: 1px;
`;

interface StyledLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  $isHovered?: boolean;
}

const CheckBoxLabelStyle = styled.label.attrs<StyledLabelProps & ISize>(
  props => ({
    htmlFor: props.id,
  }),
)<{ disabled?: boolean }>`
  display: inline-block;
  width: ${({ size }) => (size === 'big' ? '16px' : '12px')};
  height: ${({ size }) => (size === 'big' ? '16px' : '12px')};
  border-radius: 3px;
  background-image: ${({ theme, disabled }) =>
    disabled
      ? 'linear-gradient(to right, #5A5349, #756C61)'
      : theme.palette.golden};
  ${props =>
    props.disabled &&
    `
      cursor: not-allowed;
      opacity: 0.6;
    `}
  position: relative;

  &:before {
    content: '';
    width: ${({ size }) => (size === 'big' ? '12px' : '9px')};
    height: ${({ size }) => (size === 'big' ? '12px' : '9px')};
    border-radius: 2px;
    position: absolute;
    top: ${({ size }) => (size === 'big' ? '2px' : '1.75px')};
    left: ${({ size }) => (size === 'big' ? '2px' : '1.5px')};
    background-image: ${({ theme }) => theme.palette.background.sideBar};
  }

  ${CheckBoxStyle}:focus + & {
    outline: 1px solid ${({ theme }) => theme.palette.background.golden};
  }
  outline: ${({ $isHovered, theme }) =>
    $isHovered ? `1px solid ${theme.palette.background.golden}` : 'none'};
`;

const CheckBoxTextLabelStyle = styled.label.attrs<{ disabled: boolean }>(
  props => ({
    htmlFor: props.id,
  }),
)`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`;

export const CheckBox = React.forwardRef<
  HTMLInputElement,
  CheckBoxProps & { $isHovered?: boolean }
>(
  (
    { checked, onChange, id, label, flexProps, size, isDisabled, $isHovered },
    ref,
  ) => (
    <Flex align="center" $alignSelf="start" {...flexProps}>
      <CheckBoxWrapper size={size}>
        <CheckBoxStyle
          checked={checked}
          onChange={onChange}
          id={id}
          disabled={isDisabled}
          ref={ref}
        />
        <CheckBoxLabelStyle
          id={id}
          size={size}
          $isHovered={$isHovered}
          disabled={isDisabled}
        >
          {checked && <CheckBoxIcon id={id} size={size} />}
        </CheckBoxLabelStyle>
      </CheckBoxWrapper>

      {label && (
        <CheckBoxTextLabelStyle id={id}>
          <Typography
            $fontSize={size === 'big' ? 16 : 14}
            color="muted"
            $textAlign="left"
            ml={2}
          >
            <LangDisplay text={label} />
          </Typography>
        </CheckBoxTextLabelStyle>
      )}
    </Flex>
  ),
);

CheckBox.displayName = 'CheckBox';

CheckBox.defaultProps = {
  label: undefined,
  flexProps: undefined,
  isDisabled: false,
  id: undefined,
  size: 'big',
  $isHovered: false,
};
