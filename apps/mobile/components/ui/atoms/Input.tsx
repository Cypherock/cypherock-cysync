import { FC } from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../themes/color.styled';

const StyledInput = styled.TextInput`
  display: flex;
  padding-vertical: 8px;
  padding-horizontal: 16px;
  align-items: center;
  align-self: stretch;

  border-radius: 8px;
  border-width: 1px;
  border: ${({ theme }) => theme.palette.border.secondary};
  background: ${({ theme }) => theme.palette.background.secondary};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const Input: FC<TextInputProps> = props => {
  return (
    <StyledInput {...props} placeholderTextColor={colors.text.secondary} />
  );
};
