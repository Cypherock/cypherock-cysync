// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { FC } from 'react';
import { styled } from 'styled-components';

import { wallet } from '../../assets';

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WalletDefaultImage = styled.img.attrs({
  src: wallet,
  alt: 'wallet',
  width: '15px',
  height: '12.27px',
})``;

const WalletName = styled.div`
  display: inline;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: #ffffff;
  margin-left: 14px;
`;

export interface WalletProps {
  walletName: string;
}

export const Wallet: FC<WalletProps> = ({ walletName }) => (
  <Flex>
    <WalletDefaultImage /> <WalletName>{walletName}</WalletName>
  </Flex>
);
Wallet.propTypes = {
  walletName: PropTypes.string.isRequired,
};
