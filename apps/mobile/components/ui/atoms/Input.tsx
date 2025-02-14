import { FC } from 'react';
import { TextInputProps, TouchableOpacity, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../themes/color.styled';

interface IInputProps extends TextInputProps {
  label: string;
  actionText?: string;
  onAction?: () => void;
  error?: string;
  containerStyle?: ViewProps['style'];
}

const StyledContainer = styled.View`
  width: 100%;
  gap: 6px;
`;

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

const StyledText = styled.Text<{ textAlign?: AlignSetting }>`
  font-weight: ${({ theme }) => theme.typography.body.shared.fontWeight};
  font-size: ${({ theme }) => theme.typography.body.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.label.lineHeight}px;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: ${({ textAlign }) => textAlign ?? 'left'};
`;

const ErrorText = styled.Text`
  flex: 2;
  color: ${props => props.theme.palette.text.error};
  font-size: ${props => props.theme.typography.body.label.fontSize}px;
  white-space: pre-wrap;
`;

const Flex = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Input: FC<IInputProps> = props => {
  return (
    <StyledContainer>
      {props.label && <StyledText>{props.label}</StyledText>}
      <StyledInput {...props} placeholderTextColor={colors.text.secondary} />
      {((props.actionText && props.onAction) || props.error) && (
        <Flex>
          <ErrorText>{props.error}</ErrorText>
          {props.actionText && props.onAction && (
            <TouchableOpacity onPress={props.onAction}>
              <StyledText textAlign="right">{props.actionText}</StyledText>
            </TouchableOpacity>
          )}
        </Flex>
      )}
    </StyledContainer>
  );
};
