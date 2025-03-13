import Entypo from '@expo/vector-icons/Entypo';
import { TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';

interface FilterButtonProps extends TouchableOpacityProps {
  value?: string;
  placeholder: string;
}

const ButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  flex-grow: 0;

  width: auto;

  padding-horizontal: 12px;
  padding-vertical: 8px;
  border-radius: 8px;
  gap: 8px;

  border: 0.5px solid ${({ theme }) => theme.palette.border.secondary};
  background: ${({ theme, disabled }) =>
    disabled ? '#272524' : theme.palette.background.secondary};
`;

const ValueText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.body.label.fontSize}px;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const PlaceholderText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.body.label.fontSize}px;
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.text.muted : theme.palette.text.secondary};
`;

export function FilterButton({
  value,
  placeholder,
  ...props
}: FilterButtonProps) {
  return (
    <ButtonContainer {...props}>
      {value ? (
        <ValueText>{value}</ValueText>
      ) : (
        <PlaceholderText disabled={props.disabled}>
          {placeholder}
        </PlaceholderText>
      )}
      <Entypo name="triangle-down" size={16} color="white" />
    </ButtonContainer>
  );
}
