import React, { FC } from 'react';
import styled from 'styled-components';
import { Flex, FlexProps } from './Flex';
import { LangDisplay } from './LangDisplay';
import { Typography } from './Typography';

interface CheckBoxProps {
  checked: boolean;
  onChange: () => void;
  id: string;
  label?: string;
  flexProps?: FlexProps;
}

const CheckBoxWrapper = styled.div`
  width: 16px;
  height: 16px;
`;

const CheckBoxStyle = styled.input.attrs(props => ({
  type: 'checkbox',
  id: props.id,
}))`
  -webkit-appearance: none;
`;

const CheckBoxIcon = styled.div`
  background-image: ${({ theme }) => theme.palette.golden};
  width: 8px;
  height: 8px;
  position: absolute;
  top: 4px;
  left: 4px;
  border-radius: 1px;
`;

const CheckBoxLabelStyle = styled.label.attrs(props => ({
  htmlFor: props.id,
}))`
  display: inline-block;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-image: ${({ theme }) => theme.palette.golden};
  position: relative;

  &:before {
    content: '';
    width: 13px;
    height: 13px;
    border-radius: 2px;
    position: absolute;
    top: 1.5px;
    left: 1.5px;
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
}) => (
  <Flex align="center" $alignSelf="start" {...flexProps}>
    <CheckBoxWrapper>
      <CheckBoxStyle checked={checked} onChange={onChange} id={id} />
      <CheckBoxLabelStyle id={id}>
        {checked && <CheckBoxIcon id={id} />}
      </CheckBoxLabelStyle>
    </CheckBoxWrapper>

    {label && (
      <CheckBoxTextLabelStyle id={id}>
        <Typography $fontSize={14} color="muted" $textAlign="left" ml={2}>
          <LangDisplay text={label} />
        </Typography>
      </CheckBoxTextLabelStyle>
    )}
  </Flex>
);

CheckBox.defaultProps = {
  label: undefined,
  flexProps: undefined,
};
