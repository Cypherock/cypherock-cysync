import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  padding: 4px 12px;
  align-items: center;
  height: 21px auto;
  gap: 16px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.background.content};
  color: ${({ theme }) => theme.palette.text.muted};
  border: 1px solid ${({ theme }) => theme.palette.border.popup};
`;

interface MessageProps {
  message: string;
}

export const MessageBox: React.FC<MessageProps> = ({ message }) => (
  <MessageContainer>{message}</MessageContainer>
);
