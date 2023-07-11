import { etheriumBlueIcon } from '@cypherock/cysync-ui';
import React from 'react';
import { NoAccountDialog } from '../../components/AddAccount/NoAccountDialog';

export const NoAccount: React.FC = () => {
  const dataArray = [
    {
      id: '1', // Add a unique identifier to each data object
      leftImageSrc: etheriumBlueIcon,
      rightText: '2.35 ETH',
      text: 'Etherium 1',
    },
    {
      id: '2',
      leftImageSrc: etheriumBlueIcon,
      rightText: '0.77 ETH',
      text: 'Etherium 2',
    },
    {
      id: '3',
      leftImageSrc: etheriumBlueIcon,
      rightText: '0.08 ETH',
      text: 'Etherium 3',
    },
  ];

  return (
    <div>
      <NoAccountDialog dataArray={dataArray} />
    </div>
  );
};
