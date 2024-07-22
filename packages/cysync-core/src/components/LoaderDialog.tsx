import { DialogBox, Image, loaderGrayIcon } from '@cypherock/cysync-ui';
import React from 'react';

export const LoaderDialog: React.FC = () => (
  <DialogBox width={500} height={300}>
    <Image
      src={loaderGrayIcon}
      $width={68}
      alt="Loader icon"
      animate="spin"
      $animDuration={3}
    />
  </DialogBox>
);
