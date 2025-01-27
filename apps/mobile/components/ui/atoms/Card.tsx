import styled from 'styled-components/native';
import { ThemeType } from '../themes';
import { ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  borderColor?: keyof ThemeType['palette']['border'];
}

export const Card = styled.View<CardProps>`
  display: flex;
  padding-vertical: 8px;
  padding-horizontal: 16px;
  align-items: center;
  align-self: stretch;
  overflow: hidden;

  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ borderColor, theme }) =>
    borderColor
      ? theme.palette.border[borderColor]
      : theme.palette.border.primary};
  background: ${({ theme }) => theme.palette.background.secondary};
`;
