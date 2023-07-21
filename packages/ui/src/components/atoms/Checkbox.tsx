import React, { FC } from 'react';
import styled from 'styled-components';

import { Flex, FlexProps } from './Flex';
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
  flexProps?: FlexProps;
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

const CheckBoxLabelStyle = styled.label.attrs<ISize>(props => ({
  htmlFor: props.id,
}))`
  display: inline-block;
  cursor: pointer;
  width: ${({ size }) => (size === 'big' ? '16px' : '12px')};
  height: ${({ size }) => (size === 'big' ? '16px' : '12px')};
  border-radius: 3px;
  background-image: ${({ theme }) => theme.palette.golden};
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
`;

const CheckBoxTextLabelStyle = styled.label.attrs(props => ({
  htmlFor: props.id,
}))`
  cursor: pointer;
`;

export const CheckBox: FC<CheckBoxProps> = ({
  checked,
  onChange,
  id,
  label,
  flexProps,
  size,
  isDisabled,
}) => (
  <Flex align="center" $alignSelf="start" {...flexProps}>
    <CheckBoxWrapper size={size}>
      <CheckBoxStyle
        checked={checked}
        onChange={onChange}
        id={id}
        disabled={isDisabled}
      />

      <CheckBoxLabelStyle id={id} size={size}>
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
);

CheckBox.defaultProps = {
  label: undefined,
  flexProps: undefined,
  isDisabled: false,
  id: undefined,
  size: 'big',
};
