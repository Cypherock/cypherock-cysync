import { DialogBox, Image, loaderGrayIcon } from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { useReceiveDialog } from '../context';

export const DialogLoader: React.FC = () => {
  const { startFlow, onNext, derivedAddress } = useReceiveDialog();

  useEffect(() => {
    startFlow();
  }, []);

  useEffect(() => {
    if (derivedAddress !== undefined) onNext();
  }, [derivedAddress]);

  return (
    <DialogBox width={500} height={300}>
      <Image
        src={loaderGrayIcon}
        width={68}
        alt="Loader icon"
        animate="spin"
        $animDuration={3}
      />
    </DialogBox>
  );
};
