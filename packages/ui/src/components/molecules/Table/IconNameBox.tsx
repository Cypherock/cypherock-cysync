import React, { FC } from 'react';
import styled from 'styled-components';

import { BitcoinIcon, EthereumIcon } from '../../../assets';
import { Container, Typography } from '../../atoms';

export type NameVariants = 'Bitcoin' | 'Ethereum';

interface IconNameBoxProps {
  name: NameVariants;
  symbol: string;
}

const iconMap: Record<NameVariants, FC> = {
  Bitcoin: BitcoinIcon,
  Ethereum: EthereumIcon,
};

const IconNameBoxStyle = styled.div`
  padding: 16px 0 16px 40px;
  width: 300px;
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;
`;

export const IconNameBox: FC<IconNameBoxProps> = ({ name, symbol }) => (
  <IconNameBoxStyle>
    {React.createElement(iconMap[name])}
    <Container direction="column" gap={0} align="flex-start">
      <Typography variant="p" $fontWeight="semibold">
        {symbol}
      </Typography>
      <Typography variant="p" $fontWeight="semibold">
        {name}
      </Typography>
    </Container>
  </IconNameBoxStyle>
);
