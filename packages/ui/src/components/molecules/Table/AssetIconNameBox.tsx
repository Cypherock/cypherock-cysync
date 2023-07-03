import React, { FC } from 'react';

import { IconNameBox, NameVariants } from './IconNameBox';

import { bitcoinIcon, ethereumIcon } from '../../../assets';

export type AssetVariants = 'Bitcoin' | 'Ethereum';

interface AssetIconNameBoxProps {
  name: AssetVariants;
  symbol: string;
  size?: 'small' | 'big';
}

const iconMap: Record<NameVariants, string> = {
  Bitcoin: bitcoinIcon,
  Ethereum: ethereumIcon,
};

export const AssetIconNameBox: FC<AssetIconNameBoxProps> = ({ ...props }) => (
  <IconNameBox
    icon={iconMap[props.name]}
    title={props.symbol}
    subtitle={props.name}
    size={props.size}
  />
);

AssetIconNameBox.defaultProps = {
  size: 'big',
};
