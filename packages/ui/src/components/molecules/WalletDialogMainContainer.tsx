import React, { FC, ReactNode } from 'react';
import { styled } from 'styled-components';

interface WalletDialogMainContainerProps {
  children: ReactNode;
}
const WalletDialogMainContainerStyle = styled.div`
  display: flex;
  width: 100%;
  height: 80vh;
  flex-direction: column;
  background-image: ${({ theme }) => theme.palette.background.content};
  border-radius: 0 16px 16px 0;
  position: relative;
  overflow-y: hidden;
  /* padding-right: 50px;
  margin-right: 50px; */
`;

export const WalletDialogMainContainer: FC<WalletDialogMainContainerProps> = ({
  children,
}) => (
  <WalletDialogMainContainerStyle>{children}</WalletDialogMainContainerStyle>
);
