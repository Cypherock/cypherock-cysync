import React from 'react';

import styled from 'styled-components';

import { WidthProps, width } from '../../utils';
import { Typography } from '../../atoms';

interface MessageBoxProps extends WidthProps {
  heading: string;
  placeholder: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.palette.background.primary};
  ${width}
`;

const TextArea = styled.textarea`
  width: 800px;
  height: 120px;
  resize: both;
  padding: 12px 24px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.palette.border.separator};
  border-radius: var(--8-px, 8px);
  background-color: ${({ theme }) =>
    theme.palette.background.separatorSecondary};
  color: ${({ theme }) => theme.palette.text.white};
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  overflow-y: visible;
  &::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const MessageBox: React.FC<MessageBoxProps> = ({
  heading,
  placeholder,
  ...props
}) => (
  <Container {...props}>
    <Typography
      color="muted"
      $fontFamily="normal"
      $fontWeight="normal"
      mb="8px"
      $fontSize={16}
    >
      {heading}
    </Typography>
    <TextArea placeholder={placeholder} />
  </Container>
);

export default MessageBox;
