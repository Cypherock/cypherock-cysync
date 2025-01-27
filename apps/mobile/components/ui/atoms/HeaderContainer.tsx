import styled from 'styled-components/native';

export const HeaderContainer = styled.View`
  flex-direction: row;
  background: ${({ theme }) => theme.palette.background.primary};
  padding-horizontal: 16px;
  padding-vertical: 12px;
  align-items: center;
  gap: 16px;
`;
