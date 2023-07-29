import React, { FC, ReactNode } from 'react';
import { styled } from 'styled-components';

interface WalletDialogMainContainerProps {
  children: ReactNode;
}
const WalletDialogMainContainerStyle = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-image: ${({ theme }) => theme.palette.background.content};
  border-radius: 0 16px 16px 0;
  position: relative;
`;

export const WalletDialogMainContainer: FC<WalletDialogMainContainerProps> = ({
  children,
}) => (
  <WalletDialogMainContainerStyle>{children}</WalletDialogMainContainerStyle>
);
