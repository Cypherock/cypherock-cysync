import { FC, ReactNode } from 'react';
import { ViewProps } from 'react-native';
import styled, { css } from 'styled-components/native';
import { Typography } from './Typography';

type MessageBoxType = 'warning' | 'info' | 'danger';

interface MessageBoxProps extends ViewProps {
  type?: MessageBoxType;
  icon?: ReactNode;
  text: string;
}

const MessageBoxTypeMap: Record<MessageBoxType, any> = {
  warning: css`
    border-color: ${({ theme }) => theme.palette.border.warning};
    background: ${({ theme }) => theme.palette.background.warning};
  `,
  info: css`
    border-color: ${({ theme }) => theme.palette.border.primary};
    background: ${({ theme }) => theme.palette.background.secondary};
  `,
  danger: css`
    border-color: ${({ theme }) => theme.palette.border.error};
    background: ${({ theme }) => theme.palette.background.error};
  `,
};

const StyledView = styled.View<Omit<MessageBoxProps, 'text' | 'icon'>>`
  display: flex;
  flex-direction: row;
  padding: 8px 16px;
  align-items: center;
  gap: 16px;
  align-self: stretch;

  border-radius: 8px;
  border: 1px solid;
  color: ${({ theme }) => theme.palette.text.secondary};

  ${({ type = 'info' }) => MessageBoxTypeMap[type]};
`;

export const MessageBox: FC<MessageBoxProps> = ({ icon, text, ...props }) => {
  return (
    <StyledView {...props}>
      {icon}
      <Typography type="para">{text}</Typography>
    </StyledView>
  );
};
