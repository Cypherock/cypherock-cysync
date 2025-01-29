import Feather from '@expo/vector-icons/Feather';
import { Card } from './Card';
import styled from 'styled-components/native';
import { colors } from '../themes/color.styled';

const Input = styled.TextInput`
  flex: 1;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.body.body.fontSize}px;
`;

interface SearchProps {
  value: string;
  onChange: (v: string) => void;
}

export function Search({ value, onChange }: SearchProps) {
  return (
    <Card
      borderColor={'secondary'}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <Input
        placeholder="Search..."
        value={value}
        onChangeText={v => onChange(v)}
        placeholderTextColor={colors.text.secondary}
      />
      <Feather name="search" size={24} color="white" />
    </Card>
  );
}
