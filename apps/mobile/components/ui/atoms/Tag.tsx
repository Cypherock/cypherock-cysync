import styled from 'styled-components/native';

export const Tag = styled.Text`
  display: inline-flex;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 16px;
  font-size: ${({ theme }) => theme.typography.body.tag.fontSize}px;
  background: ${({ theme }) => theme.palette.background.tag};
  color: ${({ theme }) => theme.palette.text.accent};
`;
