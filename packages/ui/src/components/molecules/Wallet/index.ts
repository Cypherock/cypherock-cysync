import styled from 'styled-components';

export * from './WalletHeader';

export const WalletContainer = styled.div`
  border-bottom-right-radius: 24px;
  background: ${({ theme }) => theme.palette.content.content};
`;
