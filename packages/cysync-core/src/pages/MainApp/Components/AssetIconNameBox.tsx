import {
  bitcoinIcon,
  ethereumIcon,
  TableIconNameBox,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

export type AssetVariants = 'Bitcoin' | 'Ethereum';

interface AssetIconNameBoxProps {
  name: AssetVariants;
  symbol: string;
  size?: 'small' | 'big';
}

const iconMap: Record<AssetVariants, string> = {
  Bitcoin: bitcoinIcon,
  Ethereum: ethereumIcon,
};

export const AssetIconNameBox: FC<AssetIconNameBoxProps> = ({ ...props }) => (
  <TableIconNameBox
    icon={iconMap[props.name]}
    title={props.symbol}
    subtitle={props.name}
    size={props.size}
  />
);

AssetIconNameBox.defaultProps = {
  size: 'big',
};
