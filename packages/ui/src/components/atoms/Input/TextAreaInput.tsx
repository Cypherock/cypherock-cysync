import React, { FC } from 'react';
import styled from 'styled-components';

import { SpacingProps, spacing } from '../../utils';

interface TextAreaInputProps extends SpacingProps {
  placeholder: string;
  icon?: React.ReactNode;
}

const TextAreaInputStyle = styled.div`
  position: relative;
  width: 100%;
`;

const TextArea = styled.textarea<TextAreaInputProps>`
  position: relative;
  width: 100%;
  border: none;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.input};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  margin-bottom: ${({ mb, theme }) =>
    mb !== undefined ? 0 : theme.spacing.two.spacing};

  /* margin-bottom: ${({ theme }) => theme.spacing.two.spacing}; */
  color: white;
  height: 182px;
  position: relative;
  z-index: 1;
  ::placeholder {
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    color: #8b8682;
  }
  ${spacing}
`;

const IconContainer = styled.div`
  position: absolute;
  bottom: 12px;
  right: 8px;
  z-index: 2;
`;

export const TextAreaInput: FC<TextAreaInputProps> = ({
  placeholder,
  icon,
  mb,
}) => (
  <TextAreaInputStyle>
    <TextArea placeholder={placeholder} icon={icon} mb={mb} />
    {icon && <IconContainer>{icon}</IconContainer>}
  </TextAreaInputStyle>
);

TextAreaInput.defaultProps = {
  icon: undefined,
};
