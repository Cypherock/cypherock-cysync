import {
  checkIcon,
  halfLoaderGold,
  joystickArrowIcon,
} from '@cypherock/cysync-ui';
import React from 'react';
import { InitialiseAccountDialog } from '../../components/AddAccount/InitialiseAccountDialog';

export const InitialiseAccount: React.FC = () => {
  const dataArray = [
    {
      id: '1', // Add a unique identifier to each data object
      leftImageSrc: joystickArrowIcon,
      rightImageSrc: checkIcon,
      text: 'Verify the coins on the X1 Vault',
    },
    {
      id: '2',
      leftImageSrc: joystickArrowIcon,
      rightImageSrc: halfLoaderGold,
      text: 'Enter passphrase',
    },
    {
      id: '3',
      leftImageSrc: joystickArrowIcon,
      rightImageSrc: '',
      text: 'Enter the PIN and tap any X1 Card',
    },
  ];

  return (
    <div>
      <InitialiseAccountDialog dataArray={dataArray} />
    </div>
  );
};
