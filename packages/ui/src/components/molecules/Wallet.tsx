// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { FC } from 'react';
import { styled } from 'styled-components';
import { WalletName } from '../../assets';

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WalletTitle = styled.div`
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
  title: string;
}

export const Wallet: FC<WalletProps> = ({ title }) => (
  <Flex>
    <WalletName /> <WalletTitle>{title}</WalletTitle>
  </Flex>
);
Wallet.propTypes = {
  title: PropTypes.string.isRequired,
};
