import React from 'react';
import styled from 'styled-components';

interface MessageBoxProps {
  heading: string;
  placeholder: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.palette.background.primary};
`;

const Heading = styled.h2`
  color: ${({ theme }) => theme.palette.text.muted};
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 8px;
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

const MessageBox: React.FC<MessageBoxProps> = ({ heading, placeholder }) => (
  <Container>
    <Heading>{heading}</Heading>
    <TextArea placeholder={placeholder} />
  </Container>
);

export default MessageBox;
