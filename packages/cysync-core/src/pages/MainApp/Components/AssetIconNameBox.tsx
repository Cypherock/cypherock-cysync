import { CoinTypes } from '@cypherock/coins';
import {
  bitcoinIcon,
  ethereumIcon,
  TableIconNameBox,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

interface AssetIconNameBoxProps {
  id: CoinTypes;
  name: string;
  symbol: string;
  size?: 'small' | 'big';
}

const iconMap: Record<CoinTypes, string> = {
  bitcoin: bitcoinIcon,
  ethereum: ethereumIcon,
};

export const AssetIconNameBox: FC<AssetIconNameBoxProps> = ({ ...props }) => (
  <TableIconNameBox
    icon={iconMap[props.id]}
    title={props.symbol}
    subtitle={props.name}
    size={props.size}
  />
);

AssetIconNameBox.defaultProps = {
  size: 'big',
};
